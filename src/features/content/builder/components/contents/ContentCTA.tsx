import React, { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Typography, Box, Paper, Divider, Button } from '@material-ui/core';
import styled from '@emotion/styled';
import { FormControlDatePickerLocal } from '@components/form';
import {
  ContentFormModel,
  ContentModel,
  FormContentCtaButtonModel,
  FormContentCTAModel,
  FormContentCTAUploaderModel,
} from '../../models';
import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  BUTTON_MAX_NUM,
  CONTENT_BACKGROUND_TYPE,
  CTA_BUTTON_TYPE,
  CTA_TITLE_MAX_NUM,
  FORM_KEY,
  LAYOUT_DIRECTION_TYPE,
} from '../../constants';
import { getInitFileInfo } from '../../utils';
import { useMediaService } from '../../services';
import { MediaFileUploader } from '../MediaFileUploader';
import { ControlColorPicker } from '../ControlColorPicker';
import { TextController } from '../TextController';
import { CTAButton } from '../CTAButton';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { GuideText, ListItemWrapper } from '../Styled';
import { getInitCTAButton } from '../../utils';
import { CTA_DESC_MAX_NUM, CTA_SUBTITLE_MAX_NUM, CTA_BUTTON_TOP_SPACING } from '../../constants/contentCTA';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * CTA 컴포넌트
 */
