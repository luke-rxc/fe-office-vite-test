import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Box, Paper, Typography, Divider } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import {
  ContentFormModel,
  ContentModel,
  FormContentMediaViewerAModel,
  FormContentMediaViewerAUploaderModel,
} from '../../models';
import { getInitFileInfo } from '../../utils';
import {
  FORM_KEY,
  MEDIA_VIEWER_A_INDICATOR_TYPE,
  MEDIA_VIEWER_A_INDICATOR_TYPE_OPTIONS,
  MEDIA_VIEWER_A_MAX_NUM,
  MEDIA_VIEWER_A_OVERLAY_TYPE,
  MEDIA_VIEWER_A_OVERLAY_TYPE_OPTIONS,
} from '../../constants';
import { useMediaService } from '../../services';
import { MediaFileUploader } from '../MediaFileUploader';
import { ControlMediaRatioRadio } from '../ControlMediaRatioRadio';
import { ControlColorPicker } from '../ControlColorPicker';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { GuideText, ListItemWrapper } from '../Styled';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 미디어 뷰어 A 컴포넌트 (갤러리 타입)
 */
type ContentMediaViewerAProps = {
  content: ContentModel;
};
export const ContentMediaViewerA: VFC<ContentMediaViewerAProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    mediaViewRatioType,
    mainMedia: mainMediaContents,
    subMediaList: subMediaListContents,
    overlayType,
    bulletColor,
    indicatorType,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentMediaViewerAModel;
  // 미디어 업로드 정보
  const { mainMedia, subMediaList } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentMediaViewerAUploaderModel;

  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);

  const {
    fileInfo: mainMediaFileInfo,
    handleChange: handleChangeMainMedia,
    handleRemove: handleRemoveMainMedia,
    fileErrors: mainMediaFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(mainMedia),
    singleType: true,
    id,
    formKey: 'mainMedia',
  });

  // 서브이미지
  const {
    fileInfo: subMediaFileInfo,
    handleChange: handleChangeSubMedia,
    handleRemove: handleRemoveSubMedia,
    handleSort: handleSortSubMedia,
    fileErrors: subMediaFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(subMediaList),
    id,
    formKey: 'subMediaList',
  });

  const [overlayValue, setOverlayValue] = useState<MEDIA_VIEWER_A_OVERLAY_TYPE>(overlayType);
  const [indicatorValue, setIndicatorValue] = useState<MEDIA_VIEWER_A_INDICATOR_TYPE>(indicatorType);
  const SUB_MEDIA_MAX_NUM = MEDIA_VIEWER_A_MAX_NUM - 1;

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
      mediaViewRatioType,
      mainMedia: mainMediaContents,
      subMediaList: subMediaListContents,
      overlayType,
      bulletColor,
      indicatorType,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // subMediaList 키 값이 빈 배열인 경우, 키 삭제되는 이슈로 강제 키 업데이트
    setValue(`${id}.${FORM_KEY.CONTENTS}.subMediaList`, subMediaListContents ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="미디어뷰어 갤러리타입 (이미지 / 비디오)"
        previewImage={[
          'story/20220209/c62ded4f-6bdc-46fa-8f5c-816d12590e78.png',
          'story/20220209/2a455d8e-a398-4243-a463-8785f3e5894f.gif',
        ]}
      />

      {/* 이미지/비디오 노출*/}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          이미지/비디오 노출
        </Typography>
        <List>
          <ListItemWrapper listTitleName="이미지/비디오 노출 타입" isRequired>
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
        </List>
      </Paper>

      {/* 대표 이미지/비디오 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          대표 이미지/비디오
        </Typography>
        <List>
          <ListItemWrapper listTitleName="대표 이미지/비디오 등록" isRequired>
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
        </List>
      </Paper>

      {/* 추가 이미지/비디오 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          추가 이미지/비디오
        </Typography>
        <List>
          <ListItemWrapper listTitleName="추가 이미지/비디오 등록">
            <Grid container>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography color="textPrimary" variant="subtitle1" sx={{ textAlign: 'right' }}>
                  총 {subMediaFileInfo.length} / {MEDIA_VIEWER_A_MAX_NUM - 1}
                </Typography>
              </Grid>
              <Grid container item xs={12} sx={{ flexDirection: 'row' }}>
                {subMediaFileInfo.length > 0 &&
                  subMediaFileInfo.map((file, idx) => {
                    return (
                      <MediaFileUploader
                        key={`imageviewer-${idx}`}
                        fileInfos={[file]}
                        width={150}
                        height={150}
                        accept="image/*, video/mp4"
                        multiple={false}
                        index={idx}
                        isFirst={idx === 0}
                        isLast={idx === subMediaFileInfo.length - 1}
                        noBadge={false}
                        fileError={subMediaFileErrors[idx]}
                        onChange={(files) => {
                          if (files.length > 0) {
                            const newList = [...subMediaFileInfo];
                            newList[idx] = files[0];
                            handleChangeSubMedia(newList, true);
                          }
                        }}
                        onRemove={(index) => {
                          handleRemoveSubMedia(index);
                        }}
                        onSort={(sourceIndex, targetIndex) => {
                          handleSortSubMedia(sourceIndex, targetIndex);
                        }}
                      />
                    );
                  })}
                {(!subMediaFileInfo.length || subMediaFileInfo.length < SUB_MEDIA_MAX_NUM) && (
                  <MediaFileUploader
                    fileInfos={[]}
                    width={150}
                    height={150}
                    accept="image/*, video/mp4"
                    multiple={true}
                    maxFiles={SUB_MEDIA_MAX_NUM - subMediaFileInfo.length}
                    emptyStatus={true}
                    emptyStatusText="IMAGE/VIDEO"
                    onChange={(files) => {
                      handleChangeSubMedia(files);
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 상단 인디케이터 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          상단 인디케이터 설정
        </Typography>
        <List>
          <ListItemWrapper listTitleName="상단 인디케이터 설정" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.indicatorType`}
                  defaultValue={indicatorType}
                  options={MEDIA_VIEWER_A_INDICATOR_TYPE_OPTIONS}
                  onChangeRadio={(e) => setIndicatorValue(e.target.value)}
                />
              </Box>
              <Box sx={{ mt: 2, height: 300 }}>
                {indicatorValue === MEDIA_VIEWER_A_INDICATOR_TYPE.NONE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20221125/6fb5124e-d95a-4a57-954c-59efbe56a190.png"
                    alt=""
                  />
                )}
                {indicatorValue === MEDIA_VIEWER_A_INDICATOR_TYPE.GREY && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20221125/7bb85e8f-cc86-48f2-96ef-eecbdb6a5b78.png"
                    alt=""
                  />
                )}
                {indicatorValue === MEDIA_VIEWER_A_INDICATOR_TYPE.WHITE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20221125/afdb2306-040f-4ab2-a130-d2c926c1138b.png"
                    alt=""
                  />
                )}
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 하단 오버레이 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          하단 오버레이 설정
        </Typography>
        <List>
          <ListItemWrapper listTitleName="이미지 하단 오버레이" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.overlayType`}
                  defaultValue={overlayType}
                  options={MEDIA_VIEWER_A_OVERLAY_TYPE_OPTIONS}
                  onChangeRadio={(e) => setOverlayValue(e.target.value)}
                />
              </Box>
              <Box sx={{ mt: 2, height: 300 }}>
                {overlayValue === MEDIA_VIEWER_A_OVERLAY_TYPE.NONE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/60d71ae7-a337-4b04-af74-8ccdfb80f133.png"
                    alt=""
                  />
                )}
                {overlayValue === MEDIA_VIEWER_A_OVERLAY_TYPE.BLACK && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/383a4a50-c40c-4b8e-9ab7-f15e978d7148.png"
                    alt=""
                  />
                )}
                {overlayValue === MEDIA_VIEWER_A_OVERLAY_TYPE.WHITE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/3afe61c3-3f89-49fa-9e61-926487358599.png"
                    alt=""
                  />
                )}
              </Box>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          <ListItemWrapper listTitleName="인디케이터 컬러">
            <Box sx={{ width: '100%' }}>
              <ControlColorPicker
                sx={{ display: 'inline' }}
                name={`${id}.${FORM_KEY.CONTENTS}.bulletColor`}
                defaultValue={bulletColor}
                colorSize="medium"
              />
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
