import { useRef, useEffect, useCallback, useState } from 'react';
import type { VFC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { Box, Button, Chip, FormHelperText, Grid, List, Typography } from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import { isDate, format } from 'date-fns';
import PlusIcon from '@assets/icons/Plus';
import { Modal } from '@components/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '@hooks/useAuth';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { pathConfig } from '@config';
import { ComboItemModel, ContentDefaultFieldModel } from '../models';
import {
  useContentDefaultService,
  useKeywordService,
  useContentValidateOverlapping,
  useShowroomService,
  useContentClipboardService,
  useContentImageService,
  useProviderService,
} from '../services';
import {
  CONTENT_CODE_LENGTH,
  CONTENT_NAME_LENGTH,
  CONTENT_STATUS_OPTIONS,
  CONTENT_STATUS_TYPE,
  CONTENT_TYPE_LABEL,
  CONTENT_VALID_TYPE,
} from '../constants';
import { validationContentDefault } from '../utils';
import { FormControlAutoComplete, FormControlCheckbox, FormControlTextField, FormControlSelect } from './form';
import { Tooltip } from './Tooltip';
import { ContentLinkCopy } from './ContentLinkCopy';
import { MediaUploader } from './MediaUploader';
import { GuideText, ListItemWrapper } from './Styled';

/**
 * 콘텐츠 기본관리
 */
type ContentDefaultProps = {
  contentId: number; // 콘텐츠 id
  onConfirm: () => void;
  onCancel: () => void;
};
export const ContentDefault: VFC<ContentDefaultProps> = ({ contentId, onConfirm, onCancel }) => {
  const { user } = useAuth();
  const formMethod = useForm<ContentDefaultFieldModel>({
    defaultValues: {
      adminUserId: user?.userId,
      providerId: null,
      showRoomId: null,
      keywordIds: [],
      code: '',
      isValidCode: true,
      name: '',
      isValidName: true,
      publicStartDate: '',
      publicEndDate: '',
      noEndDate: false,
      status: CONTENT_STATUS_TYPE.PRIVATE,
      primaryImage: null,
    },
    resolver: yupResolver(validationContentDefault),
  });
  const {
    handleSubmit: handleFormSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = formMethod;
  // 콘텐츠 섬네일
  const { imageFileInfo, handleChangeImage, handleRemoveImage, handleImageUpload } = useContentImageService({
    formMethod,
    formKey: 'primaryImage',
  });
  // 컨텐츠명 중복체크
  const {
    isLoading: isLoadingContentName,
    handleChangeText: handleChangeContentName,
    handleSubmitError: handleErrorContentName,
  } = useContentValidateOverlapping({
    type: CONTENT_VALID_TYPE.NAME,
    contentId,
    formMethod,
  });
  // 컨텐츠코드 중복체크
  const {
    isLoading: isLoadingContentCode,
    textValue: contentCode,
    handleChangeText: handleChangeContentCode,
    handleSubmitError: handleErrorContentCode,
  } = useContentValidateOverlapping({
    type: CONTENT_VALID_TYPE.CODE,
    contentId,
    formMethod,
  });
  // 컨텐츠 기본정보 관리 조회
  const {
    contentDefault,
    isSuccess,
    isLoading,
    isError,
    isUpdateSuccess,
    isUpdateError,
    updateError,
    handleInvalidateQuery,
    handleUpdateContentDefault,
  } = useContentDefaultService(contentId);
  const { open: openDialog, close: closeDialog } = useDialog();
  const { providerComboList } = useProviderService(); // 입점사 리스트
  const { handleGetShowroomList } = useShowroomService(); // 쇼룸 콤보 리스트
  const { keywordComboList } = useKeywordService(); // 키워드 리스트
  const { onClickClipboardCopy } = useContentClipboardService(); // 클립보드 복사
  const [showroomComboList, setShowroomComboList] = useState<ComboItemModel[]>([]);
  const [contentType, setContentType] = useState(''); // 컨텐츠타입
  const [contentUrl, setContentUrl] = useState(''); // 컨텐츠 url
  const formEl = useRef<HTMLFormElement>(null);
  const clipboardRef = useRef<HTMLDivElement>();
  const [isNoEndDate, selectKeywordIds] = watch(['noEndDate', 'keywordIds']);

  /**
   * 쇼룸 리스트 업데이트
   * 초기 쇼룸 콤보 노출처리를 위한 formValue 업데이트
   */
  const handleGetShowroomComboList = useCallback(
    async (providerId) => {
      const showrooms = await handleGetShowroomList(providerId);
      setShowroomComboList(showrooms);
      if (contentDefault.showRoomId) {
        const showroom = showrooms.find((showroom) => showroom.value === contentDefault.showRoomId);
        setValue('showRoomId', showroom); // 초기 쇼룸 콤보 노출값
      }
    },
    [handleGetShowroomList, setValue, contentDefault],
  );

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
    const { publicStartDate, publicEndDate, noEndDate } = values;
    const startDate = getDateValues(new Date(publicStartDate).getTime());
    const endDate = getDateValues(new Date(publicEndDate).getTime());

    if (!noEndDate && !!startDate && !!endDate && startDate > endDate) {
      setError('publicStartDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      setError('publicEndDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      return;
    }

    handleUpdateContentDefault(values);
  };

  /**
   * 날짜값 조회
   */
  const getDateValues = (dateValue: number | string) => {
    return Number.isInteger(dateValue) ? dateValue : isDate(dateValue) ? new Date(dateValue).getTime() : undefined;
  };

  const handleModalCancel = useCallback(() => {
    openDialog({
      title: '콘텐츠 기본관리',
      content: '정말 수정을 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        onCancel();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCancel]);

  /**
   * 초기 키워드 콤보 노출처리를 위한 formValue 업데이트
   */
  useEffect(() => {
    if (keywordComboList && contentDefault?.keywords) {
      const ids = contentDefault.keywords.map((keyword) => keyword.id);
      const keywords = keywordComboList.filter((keywordCombo) => {
        const value = keywordCombo.value as number;
        return ids.includes(value);
      });
      setValue('keywordIds', keywords); // 초기 키워드 콤보 노출값
    }
  }, [keywordComboList, contentDefault, setValue]);

  useEffect(() => {
    if (contentDefault) {
      const { providerId, code, name, publicStartDate, publicEndDate, status, type, primaryImage } = contentDefault;
      handleGetShowroomComboList(providerId);
      // 초기 formValue 업데이트
      setValue('code', code);
      setValue('name', name);
      setValue('publicStartDate', publicStartDate ? format(new Date(publicStartDate), "yyyy-MM-dd'T'HH:mm:ss") : '');
      setValue('publicEndDate', publicEndDate ? format(new Date(publicEndDate), "yyyy-MM-dd'T'HH:mm:ss") : '');
      setValue('status', status);
      setValue('noEndDate', publicEndDate ? false : true);
      setValue('primaryImage', primaryImage?.id);
      if (primaryImage?.path) {
        handleChangeImage([{ path: primaryImage.path, extension: primaryImage.extension }]);
      }
      setContentType(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentDefault]);

  useEffect(() => {
    if (providerComboList.length && contentDefault) {
      const { providerId } = contentDefault;
      const provider = providerComboList.find((provider) => provider.value === providerId);
      setValue('providerId', provider); // 초기 쇼룸 콤보 노출값
    }
  }, [providerComboList, contentDefault, setValue]);

  useEffect(() => {
    clearErrors('primaryImage');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFileInfo]);

  useEffect(() => {
    if (isUpdateSuccess) {
      openDialog({
        title: '기본관리 수정완료',
        content: '수정되었습니다.',
        type: DialogType.ALERT,
        onClose: () => {
          closeDialog();
          onConfirm();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isUpdateError && updateError) {
      const msg = updateError.data.message;
      openDialog({
        title: '기본관리 수정',
        content: msg ? msg : '기본관리 수정에 실패 했습니다.',
        type: DialogType.ALERT,
        onClose: () => {
          closeDialog();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (contentDefault) {
      const url = `${pathConfig.serviceUrl}/${contentDefault?.type.toLowerCase()}/${
        contentCode || contentDefault?.code
      }`;
      setContentUrl(url);
    }
  }, [contentDefault, contentCode]);

  return (
    <>
      <Modal
        title="기본정보 관리"
        open={true}
        width={1200}
        minHeight={900}
        maxWidth="initial"
        cancelText="취소"
        disabled={isLoading || isLoadingContentName || isLoadingContentCode}
        confirmText={
          <>
            <SaveIcon />
            &nbsp;변경사항 저장
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
        {isSuccess && contentDefault && (
          <FormProvider {...formMethod}>
            <form ref={formEl} onSubmit={handleFormSubmit(handleSubmit, (errors) => handleSubmitError(errors))}>
              <Grid container>
                <Grid item xs={6}>
                  <List>
                    <ListItemWrapper listTitleName="콘텐츠 타입" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <Chip
                          color="secondary"
                          label={CONTENT_TYPE_LABEL[contentType]}
                          variant="outlined"
                          sx={{ minWidth: 100 }}
                        />
                      </Box>
                    </ListItemWrapper>
                  </List>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  <List>
                    <ListItemWrapper listTitleName="입점사 설정" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        {providerComboList.length > 0 && (
                          <FormControlAutoComplete<ContentDefaultFieldModel>
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
                    <ListItemWrapper listTitleName="쇼룸" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <FormControlAutoComplete<ContentDefaultFieldModel>
                          name="showRoomId"
                          fullWidth
                          options={showroomComboList.length > 0 ? showroomComboList : []}
                          getOptionLabel={({ label }: ComboItemModel) => (label ? label : '')}
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
                    <ListItemWrapper listTitleName="공개설정" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <FormControlSelect<ContentDefaultFieldModel>
                          name="status"
                          defaultValue={contentDefault.status}
                          options={CONTENT_STATUS_OPTIONS}
                          sx={{ width: '100%' }}
                        ></FormControlSelect>
                      </Box>
                    </ListItemWrapper>
                  </List>
                </Grid>

                <Grid item xs={6}>
                  <List>
                    <ListItemWrapper listTitleName="키워드 관리" listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <FormControlAutoComplete<ContentDefaultFieldModel>
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
                    <ListItemWrapper listTitleName="콘텐츠 명" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <FormControlTextField<ContentDefaultFieldModel>
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
                <Grid item xs={6} ref={clipboardRef}>
                  <List>
                    <ListItemWrapper listTitleName="콘텐츠 코드" isRequired listTitleWidth={130}>
                      <Box sx={{ width: '100%' }}>
                        <Box>
                          <FormControlTextField<ContentDefaultFieldModel>
                            name="code"
                            label="콘텐츠 코드"
                            placeholder={`생성할 콘텐츠 코드를 입력하세요(*영문, 숫자조합 최대 ${CONTENT_CODE_LENGTH}자 이내)`}
                            sx={{ width: '100%' }}
                            onBlur={(e) => handleChangeContentCode(e.target.value)}
                            disabled={isLoadingContentCode}
                            inputProps={{ max: CONTENT_CODE_LENGTH }}
                          />
                        </Box>
                        <Box>
                          <ContentLinkCopy
                            value={contentUrl}
                            onClickClipboardCopy={(value) => onClickClipboardCopy(value, clipboardRef.current)}
                          />
                        </Box>
                      </Box>
                    </ListItemWrapper>
                  </List>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <List>
                    <ListItemWrapper listTitleName="썸네일 이미지" isRequired listTitleWidth={130}>
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
                              error={!!errors?.primaryImage}
                            />
                            {errors?.primaryImage && (
                              <Box sx={{ mt: 2 }}>
                                <FormHelperText error>{errors?.primaryImage?.message}</FormHelperText>
                              </Box>
                            )}
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
              <Grid container item>
                <List>
                  <ListItemWrapper listTitleName="공개기간" isRequired listTitleWidth={130}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <FormControlTextField<ContentDefaultFieldModel>
                        name="publicStartDate"
                        type="datetime-local"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ ml: 0, mr: 2 }}
                      />
                      <div>~</div>
                      <FormControlTextField<ContentDefaultFieldModel>
                        name="publicEndDate"
                        type="datetime-local"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={isNoEndDate}
                        sx={{ ml: 2, mr: 2 }}
                      />
                      <FormControlCheckbox<ContentDefaultFieldModel> name="noEndDate" label="종료일 없음" />
                      <Tooltip
                        text={
                          <>
                            *해당 콘텐츠의 종료일을 지정하지 않으며,
                            <br />
                            사용자에게 계속 노출되도록 설정됩니다.
                          </>
                        }
                      ></Tooltip>
                    </Box>
                  </ListItemWrapper>
                </List>
              </Grid>
            </form>
          </FormProvider>
        )}
        {isError && (
          <Box sx={{ padding: 20 }}>
            <Grid container sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} spacing={3}>
              <Grid item xs={12}>
                컨텐츠 정보를 조회 할 수 없습니다.
              </Grid>
              <Grid item xs={12}>
                <Button
                  startIcon={<RotateLeftSharpIcon />}
                  onClick={handleInvalidateQuery}
                  sx={{ width: 100 }}
                  variant="outlined"
                >
                  retry
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Modal>
    </>
  );
};