type ContentCTAProps = {
  content: ContentModel;
};
export const ContentCTA: VFC<ContentCTAProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, unregister, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);

  // 콘텐츠 정보
  const {
    direction,
    buttonTopSpacing,
    buttonType,
    textEffect,
    title,
    subTitle,
    description,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    isOverlay,
    align,
    buttons,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentCTAModel;
  // 미디어 업로드 정보
  const { backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentCTAUploaderModel;

  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);
  const [buttonList, setButtonList] = useState<FormContentCtaButtonModel[]>(buttons);
  const [buttonStyle, setButtonStyle] = useState<CTA_BUTTON_TYPE>(buttonType);
  const buttonMaxNum = useRef<number>(
    direction === LAYOUT_DIRECTION_TYPE.VERTICAL ? BUTTON_MAX_NUM.VERTICAL : BUTTON_MAX_NUM.HORIZONTAL,
  );
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

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
   * 버튼 삭제
   */
  const handleRemoveButton = useCallback(
    (index: number) => {
      const formKey = 'buttons';
      const buttonsValue = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      const newList = buttonsValue.filter((_, idx) => idx !== index);
      unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...formValue[FORM_KEY.CONTENTS],
        [formKey]: newList,
      });
      setButtonList(newList);
    },
    [formValue, id, getValues, setValue, unregister],
  );

  /**
   * 버튼 추가
   */
  const handleAddButton = useCallback(() => {
    const formKey = 'buttons';
    const buttons = getValues(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
    const newList = [...buttons, { ...getInitCTAButton() }];
    setValue(`${id}.${FORM_KEY.CONTENTS}.${formKey}`, newList);
    setButtonList(newList);
  }, [id, getValues, setValue]);

  const handleChangeDirection = useCallback(
    (e) => {
      const formKey = 'buttons';
      const num =
        e.target.value === LAYOUT_DIRECTION_TYPE.VERTICAL ? BUTTON_MAX_NUM.VERTICAL : BUTTON_MAX_NUM.HORIZONTAL;
      buttonMaxNum.current = num;

      const newList = buttonList.slice(0, num);
      unregister(`${id}.${FORM_KEY.CONTENTS}.${formKey}`);
      setValue(`${id}.${FORM_KEY.CONTENTS}.${formKey}`, newList);
      setButtonList(newList);
    },
    [buttonList, id, setValue, unregister],
  );

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
      direction,
      buttonTopSpacing,
      buttonType,
      textEffect,
      title,
      subTitle,
      description,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      isOverlay,
      align,
      buttons,
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
        title="CTA 컴포넌트"
        previewImage={['story/20220209/46109324-bf5d-4efe-b746-ddf869bedd3f.png']}
      />

      {/* 버튼 배치 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          버튼 배치
        </Typography>
        <List>
          {/* 버튼 배치 */}
          <ListItemWrapper listTitleName="버튼 배치 방향">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.direction`}
                  defaultValue={direction}
                  options={[
                    { label: '가로방향 (좌우)', value: LAYOUT_DIRECTION_TYPE.HORIZONTAL },
                    { label: '세로방향 (위아래)', value: LAYOUT_DIRECTION_TYPE.VERTICAL },
                  ]}
                  onChangeRadio={handleChangeDirection}
                />
              </Box>
              <Box sx={{ mt: 1, width: '100%' }}>
                <Typography color="secondary" variant="body2" sx={{ ml: 1, display: 'inline' }}>
                  *생성 가능한 버튼갯수: 가로방향: 최대 2개 / 세로방향: 최대 4개
                </Typography>
              </Box>
            </Box>
          </ListItemWrapper>
          {/* 버튼 간격 */}
          <ListItemWrapper listTitleName="버튼 최상단 간격">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.buttonTopSpacing`}
                  defaultValue={buttonTopSpacing}
                  options={[
                    { label: '기본', value: CTA_BUTTON_TOP_SPACING.NORMAL },
                    { label: '좁게', value: CTA_BUTTON_TOP_SPACING.SMALL },
                  ]}
                />
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 버튼 스타일 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          버튼 스타일
        </Typography>
        <List>
          {/* 버튼 스타일 */}
          <ListItemWrapper listTitleName="버튼 스타일">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.buttonType`}
                    defaultValue={buttonType}
                    options={[
                      {
                        label: (
                          <>
                            <ImageStyled className="square">
                              <span className="img-wrapper">
                                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                                  <img
                                    width="100%"
                                    src="https://cdn-image.prizm.co.kr/story/20220209/b82167a7-ea84-4907-8dcc-e9ece693a0cb.png"
                                    alt=""
                                  />
                                </Box>
                              </span>
                              <span className="txt-wrapper">중앙정렬</span>
                            </ImageStyled>
                          </>
                        ),
                        value: CTA_BUTTON_TYPE.FILL_CENTER,
                        labelPlacement: 'top',
                      },
                      {
                        label: (
                          <>
                            <ImageStyled className="square">
                              <span className="img-wrapper">
                                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                                  <img
                                    width="100%"
                                    src="https://cdn-image.prizm.co.kr/story/20220209/84261fbb-46b1-44af-bda3-bc4611b01f98.png"
                                    alt=""
                                  />
                                </Box>
                              </span>
                              <span className="txt-wrapper">좌측정렬</span>
                            </ImageStyled>
                          </>
                        ),
                        value: CTA_BUTTON_TYPE.FILL_LEFT,
                        labelPlacement: 'top',
                      },
                      {
                        label: (
                          <>
                            <ImageStyled className="square">
                              <span className="img-wrapper">
                                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                                  <img
                                    width="100%"
                                    src="https://cdn-image.prizm.co.kr/story/20220209/ee48206a-dc09-4f6e-8813-801388026cb8.png"
                                    alt=""
                                  />
                                </Box>
                              </span>
                              <span className="txt-wrapper">중앙정렬(라인)</span>
                            </ImageStyled>
                          </>
                        ),
                        value: CTA_BUTTON_TYPE.OUTLINE_CENTER,
                        labelPlacement: 'top',
                      },
                      {
                        label: (
                          <>
                            <ImageStyled className="square">
                              <span className="img-wrapper">
                                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                                  <img
                                    width="100%"
                                    src="https://cdn-image.prizm.co.kr/story/20220209/8b0a4f4c-c799-4834-9894-096882122943.png"
                                    alt=""
                                  />
                                </Box>
                              </span>
                              <span className="txt-wrapper">좌측정렬(라인)</span>
                            </ImageStyled>
                          </>
                        ),
                        value: CTA_BUTTON_TYPE.OUTLINE_LEFT,
                        labelPlacement: 'top',
                      },
                    ]}
                    onChangeRadio={(e) => setButtonStyle(e.target.value)}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 버튼 생성 편집 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Box>
          <Typography variant="h6" sx={{ display: 'inline' }}>
            버튼 생성 및 편집
          </Typography>
          <Typography color="secondary" variant="body2" sx={{ ml: 1, display: 'inline' }}>
            *생성 가능한 버튼갯수: 가로방향: 최대 2개 / 세로방향: 최대 4개
          </Typography>
        </Box>
        <List>
          {buttonList.map((button: FormContentCtaButtonModel, index) => (
            <React.Fragment key={index}>
              <CTAButton
                id={id}
                index={index}
                button={button}
                buttonStyle={buttonStyle}
                listLength={buttonList.length}
                onRemoveButton={handleRemoveButton}
              />
              <Divider sx={{ mt: 3, mb: 3 }} />
            </React.Fragment>
          ))}
          {buttonList.length < buttonMaxNum.current && (
            <div style={{ width: '100%' }}>
              <Button
                type="button"
                onClick={() => handleAddButton()}
                variant="contained"
                color="primary"
                sx={{ ml: 2, minWidth: 100 }}
              >
                + 버튼 추가
              </Button>
            </div>
          )}
        </List>
      </Paper>

      {/* 텍스트 등록  */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 - <span style={{ fontSize: '14px' }}>(작성이 필요한 항목만 선택 작성 가능)</span>
        </Typography>
        <List>
          {/* 배치 */}
          <ListItemWrapper listTitleName="텍스트 배치">
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
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
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
                      placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${CTA_TITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: CTA_TITLE_MAX_NUM },
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
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 서브 타이틀 */}
          <ListItemWrapper listTitleName="서브 타이틀 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.subTitle.text`,
                    defaultValue: subTitle?.text,
                    placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${CTA_SUBTITLE_MAX_NUM}자 이내)`,
                    inputProps: { max: CTA_SUBTITLE_MAX_NUM },
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
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 디스크립션 */}
          <ListItemWrapper listTitleName="디스크립션 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <TextController
                  textInputProps={{
                    name: `${id}.${FORM_KEY.CONTENTS}.description.text`,
                    defaultValue: description?.text,
                    placeholder: `디스크립션을 입력하세요 (띄워쓰기 포함 최대 ${CTA_DESC_MAX_NUM}자 이내)`,
                    inputProps: { max: CTA_DESC_MAX_NUM },
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
              </Grid>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드
        </Typography>
        <List>
          {/* 백그라운드 이미지 */}
          <ListItemWrapper listTitleName="백그라운드 설정">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <Grid container item>
                  <Box sx={{ width: '100%' }}>
                    <FormControlRadioGroup
                      row
                      name={`${id}.${FORM_KEY.CONTENTS}.backgroundType`}
                      defaultValue={bgType}
                      options={[
                        { label: '이미지 업로드', value: CONTENT_BACKGROUND_TYPE.MEDIA },
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
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Box>
                        <MediaFileUploader
                          fileInfos={backgroundMediaFileInfo.length ? [backgroundMediaFileInfo[0]] : []}
                          width={300}
                          height={400}
                          accept="image/*"
                          multiple={false}
                          maxFiles={backgroundMediaFileInfo.length ? undefined : 1}
                          emptyStatus={!backgroundMediaFileInfo.length}
                          emptyStatusText="IMAGE"
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
              {/* 백그라운드 딤드 */}
              <ListItemWrapper listTitleName="이미지 딤드 처리">
                <FormControlSwitch name={`${id}.${FORM_KEY.CONTENTS}.isOverlay`} defaultValue={isOverlay} />
              </ListItemWrapper>
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

const ImageStyled = styled.span`
  display: inline-block;
  width: 100px;
  text-align: center;
  & > .img-wrapper {
    display: block;
    width: 100%;
    height: 100px;
    border: 1px solid #eee;
    border-radius: 10px;
  }
  & > .txt-wrapper {
    display: block;
    width: 100%;
  }
`;
