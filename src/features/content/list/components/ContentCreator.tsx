import { useRef, useEffect, useCallback, useState } from 'react';
import type { VFC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { Box, Grid, List, Typography } from '@material-ui/core';
import PlusIcon from '@assets/icons/Plus';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '@hooks/useAuth';
import { useDialog } from '@hooks/useDialog';
import { Modal } from '@components/Modal';
import { DialogType } from '@models/DialogModel';
import { ComboItemModel, ContentCreatorFieldModel } from '../models';
import {
  useContentCreatorService,
  useProviderService,
  useKeywordService,
  useShowroomService,
  useContentValidateOverlapping,
  useContentImageService,
} from '../services';
import { CONTENT_CODE_LENGTH, CONTENT_NAME_LENGTH, CONTENT_TYPE_OPTIONS, CONTENT_VALID_TYPE } from '../constants';
import { validationCreator } from '../utils';
import { FormControlAutoComplete, FormControlTextField } from './form';
import { GuideText, ListItemWrapper } from './Styled';
import { Tooltip } from './Tooltip';
import { MediaUploader } from './MediaUploader';

/**
 * 컨텐츠 생성
 */
type ContentCreatorProps = {
  onConfirm: () => void;
  onCancel: () => void;
};
export const ContentCreator: VFC<ContentCreatorProps> = ({ onConfirm, onCancel }) => {
  const { user } = useAuth();
  const formMethod = useForm<ContentCreatorFieldModel>({
    defaultValues: {
      adminUserId: user?.userId,
      providerId: null,
      showRoomId: null,
      contentsType: null,
      keywordIds: [],
      name: '',
      code: '',
      isValidName: false,
      primaryImageId: null,
    },
    resolver: yupResolver(validationCreator),
  });
  const { handleSubmit: handleFormSubmit, setValue, watch } = formMethod;
  // 콘텐츠 섬네일
  const { imageFileInfo, handleChangeImage, handleRemoveImage, handleImageUpload } = useContentImageService({
    formMethod,
    formKey: 'primaryImageId',
  });
  // 컨텐츠명 중복체크
  const {
    isLoading: isLoadingContentName,
    handleChangeText: handleChangeContentName,
    handleSubmitError: handleErrorContentName,
  } = useContentValidateOverlapping({ type: CONTENT_VALID_TYPE.NAME, formMethod });
  // 컨텐츠코드 중복체크
  const {
    isLoading: isLoadingContentCode,
    handleChangeText: handleChangeContentCode,
    handleSubmitError: handleErrorContentCode,
  } = useContentValidateOverlapping({ type: CONTENT_VALID_TYPE.CODE, formMethod });
  // 스토리 컨텐츠 등록
  const { isSuccess, isError, isLoading, error, handleContentCreator } = useContentCreatorService();
  const { open: openDialog, close: closeDialog } = useDialog();
  const { providerComboList } = useProviderService(); // 입점사 리스트
  const { handleGetShowroomList } = useShowroomService(); // 쇼룸 콤보 리스트
  const { keywordComboList } = useKeywordService(); // 키워드 리스트
  const [showroomComboList, setShowroomComboList] = useState<ComboItemModel[]>([]);
  const formEl = useRef<HTMLFormElement>(null);
  const selectKeywordIds = watch('keywordIds');

  /**
   * 입점사 변경시 쇼룸 콤보 리스트 업데이트
   */
  const handleChangeProvider = async (provider) => {
    if (provider) {
      const { value } = provider as ComboItemModel;
      const res = await handleGetShowroomList(+value);
      setValue('showRoomId', null);
      setShowroomComboList(res);
    } else {
      setValue('showRoomId', null);
      setShowroomComboList([]);
    }
  };

  /**
   * submit error
   */
  const handleSubmitError = useCallback(
    (errors) => {
      if (errors?.isValidName) {
        handleErrorContentName(errors.isValidName);
      }
      if (errors?.isValidCode) {
        handleErrorContentCode(errors.isValidCode);
      }
    },
    [handleErrorContentCode, handleErrorContentName],
  );

  /**
   * submit
   */
  const handleSubmit = (values) => {
    handleContentCreator(values);
  };

  const handleModalCancel = useCallback(() => {
    openDialog({
      title: '콘텐츠 신규 생성',
      content: '정말 콘텐츠 생성을 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        onCancel();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCancel]);

  useEffect(() => {
    if (isSuccess) {
      openDialog({
        title: '콘텐츠 생성완료',
        content: '이제 생성한 콘텐츠를 편집 해 보세요',
        type: DialogType.ALERT,
        onClose: () => {
          closeDialog();
          onConfirm();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      const msg = error.data.message;
      openDialog({
        title: '신규 콘텐츠 생성',
        content: msg ? msg : '신규 콘텐츠 생성에 실패 했습니다.',
        type: DialogType.ALERT,
        onClose: () => {
          closeDialog();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return (
    <>
      <Modal
        title="콘텐츠 신규 생성"
        open={true}
        width={1200}
        maxWidth="initial"
        cancelText="취소"
        disabled={isLoading || isLoadingContentName || isLoadingContentCode}
        confirmText={
          <>
            <SaveIcon />
            &nbsp;신규 생성
          </>
        }
        onConfirm={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await handleImageUpload();
          formEl.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }}
        onCancel={handleModalCancel}
        onClose={handleModalCancel}
      >
        <FormProvider {...formMethod}>
          <form ref={formEl} onSubmit={handleFormSubmit(handleSubmit, (errors) => handleSubmitError(errors))}>
            <Grid container>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper listTitleName="입점사 설정" isRequired listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      {providerComboList.length > 0 && (
                        <FormControlAutoComplete<ContentCreatorFieldModel>
                          name="providerId"
                          fullWidth
                          options={providerComboList}
                          getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
                          placeholder="입점사를 선택하세요"
                          sx={{ width: '100%' }}
                          onChangeAutoComplete={(value) => handleChangeProvider(value)}
                        />
                      )}
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper listTitleName="쇼룸 설정" isRequired listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      <FormControlAutoComplete<ContentCreatorFieldModel>
                        name="showRoomId"
                        fullWidth
                        options={showroomComboList}
                        getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
                        isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                        placeholder="쇼룸을 선택하세요"
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper listTitleName="콘텐츠 타입" isRequired listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      <FormControlAutoComplete<ContentCreatorFieldModel>
                        name="contentsType"
                        fullWidth
                        options={CONTENT_TYPE_OPTIONS}
                        getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
                        isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                        placeholder="콘텐츠 타입을 선택하세요"
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper listTitleName="키워드 관리" listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      <FormControlAutoComplete<ContentCreatorFieldModel>
                        name="keywordIds"
                        fullWidth
                        multiple
                        options={keywordComboList}
                        getOptionLabel={({ label }: ComboItemModel) => label}
                        isOptionEqualToValue={(v: ComboItemModel, o: ComboItemModel) => v.value === o.value}
                        placeholder={selectKeywordIds.length === 0 ? '지정할 키워드를 선택하세요' : ''}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper listTitleName="콘텐츠명" isRequired listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      <FormControlTextField<ContentCreatorFieldModel>
                        name="name"
                        label="콘텐츠명"
                        placeholder={`생성할 콘텐츠 명을 입력하세요(*띄워쓰기포함 최대${CONTENT_NAME_LENGTH}자 이내)`}
                        sx={{ width: '100%' }}
                        onBlur={(e) => handleChangeContentName(e.target.value)}
                        disabled={isLoadingContentName}
                        inputProps={{ max: CONTENT_NAME_LENGTH }}
                      />
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List>
                  <ListItemWrapper
                    listTitleName={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>콘텐츠 코드</span>
                        <Tooltip
                          text={
                            <>
                              *등록한 코드는 해당 콘텐츠의 weblink 생성시
                              <br />
                              경로 구분값으로 사용됩니다.
                              <br />
                              예) http://prizm.co.kr/story/<span style={{ color: 'red' }}>example</span>
                            </>
                          }
                        ></Tooltip>
                      </Box>
                    }
                    isRequired
                    listTitleWidth={130}
                  >
                    <Box sx={{ width: '100%' }}>
                      <FormControlTextField<ContentCreatorFieldModel>
                        name="code"
                        label="콘텐츠 코드"
                        placeholder={`생성할 콘텐츠 코드를 입력하세요(*영문, 숫자조합 최대 ${CONTENT_CODE_LENGTH}자 이내)`}
                        sx={{ width: '100%' }}
                        // onBlur={(e) => handleValidContent(e, CONTENT_VALID_TYPE.CODE)}
                        onBlur={(e) => handleChangeContentCode(e.target.value)}
                        disabled={isLoadingContentCode}
                        inputProps={{ max: CONTENT_CODE_LENGTH }}
                      />
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <List>
                  <ListItemWrapper listTitleName="썸네일 이미지" listTitleWidth={130}>
                    <Box sx={{ width: '100%' }}>
                      <Grid container>
                        <Grid item xs={5}>
                          <MediaUploader
                            fileInfos={imageFileInfo}
                            width={300}
                            height={225}
                            accept="image/*"
                            multiple={false}
                            maxFiles={1}
                            fileButtonType="PREVIEW"
                            fileButtonTitle={
                              <>
                                IMAGE
                                <br />
                                <PlusIcon />
                              </>
                            }
                            onFileChange={handleChangeImage}
                            onRemove={handleRemoveImage}
                          />
                        </Grid>
                        <Grid item xs={7}>
                          <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                            등록한 썸네일 이미지는 콘텐츠가 노출되는 쇼룸 및 서비스의 각 영역에서 노출됩니다
                          </Typography>
                          <GuideText
                            title="이미지 가이드"
                            desc={['권장 이미지 사이즈: 1024 x 768', '이미지 파일 형식: jpg, png']}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
