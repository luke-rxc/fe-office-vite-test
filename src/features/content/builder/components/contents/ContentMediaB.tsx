import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Box, Paper, Typography, Divider } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import { ContentFormModel, ContentModel, FormContentMediaBUploaderModel, FormContentMediaBModel } from '../../models';
import { useMediaService } from '../../services';
import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  FORM_KEY,
  MEDIA_B_DESC_MAX_NUM,
  MEDIA_B_SUBTITLE_MAX_NUM,
  MEDIA_B_TITLE_MAX_NUM,
} from '../../constants';
import { getInitFileInfo } from '../../utils';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { MediaFileUploader } from '../MediaFileUploader';
import { TextController } from '../TextController';
import { ControlColorPicker } from '../ControlColorPicker';
import { GuideText, ListItemWrapper } from '../Styled';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 미디어 B 컴포넌트 - 모션 타입
 */
type ContentMediaBProps = {
  content: ContentModel;
};
export const ContentMediaB: VFC<ContentMediaBProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    isOverlay,
    frontImage: frontImageContents,
    middleImage: middleImageContents,
    align,
    textEffect,
    title,
    subTitle,
    description,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentMediaBModel;
  // 미디어 업로드 정보
  const { frontImage, middleImage, backgroundMedia } = formValue[
    FORM_KEY.MEDIA_UPLOADER
  ] as FormContentMediaBUploaderModel;
  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

  // background Media form Value 처리
  const {
    fileInfo: backgroundMediaFileInfo,
    handleChange: handleChangeBackgroundMedia,
    handleRemove: handleRemoveBackgroundMedia,
    fileErrors: backgroundMediaFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(backgroundMedia),
    singleType: true,
    id,
    formKey: 'backgroundMedia',
  });

  // 메인 front Image form Value 처리
  const {
    fileInfo: frontImageFileInfo,
    handleChange: handleChangeFrontImage,
    handleRemove: handleRemoveFrontImage,
    fileErrors: frontImageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(frontImage),
    singleType: true,
    id,
    formKey: 'frontImage',
  });

  // 중앙 고정 middle Image form Value 처리
  const {
    fileInfo: middleImageFileInfo,
    handleChange: handleChangeMiddleImage,
    handleRemove: handleRemoveMiddleImage,
    fileErrors: middleImageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(middleImage),
    singleType: true,
    id,
    formKey: 'middleImage',
  });

  /**
   * 노출시간정보는 (예외적으로) watch로 값 변경시 마다 유효성 체크
   * - 다른 폼 요소는 submit시에만 유효성 체크
   */
  const [displayStartDateTimeValue, displayEndDateTimeValue] = watch([
    `${id}.${FORM_KEY.CONTENTS}.displayStartDateTime`,
    `${id}.${FORM_KEY.CONTENTS}.displayEndDateTime`,
  ]);

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
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      isOverlay,
      frontImage: frontImageContents,
      middleImage: middleImageContents,
      align,
      textEffect,
      title,
      subTitle,
      description,
      isVideoScrollPlay,
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
      <PreviewArcodian
        title="인터렉티브 미디어 B타입 (모션 타입)"
        previewImage={[
          'story/20220209/14d7e2fa-796e-4880-b788-a02a2e9c7ba4.png',
          'story/20220209/cf90396e-b836-4031-80bc-406d72a2ca93.gif',
        ]}
      />

      {/* 백그라운드 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드 설정
        </Typography>
        <List>
          {/* 백그라운드 이미지/비디오 등록 */}
          <ListItemWrapper listTitleName="백그라운드 이미지/비디오 등록" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.backgroundType`}
                  defaultValue={bgType}
                  options={[
                    { label: '이미지/비디오 업로드', value: CONTENT_BACKGROUND_TYPE.MEDIA },
                    { label: '컬러 지정', value: CONTENT_BACKGROUND_TYPE.COLOR },
                  ]}
                  onChangeRadio={(e) => {
                    switch (e.target.value) {
                      case CONTENT_BACKGROUND_TYPE.MEDIA:
                        setBgType(CONTENT_BACKGROUND_TYPE.MEDIA);
                        break;
                      case CONTENT_BACKGROUND_TYPE.COLOR:
                        setBgType(CONTENT_BACKGROUND_TYPE.COLOR);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Grid container>
                  {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Box>
                        <MediaFileUploader
                          fileInfos={backgroundMediaFileInfo.length ? [backgroundMediaFileInfo[0]] : []}
                          width={300}
                          height={533}
                          accept="image/*, video/mp4"
                          multiple={false}
                          maxFiles={backgroundMediaFileInfo.length ? undefined : 1}
                          emptyStatus={!backgroundMediaFileInfo.length}
                          emptyStatusText="IMAGE/VIDEO"
                          fileError={backgroundMediaFileErrors.length ? backgroundMediaFileErrors[0] : null}
                          onChange={(files) => {
                            if (files.length > 0) {
                              handleChangeBackgroundMedia(files);
                            }
                          }}
                          onRemove={(index) => {
                            handleRemoveBackgroundMedia(index);
                          }}
                        />
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <GuideText
                          title="이미지 가이드"
                          desc={['권장 이미지 사이즈: 1080 x 1920px', '이미지 파일 형식: jpg, png']}
                        />
                        <Box sx={{ mt: 1 }} />
                        <GuideText
                          title="비디오 가이드"
                          desc={[
                            '권장 비디오 해상도: 1080 x 1920px',
                            '권장 비디오 러닝타임: 00초',
                            '비디오 파일 형식: MP4',
                          ]}
                        />
                      </Box>
                    </Box>
                  )}
                  {bgType === CONTENT_BACKGROUND_TYPE.COLOR && (
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%' }}>
                        <ControlColorPicker
                          sx={{ display: 'inline' }}
                          name={`${id}.${FORM_KEY.CONTENTS}.backgroundColor`}
                          defaultValue={backgroundColor}
                          colorSize="medium"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </ListItemWrapper>
          {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 비디오 스크롤 재생 */}
              <ListItemWrapper listTitleName="비디오 스크롤 재생">
                <FormControlSwitch
                  name={`${id}.${FORM_KEY.CONTENTS}.isVideoScrollPlay`}
                  defaultValue={isVideoScrollPlay}
                />
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 백그라운드 딤드 */}
              <ListItemWrapper listTitleName="이미지/비디오 딤드 처리">
                <FormControlSwitch name={`${id}.${FORM_KEY.CONTENTS}.isOverlay`} defaultValue={isOverlay} />
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>

      {/* 메인이미지 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          메인이미지
        </Typography>
        <List>
          {/* 메인이미지 등록 */}
          <ListItemWrapper
            listTitleName={
              <>
                메인이미지 등록
                <br /> - 스크롤모션 적용
              </>
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box>
                <MediaFileUploader
                  fileInfos={frontImageFileInfo.length ? [frontImageFileInfo[0]] : []}
                  width={300}
                  height={300}
                  accept="image/*"
                  multiple={false}
                  maxFiles={frontImageFileInfo.length ? undefined : 1}
                  emptyStatus={!frontImageFileInfo.length}
                  emptyStatusText="IMAGE"
                  fileError={frontImageFileErrors.length ? frontImageFileErrors[0] : null}
                  onChange={(files) => {
                    if (files.length > 0) {
                      handleChangeFrontImage(files);
                    }
                  }}
                  onRemove={(index) => {
                    handleRemoveFrontImage(index);
                  }}
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <GuideText
                  title="이미지 가이드"
                  desc={['권장 이미지 사이즈: 1080 x 1080 px', '이미지 파일 형식: jpg, png']}
                />
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 중앙 이미지 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          중앙 이미지
        </Typography>
        <List>
          {/* 중앙 이미지 */}
          <ListItemWrapper listTitleName="중앙 고정 이미지 등록">
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box>
                <MediaFileUploader
                  fileInfos={middleImageFileInfo.length ? [middleImageFileInfo[0]] : []}
                  width={300}
                  height={533}
                  accept="image/*"
                  multiple={false}
                  maxFiles={middleImageFileInfo.length ? undefined : 1}
                  emptyStatus={!middleImageFileInfo.length}
                  emptyStatusText="IMAGE"
                  fileError={middleImageFileErrors.length ? middleImageFileErrors[0] : null}
                  onChange={(files) => {
                    if (files.length > 0) {
                      handleChangeMiddleImage(files);
                    }
                  }}
                  onRemove={(index) => {
                    handleRemoveMiddleImage(index);
                  }}
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <GuideText
                  title="이미지 가이드"
                  desc={['권장 이미지 사이즈:(최소)1080 x 1080 ~ (최대) 1080 x 1920px', '이미지 파일 형식: jpg, png ']}
                />
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 텍스트 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 배치
        </Typography>
        <List>
          {/* 텍스트 배치 */}
          <ListItemWrapper listTitleName="텍스트 배치">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.align`}
                    defaultValue={align}
                    options={[
                      { label: '좌측(가로) 정렬', value: ALIGN_TYPE.LEFT },
                      { label: '중앙(가로) 정렬', value: ALIGN_TYPE.CENTER },
                    ]}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 텍스트 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 등록{' '}
          <Box component="span" sx={{ fontSize: '14px' }}>
            (작성이 필요한 항목만 선택 작성 가능)
          </Box>
        </Typography>
        <List>
          {/* 텍스트 효과 */}
          <ListItemWrapper listTitleName="텍스트 효과">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.textEffect`}
                    defaultValue={textEffect}
                    options={[
                      { label: '모션적용', value: BOOLEAN_VALUE_TYPE.T },
                      { label: '고정', value: BOOLEAN_VALUE_TYPE.F },
                    ]}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 타이틀 */}
          <ListItemWrapper listTitleName="타이틀 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.text`,
                      defaultValue: title?.text,
                      placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_B_TITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_B_TITLE_MAX_NUM },
                      multiline: true,
                    }}
                    textBoldProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.bold`,
                      defaultValue: title?.bold,
                    }}
                    textColorProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.color`,
                      defaultValue: title?.color,
                    }}
                    textSizeProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.sizeType`,
                      defaultValue: title?.sizeType,
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {/* 서브 타이틀(선택) */}
          <ListItemWrapper listTitleName="서브타이틀 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.subTitle.text`,
                      defaultValue: subTitle?.text,
                      placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_B_SUBTITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_B_SUBTITLE_MAX_NUM },
                      multiline: true,
                    }}
                    textBoldProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.subTitle.bold`,
                      defaultValue: subTitle?.bold,
                    }}
                    textColorProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.subTitle.color`,
                      defaultValue: subTitle?.color,
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {/* 디스크립션(선택) */}
          <ListItemWrapper listTitleName="디스크립션 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.description.text`,
                      defaultValue: description?.text,
                      placeholder: `디스크립션을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_B_DESC_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_B_DESC_MAX_NUM },
                      multiline: true,
                    }}
                    textBoldProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.description.bold`,
                      defaultValue: description?.bold,
                    }}
                    textColorProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.description.color`,
                      defaultValue: description?.color,
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
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
