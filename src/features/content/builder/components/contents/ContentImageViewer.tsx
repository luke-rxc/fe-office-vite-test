import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Box, Paper, Typography, Grid, Divider } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import {
  ContentFormModel,
  ContentModel,
  FormContentImageViewerModel,
  FormContentImageViewerUploaderModel,
} from '../../models';
import { FORM_KEY, IMAGE_VIEWER_ACTION_TYPE, IMAGE_VIEWER_ACTION_TYPE_OPTIONS } from '../../constants';
import { useMediaService } from '../../services';
import { getImageActionPlaceHolderLabel, getInitFileInfo } from '../../utils';
import { FormControlInput, FormControlSelect, FormControlSwitch } from '../form';
import { MediaFileUploader } from '../MediaFileUploader';
import { GuideText, ListItemWrapper } from '../Styled';

/**
 * 이미지뷰어 컴포넌트
 */
type ContentImageViewerProps = {
  content: ContentModel;
};
export const ContentImageViewer: VFC<ContentImageViewerProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    image: imageContents,
    actions,
    useActions,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentImageViewerModel;
  // 미디어 업로드 정보
  const { image } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentImageViewerUploaderModel;

  // main Image form Value 처리
  const {
    fileInfo: imageFileInfo,
    handleChange: handleChangeImage,
    handleRemove: handleRemoveImage,
    fileErrors: imageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(image),
    singleType: true,
    id,
    formKey: 'image',
  });
  const [isUseActions, setIsUseActions] = useState<boolean>(useActions);
  const [actionType, setActionType] = useState<IMAGE_VIEWER_ACTION_TYPE>(actions.actionType);
  const [placeholderText, setPlaceholderText] = useState<string>('');
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

  /**
   * 노출시간정보는 (예외적으로) watch로 값 변경시 마다 유효성 체크
   * - 다른 폼 요소는 submit시에만 유효성 체크
   */
  const [displayStartDateTimeValue, displayEndDateTimeValue] = watch([
    `${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`,
    `${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`,
  ]);

  useEffect(() => {
    setPlaceholderText(getImageActionPlaceHolderLabel(actionType));
  }, [actionType]);

  useEffect(() => {
    trigger(`${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`);
    trigger(`${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`);
  }, [displayStartDateTimeValue, displayEndDateTimeValue, trigger, id]);

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      image: imageContents,
      actions,
      useActions,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 이미지 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          이미지 설정
        </Typography>
        <List>
          {/* 이미지 등록 */}
          <ListItemWrapper listTitleName="이미지 등록" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box>
                  <MediaFileUploader
                    fileInfos={imageFileInfo.length ? [imageFileInfo[0]] : []}
                    width={300}
                    height={300}
                    accept="image/*"
                    multiple={false}
                    maxFiles={imageFileInfo.length ? undefined : 1}
                    emptyStatus={!imageFileInfo.length}
                    emptyStatusText="IMAGE"
                    fileError={imageFileErrors.length ? imageFileErrors[0] : null}
                    onChange={(files) => {
                      if (files.length > 0) {
                        handleChangeImage(files);
                      }
                    }}
                    onRemove={(index) => {
                      handleRemoveImage(index);
                    }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <GuideText
                    title="이미지 업로드 가이드"
                    desc={['권장 이미지 사이즈: 1440 x 1440+ px', '이미지 파일 형식: jpg, png, gif']}
                  />
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>
      {/* 랜딩 설정  */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          랜딩 URL 설정
        </Typography>
        <List>
          {/* 랜딩 URL 설정 */}
          <ListItemWrapper listTitleName="랜딩 URL 사용">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useActions`}
                    defaultValue={useActions}
                    onChangeSwitch={(value) => setIsUseActions(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseActions && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              <Box sx={{ width: '100%' }}>
                <Grid container item>
                  <Box sx={{ width: '100%' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <FormControlSelect
                          name={`${id}.${FORM_KEY.CONTENTS}.actions.actionType`}
                          defaultValue={actions.actionType}
                          label="랜딩 타입"
                          options={IMAGE_VIEWER_ACTION_TYPE_OPTIONS}
                          displayEmpty
                          sx={{ width: '100%' }}
                          onChangeSelect={(e) => {
                            setActionType(e.target.value);
                          }}
                        ></FormControlSelect>
                      </Grid>
                      <Grid container item xs={9}>
                        <FormControlInput
                          name={`${id}.${FORM_KEY.CONTENTS}.actions.value`}
                          defaultValue={actions.value}
                          sx={{ width: '100%' }}
                          placeholder={placeholderText}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </>
          )}
        </List>
      </Paper>

      {/* 노출 기간 설정  */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          노출 기간 설정
        </Typography>
        <List>
          {/* 예약 설정 */}
          <ListItemWrapper listTitleName="예약 설정">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useDisplayDateTime`}
                    defaultValue={useDisplayDateTime}
                    onChangeSwitch={(value) => setIsUseDisplayDateTime(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseDisplayDateTime && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 노출 시작 */}
              <ListItemWrapper listTitleName="노출 시작">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlDatePickerLocal
                        name={`${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`}
                        defaultValue={displayStartDateTime}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              {/* 노출 종료 */}
              <ListItemWrapper listTitleName="노출 종료">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlDatePickerLocal
                        name={`${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`}
                        defaultValue={displayEndDateTime}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>
    </>
  );
};
