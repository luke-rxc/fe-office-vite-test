import { useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Typography, Box, Paper, Divider, Button } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import {
  ContentFormModel,
  ContentModel,
  FormContentTextItemModel,
  FormContentTextModel,
  FormContentTextUploaderModel,
} from '../../models';
import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  FORM_KEY,
  TEXT_DESC_MAX_NUM,
  TEXT_SUBTITLE1_MAX_NUM,
  TEXT_SUBTITLE2_MAX_NUM,
  TEXT_SUBTITLE3_MAX_NUM,
  TEXT_TITLE1_MAX_NUM,
  TEXT_TITLE2_MAX_NUM,
} from '../../constants';
import { getInitFileInfo } from '../../utils';
import { useMediaService } from '../../services';
import { MediaFileUploader } from '../MediaFileUploader';
import { ControlColorPicker } from '../ControlColorPicker';
import { ControlMediaRatioRadio } from '../ControlMediaRatioRadio';
import { TextController } from '../TextController';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { GuideText, ListItemWrapper } from '../Styled';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 텍스트 컴포넌트
 */
type ContentTextProps = {
  content: ContentModel;
};
export const ContentText: VFC<ContentTextProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, unregister, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);

  // 콘텐츠 정보
  const {
    align,
    textEffect,
    title1,
    title2,
    subTitle1,
    subTitle2,
    subTitle3,
    description,
    useMedia,
    mediaViewRatioType,
    isMediaRound,
    media: mediaContents,
    useBackground,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    parallaxMode,
    isOverlay,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentTextModel;
  // 미디어 업로드 정보
  const { media, backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentTextUploaderModel;

  const [descriptionList, setDescriptionList] = useState<FormContentTextItemModel[]>(description);
  const [isUseMedia, setIsUseMedia] = useState<boolean>(useMedia);
  const [isUseBackground, setIsUseBackground] = useState<boolean>(useBackground);
  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

  // 대표 미디어 form Value 처리
  const {
    fileInfo: mainMediaFileInfo,
    handleChange: handleChangeMainMedia,
    handleRemove: handleRemoveMainMedia,
    fileErrors: mainMediaFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(media),
    singleType: true,
    id,
    formKey: 'media',
  });

  // background Image form Value 처리
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

  /**
   * 디스크립션 삭제
   */
  const handleRemoveDesc = useCallback(
    (index: number) => {
      const formKey = 'description';
      const descValue = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      const newList = descValue.filter((_, idx) => idx !== index);
      unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...formValue[FORM_KEY.CONTENTS],
        [formKey]: newList,
      });
      setDescriptionList(newList);
    },
    [formValue, getValues, id, setValue, unregister],
  );

  /**
   * 디스크립션 추가
   */
  const handleAddDesc = useCallback(() => {
    const formKey = 'description';
    const descValue = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
    const newList = [
      ...descValue,
      {
        text: '',
        bold: false,
        color: '',
      },
    ];
    setValue(`${id}.${FORM_KEY.CONTENTS}.${formKey}`, newList);
    setDescriptionList(newList);
  }, [id, getValues, setValue]);

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
      align,
      textEffect,
      title1,
      title2,
      subTitle1,
      subTitle2,
      subTitle3,
      description,
      useMedia,
      mediaViewRatioType,
      isMediaRound,
      media: mediaContents,
      useBackground,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      parallaxMode,
      isOverlay,
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
        title="텍스트 컴포넌트"
        previewImage={['story/20220209/43e3d8f0-dcb5-4d6c-acb9-5b3a627e5bdb.png']}
      />

      {/* 텍스트 배치 */}
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

      {/* 텍스트 등록  */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 등록 - <span style={{ fontSize: '14px' }}>(작성이 필요한 항목만 선택 작성 가능)</span>
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
          {/* 서브타이틀 1 */}
          <ListItemWrapper listTitleName="서브 타이틀1 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle1.text`,
                    defaultValue: subTitle1?.text,
                    placeholder: `서브 타이틀을 입력하세요(띄워쓰기 포함 최대 ${TEXT_SUBTITLE1_MAX_NUM}자 이내)`,
                    inputProps: { max: TEXT_SUBTITLE1_MAX_NUM },
                    multiline: true,
                  }}
                  textBoldProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle1.bold`,
                    defaultValue: subTitle1?.bold,
                  }}
                  textColorProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle1.color`,
                    defaultValue: subTitle1?.color,
                  }}
                />
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 타이틀 1 */}
          <ListItemWrapper listTitleName="타이틀 1 (선택) - 미디어 상위 노출">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.title1.text`,
                    defaultValue: title1?.text,
                    placeholder: `타이틀을 입력하세요(띄워쓰기 포함 최대 ${TEXT_TITLE1_MAX_NUM}자 이내)`,
                    inputProps: { max: TEXT_TITLE1_MAX_NUM },
                    multiline: true,
                  }}
                  textBoldProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.title1.bold`,
                    defaultValue: title1?.bold,
                  }}
                  textColorProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.title1.color`,
                    defaultValue: title1?.color,
                  }}
                  textSizeProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.title1.sizeType`,
                    defaultValue: title1?.sizeType,
                  }}
                />
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 서브타이틀 1 */}
          <ListItemWrapper listTitleName="서브 타이틀2 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle2.text`,
                    defaultValue: subTitle2?.text,
                    placeholder: `서브 타이틀을 입력하세요(띄워쓰기 포함 최대 ${TEXT_SUBTITLE2_MAX_NUM}자 이내)`,
                    inputProps: { max: TEXT_SUBTITLE2_MAX_NUM },
                    multiline: true,
                  }}
                  textBoldProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle2.bold`,
                    defaultValue: subTitle2?.bold,
                  }}
                  textColorProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle2.color`,
                    defaultValue: subTitle2?.color,
                  }}
                />
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 타이틀 2 */}
          <ListItemWrapper listTitleName="타이틀 2 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title2.text`,
                      defaultValue: title2?.text,
                      placeholder: `타이틀을 입력하세요(띄워쓰기 포함 최대 ${TEXT_TITLE2_MAX_NUM}자 이내)`,
                      inputProps: { max: TEXT_TITLE2_MAX_NUM },
                      multiline: true,
                    }}
                    textBoldProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title2.bold`,
                      defaultValue: title2?.bold,
                    }}
                    textColorProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title2.color`,
                      defaultValue: title2?.color,
                    }}
                    textSizeProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title2.sizeType`,
                      defaultValue: title2?.sizeType,
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 서브타이틀 3 */}
          <ListItemWrapper listTitleName="서브 타이틀3 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle3.text`,
                    defaultValue: subTitle3?.text,
                    placeholder: `서브 타이틀을 입력하세요(띄워쓰기 포함 최대 ${TEXT_SUBTITLE3_MAX_NUM}자 이내)`,
                    inputProps: { max: TEXT_SUBTITLE3_MAX_NUM },
                    multiline: true,
                  }}
                  textBoldProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle3.bold`,
                    defaultValue: subTitle3?.bold,
                  }}
                  textColorProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle3.color`,
                    defaultValue: subTitle3?.color,
                  }}
                />
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 디스크립션 */}
          <ListItemWrapper listTitleName="디스크립션 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                {descriptionList.map((description, index) => (
                  <Box sx={{ width: '100%', mt: index !== 0 && 3 }} key={index}>
                    {index !== 0 && <Divider sx={{ mb: 3 }} />}
                    <TextController
                      textInputProps={{
                        name: `${id}.${FORM_KEY.CONTENTS}.description.${index}.text`,
                        defaultValue: description?.text,
                        placeholder: `디스크립션을 입력하세요(띄워쓰기 포함 최대 ${TEXT_DESC_MAX_NUM}자 이내)`,
                        inputProps: { max: TEXT_DESC_MAX_NUM },
                        multiline: true,
                      }}
                      textBoldProps={{
                        name: `${id}.${FORM_KEY.CONTENTS}.description.${index}.bold`,
                        defaultValue: description?.bold,
                      }}
                      textColorProps={{
                        name: `${id}.${FORM_KEY.CONTENTS}.description.${index}.color`,
                        defaultValue: description?.color,
                      }}
                    />
                    {descriptionList.length > 1 && (
                      <div style={{ textAlign: 'right' }}>
                        <Button
                          type="button"
                          variant="contained"
                          color="secondary"
                          sx={{ textAlign: 'right', minWidth: 80 }}
                          onClick={() => handleRemoveDesc(index)}
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </Box>
                ))}

                <div style={{ width: '100%' }}>
                  <Divider sx={{ mt: 3, mb: 3 }} />
                  <Button
                    type="button"
                    onClick={() => handleAddDesc()}
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2, minWidth: 100 }}
                  >
                    + 디스크립션 문단 추가
                  </Button>
                </div>
              </Grid>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 이미지 / 비디오 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          이미지 / 비디오
        </Typography>
        <List>
          {/* 이미지 비디오 등록 */}
          <ListItemWrapper listTitleName="이미지 / 비디오 등록">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useMedia`}
                    defaultValue={useMedia}
                    onChangeSwitch={(value) => setIsUseMedia(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseMedia && (
            <Box>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 이미지 / 비디오 노출 타입 */}
              <ListItemWrapper listTitleName="이미지 / 비디오 노출 타입">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <ControlMediaRatioRadio
                        row
                        name={`${id}.${FORM_KEY.CONTENTS}.mediaViewRatioType`}
                        defaultValue={mediaViewRatioType}
                        videoType={true}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 이미지 / 비디오 노출시 모서리 라운드 설정  */}
              <ListItemWrapper listTitleName="이미지 / 비디오 모서리 라운드 설정">
                <Box sx={{ width: '100%' }}>
                  <Grid container item>
                    <Box sx={{ width: '100%' }}>
                      <FormControlRadioGroup
                        row
                        name={`${id}.${FORM_KEY.CONTENTS}.isMediaRound`}
                        defaultValue={isMediaRound}
                        options={[
                          { label: '라운드 노출', value: BOOLEAN_VALUE_TYPE.T },
                          { label: '라운드 없음', value: BOOLEAN_VALUE_TYPE.F },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Box>
              </ListItemWrapper>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 이미지 / 비디오 등록  */}
              <ListItemWrapper listTitleName="이미지 / 비디오 파일 등록">
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box>
                      <MediaFileUploader
                        fileInfos={mainMediaFileInfo.length ? [mainMediaFileInfo[0]] : []}
                        width={300}
                        height={400}
                        accept="image/*, video/mp4"
                        multiple={false}
                        maxFiles={mainMediaFileInfo.length ? undefined : 1}
                        emptyStatus={!mainMediaFileInfo.length}
                        emptyStatusText="IMAGE/VIDEO"
                        fileError={mainMediaFileErrors.length ? mainMediaFileErrors[0] : null}
                        onChange={(files) => {
                          if (files.length > 0) {
                            handleChangeMainMedia(files);
                          }
                        }}
                        onRemove={(index) => {
                          handleRemoveMainMedia(index);
                        }}
                      />
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <GuideText
                        title="이미지 가이드"
                        desc={[
                          '권장 이미지 사이즈',
                          '- (1:1) 1440 x 1440px',
                          '- (4:3) 1440 x 1080px',
                          '- (3:4) 1080 x 1440px',
                          '이미지 파일 형식: jpg, png',
                        ]}
                      />
                      <Box sx={{ mt: 1 }} />
                      <GuideText
                        title="비디오 가이드"
                        desc={[
                          '권장 비디오 해상도',
                          '- (1:1) 1080 x 1080px',
                          '- (4:3) 1080 x 810px',
                          '- (3:4) 1080 x 1440px',
                          '비디오 파일 형식: MP4',
                        ]}
                      />
                    </Box>
                  </Box>
                </Box>
              </ListItemWrapper>
            </Box>
          )}
        </List>
      </Paper>

      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드
        </Typography>
        <List>
          {/* 백그라운드 설정방식 */}
          <ListItemWrapper listTitleName="백그라운드 설정">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlSwitch
                    name={`${id}.${FORM_KEY.CONTENTS}.useBackground`}
                    defaultValue={useBackground}
                    onChangeSwitch={(value) => setIsUseBackground(value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          {isUseBackground && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 백그라운드 미디어 */}
              <ListItemWrapper listTitleName="백그라운드 이미지/비디오">
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ width: '100%' }}>
                    <Grid container item>
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
                    </Grid>
                  </Box>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Grid container>
                      {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Box>
                              <MediaFileUploader
                                fileInfos={backgroundMediaFileInfo.length ? [backgroundMediaFileInfo[0]] : []}
                                width={300}
                                height={400}
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
                                desc={[
                                  '권장 이미지 사이즈: (최소)1080 x 1080 ~ (최대) 1080 x 1920px',
                                  '이미지 파일 형식: jpg, png',
                                ]}
                              />
                              <Box sx={{ mt: 1 }} />
                              <GuideText
                                title="비디오 가이드"
                                desc={[
                                  '권장 비디오 해상도: (최소)1080 x 1080 ~ (최대) 1080 x 1920 px',
                                  '권장 비디오 러닝타임: 00초',
                                  '비디오 파일 형식: MP4',
                                ]}
                              />
                            </Box>
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
                  {/* 백그라운드 패럴럭스  */}
                  {/* <ListItemWrapper listTitleName="패럴럭스 효과">
                    <FormControlSwitch name={`${id}.${FORM_KEY.CONTENTS}.parallaxMode`} defaultValue={parallaxMode} />
                  </ListItemWrapper>
                  <Divider sx={{ mt: 3, mb: 3 }} /> */}
                  {/* 비디오 스크롤 재생  */}
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
