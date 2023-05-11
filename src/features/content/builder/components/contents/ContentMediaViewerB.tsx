import { ReactNode, useCallback, useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Box, Paper, Typography, Divider } from '@material-ui/core';
import { FormControlDatePickerLocal } from '@components/form';
import {
  ContentFormModel,
  ContentModel,
  FormContentMediaViewerBModel,
  FormContentMediaViewerBUploaderModel,
  TitleListModel,
} from '../../models';
import { getInitFileInfo } from '../../utils';
import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  FORM_KEY,
  MEDIA_VIEWER_B_MAX_NUM,
  MEDIA_VIEWER_B_SUBTITLE_MAX_NUM,
  MEDIA_VIEWER_B_TITLE_MAX_NUM,
  MEDIA_VIEWER_B_DESC_MAX_NUM,
} from '../../constants';
import { useMediaService } from '../../services';
import { ControlMediaRatioRadio } from '../ControlMediaRatioRadio';
import { ControlColorPicker } from '../ControlColorPicker';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { TextController } from '../TextController';
import { GuideText, ListItemWrapper } from '../Styled';
import {
  MEDIA_VIEWER_B_MEDIA_SUBTITLE_MAX_NUM,
  MEDIA_VIEWER_B_MEDIA_TITLE_MAX_NUM,
} from '../../constants/contentMediaViewerB';
import { PreviewArcodian } from '../PreviewArcodian';
import { MediaFileUploader } from '../MediaFileUploader';

/**
 * 미디어 뷰어 B 컴포넌트 (컬렉션 타입)
 */
type ContentMediaViewerBProps = {
  content: ContentModel;
};
export const ContentMediaViewerB: VFC<ContentMediaViewerBProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue, unregister, trigger, watch } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);

  // 콘텐츠 정보
  const {
    align,
    textEffect,
    title,
    subTitle,
    description,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    isOverlay,
    mediaViewRatioType,
    isMediaRound,
    mainMedia: mainMediaContents,
    subMediaList: subMediaListContents,
    mainMediaTitle,
    subMediaTitleList: subMediaTitleListContents,
    useMediaText,
    mediaTextColor,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue[FORM_KEY.CONTENTS] as FormContentMediaViewerBModel;
  // 미디어 업로드 정보
  const { backgroundMedia, mainMedia, subMediaList } = formValue[
    FORM_KEY.MEDIA_UPLOADER
  ] as FormContentMediaViewerBUploaderModel;
  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);
  const [isUseMediaText, setIsUseMediaText] = useState<boolean>(useMediaText);
  const [isUseDisplayDateTime, setIsUseDisplayDateTime] = useState<boolean>(useDisplayDateTime);
  const SUB_MEDIA_MAX_NUM = MEDIA_VIEWER_B_MAX_NUM - 1;

  const getSubMediaTitleList = useCallback(
    (subMediaTitleList = []) => {
      return subMediaTitleList.map((textInfo, index) => {
        return (
          <>
            <Box sx={{ width: '100%', mb: 1 }}>
              <TextController
                textInputProps={{
                  name: `${id}.${FORM_KEY.CONTENTS}.subMediaTitleList.${index}.title`,
                  defaultValue: textInfo.title,
                  placeholder: '타이틀 입력(선택)',
                  inputProps: { max: MEDIA_VIEWER_B_MEDIA_TITLE_MAX_NUM },
                  disabled: !isUseMediaText,
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextController
                textInputProps={{
                  name: `${id}.${FORM_KEY.CONTENTS}.subMediaTitleList.${index}.subTitle`,
                  defaultValue: textInfo.subTitle,
                  placeholder: '서브타이틀 입력(선택)',
                  inputProps: { max: MEDIA_VIEWER_B_MEDIA_SUBTITLE_MAX_NUM },
                  disabled: !isUseMediaText,
                }}
              />
            </Box>
          </>
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUseMediaText],
  );

  const [subMediaTitleList, setSubMediaTitleList] = useState<ReactNode[]>(
    getSubMediaTitleList(subMediaTitleListContents),
  );

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

  const handleChangeSubMediaText = useCallback(
    (fileInfos) => {
      const subMediaTitleListFormValue = getValues(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);
      const targetTitleList: TitleListModel[] = Array.from({ length: fileInfos.length }, (_): TitleListModel => {
        return { title: '', subTitle: '' };
      });
      const newSubMediaText = [
        ...(subMediaTitleListFormValue ? subMediaTitleListFormValue : []),
        ...(targetTitleList ? targetTitleList : []),
      ];
      unregister(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...formValue[FORM_KEY.CONTENTS],
        subMediaTitleList: newSubMediaText,
      });

      setSubMediaTitleList(() => getSubMediaTitleList(newSubMediaText));
    },
    [getValues, id, unregister, setValue, formValue, getSubMediaTitleList],
  );

  const handleRemoveSubMediaText = useCallback(
    (index) => {
      const subMediaTitleListFormValue = getValues(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);
      const newSubMediaText = subMediaTitleListFormValue.filter((_, idx) => idx !== index);

      unregister(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...formValue[FORM_KEY.CONTENTS],
        subMediaTitleList: newSubMediaText,
      });
      setSubMediaTitleList(() => getSubMediaTitleList(newSubMediaText));
    },
    [formValue, getSubMediaTitleList, getValues, id, setValue, unregister],
  );

  const handleSortSubMediaText = useCallback(
    (sourceIndex, targetIndex) => {
      const subMediaTitleListFormValue = getValues(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);

      [subMediaTitleListFormValue[sourceIndex], subMediaTitleListFormValue[targetIndex]] = [
        subMediaTitleListFormValue[targetIndex],
        subMediaTitleListFormValue[sourceIndex],
      ];

      const newSubMediaText = [...subMediaTitleListFormValue];

      unregister(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`);
      setValue(`${id}.${FORM_KEY.CONTENTS}`, {
        ...formValue[FORM_KEY.CONTENTS],
        subMediaTitleList: newSubMediaText,
      });
      setSubMediaTitleList(() => getSubMediaTitleList(newSubMediaText));
    },
    [formValue, getSubMediaTitleList, getValues, id, setValue, unregister],
  );

  useEffect(() => {
    setSubMediaTitleList((prev) => getSubMediaTitleList(prev));
  }, [getSubMediaTitleList, isUseMediaText]);

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
      title,
      subTitle,
      description,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      isOverlay,
      mediaViewRatioType,
      isMediaRound,
      mainMedia: mainMediaContents,
      subMediaList: subMediaListContents,
      mainMediaTitle,
      subMediaTitleList: subMediaTitleListContents,
      useMediaText,
      mediaTextColor,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // subMediaList 키 값이 빈 배열인 경우, 키 삭제되는 이슈로 강제 키 업데이트
    setValue(`${id}.${FORM_KEY.CONTENTS}.subMediaList`, subMediaListContents ?? []);
    // subMediaTitleList 키 값이 빈 배열인 경우, 키 삭제되는 이슈로 강제 키 업데이트
    setValue(`${id}.${FORM_KEY.CONTENTS}.subMediaTitleList`, subMediaTitleListContents ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="미디어뷰어 컬렉션타입"
        previewImage={[
          'story/20220209/6ce4c82f-82b6-411c-b7e9-311cb458ec73.png',
          'story/20220209/b6d8bf69-6fad-46e7-b1e2-32c28e905984.gif',
        ]}
      />
      {/* 텍스트 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트
        </Typography>
        <List>
          {/* 텍스트 배치 */}
          <ListItemWrapper listTitleName="텍스트 배치" isRequired>
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
                <Box sx={{ width: '100%' }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.text`,
                      defaultValue: title?.text,
                      placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_VIEWER_B_TITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_VIEWER_B_TITLE_MAX_NUM },
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
          {/* 서브 타이틀(선택) */}
          <ListItemWrapper listTitleName="서브타이틀 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.subTitle.text`,
                      defaultValue: subTitle?.text,
                      placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_VIEWER_B_SUBTITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_VIEWER_B_SUBTITLE_MAX_NUM },
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
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 디스크립션(선택) */}
          <ListItemWrapper listTitleName="디스크립션 (선택)">
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.description.text`,
                      defaultValue: description?.text,
                      placeholder: `디스크립션을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_VIEWER_B_DESC_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_VIEWER_B_DESC_MAX_NUM },
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

      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드 설정
        </Typography>
        <List>
          {/* 백그라운드 이미지 */}
          <ListItemWrapper listTitleName="백그라운드">
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
                            '권장 이미지 사이즈:(최소)1080 x 1080 ~ (최대) 1080 x 1920px',
                            '이미지 파일 형식: jpg, png',
                          ]}
                        />
                      </Box>
                    </Box>
                  )}
                  {bgType === CONTENT_BACKGROUND_TYPE.COLOR && (
                    <Box sx={{ width: '100%' }}>
                      <ControlColorPicker
                        sx={{ display: 'inline' }}
                        name={`${id}.${FORM_KEY.CONTENTS}.backgroundColor`}
                        defaultValue={backgroundColor}
                        colorSize="medium"
                      />
                    </Box>
                  )}
                </Grid>
              </Box>
            </Box>
          </ListItemWrapper>
          {bgType === CONTENT_BACKGROUND_TYPE.MEDIA && (
            <>
              <Divider sx={{ mt: 3, mb: 3 }} />
              {/* 이미지 딤드 */}
              <ListItemWrapper listTitleName="이미지 딤드 처리">
                <FormControlSwitch name={`${id}.${FORM_KEY.CONTENTS}.isOverlay`} defaultValue={isOverlay} />
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>

      {/* 이미지 노출*/}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          이미지 노출
        </Typography>
        <List>
          <ListItemWrapper listTitleName="이미지 노출 타입" isRequired>
            <Box sx={{ width: '100%' }}>
              <ControlMediaRatioRadio
                row
                name={`${id}.${FORM_KEY.CONTENTS}.mediaViewRatioType`}
                defaultValue={mediaViewRatioType}
                videoType={false}
              />
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 라운드 설정 */}
          <ListItemWrapper listTitleName="이미지 모서리 라운드 설정">
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
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 대표 이미지 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          대표 이미지
        </Typography>
        <List>
          <ListItemWrapper listTitleName="대표 이미지 등록" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box>
                  <MediaFileUploader
                    fileInfos={mainMediaFileInfo.length ? [mainMediaFileInfo[0]] : []}
                    width={300}
                    height={400}
                    accept="image/*"
                    multiple={false}
                    maxFiles={mainMediaFileInfo.length ? undefined : 1}
                    emptyStatus={!mainMediaFileInfo.length}
                    emptyStatusText="IMAGE"
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
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 이미지 별 텍스트 등록 */}
          <ListItemWrapper listTitleName="이미지별 텍스트 등록">
            <FormControlSwitch
              name={`${id}.${FORM_KEY.CONTENTS}.useMediaText`}
              defaultValue={useMediaText}
              onChangeSwitch={(value) => {
                setIsUseMediaText(value);
              }}
            />
          </ListItemWrapper>

          {isUseMediaText && (
            <>
              {/* 대표 이미지 타이틀 */}
              <ListItemWrapper listTitleName="타이틀 (선택)">
                <Box sx={{ width: '100%' }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.mainMediaTitle.title`,
                      defaultValue: mainMediaTitle?.title,
                      placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_VIEWER_B_MEDIA_TITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_VIEWER_B_MEDIA_TITLE_MAX_NUM },
                    }}
                  />
                </Box>
              </ListItemWrapper>
              {/* 서브 타이틀(선택) */}
              <ListItemWrapper listTitleName="서브타이틀 (선택)">
                <Box sx={{ width: '100%' }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.mainMediaTitle.subTitle`,
                      defaultValue: mainMediaTitle?.subTitle,
                      placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${MEDIA_VIEWER_B_MEDIA_SUBTITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: MEDIA_VIEWER_B_MEDIA_SUBTITLE_MAX_NUM },
                    }}
                  />
                </Box>
              </ListItemWrapper>
              {/* 텍스트 컬러 */}
              <ListItemWrapper listTitleName="텍스트 컬러 (선택)">
                <Box sx={{ width: '100%' }}>
                  <Box>
                    <ControlColorPicker
                      sx={{ display: 'inline' }}
                      name={`${id}.${FORM_KEY.CONTENTS}.mediaTextColor`}
                      defaultValue={mediaTextColor}
                      colorSize="medium"
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography color="secondary" variant="body2">
                      * 지정한 텍스트 컬러는 등록된 모든 이미지 하단 텍스트 컬러에 일괄 적용 됩니다
                    </Typography>
                  </Box>
                </Box>
              </ListItemWrapper>
            </>
          )}
        </List>
      </Paper>

      {/* 추가 이미지 등록 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          추가 이미지
        </Typography>
        <List>
          <ListItemWrapper listTitleName="추가 이미지 등록">
            <Grid container>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography color="textPrimary" variant="subtitle1" sx={{ textAlign: 'right' }}>
                  총 {subMediaFileInfo.length} / {MEDIA_VIEWER_B_MAX_NUM - 1}
                </Typography>
              </Grid>
              <Grid container item xs={12} sx={{ flexDirection: 'row' }}>
                {subMediaFileInfo.length > 0 &&
                  subMediaFileInfo.map((file, idx) => {
                    return (
                      <MediaFileUploader
                        key={`imageviewer-${idx}`}
                        fileInfos={[file]}
                        width={250}
                        height={250}
                        accept="image/*"
                        multiple={false}
                        index={idx}
                        isFirst={idx === 0}
                        isLast={idx === subMediaFileInfo.length - 1}
                        noBadge={false}
                        fileError={subMediaFileErrors[idx]}
                        additionalInfo={subMediaTitleList}
                        onChange={(files) => {
                          if (files.length > 0) {
                            const newList = [...subMediaFileInfo];
                            newList[idx] = files[0];
                            handleChangeSubMedia(newList, true);
                          }
                        }}
                        onRemove={(index) => {
                          handleRemoveSubMedia(index);
                          handleRemoveSubMediaText(index);
                        }}
                        onSort={(sourceIndex, targetIndex) => {
                          handleSortSubMedia(sourceIndex, targetIndex);
                          handleSortSubMediaText(sourceIndex, targetIndex);
                        }}
                      />
                    );
                  })}
                {(!subMediaFileInfo.length || subMediaFileInfo.length < SUB_MEDIA_MAX_NUM) && (
                  <MediaFileUploader
                    fileInfos={[]}
                    width={250}
                    height={250}
                    accept="image/*"
                    multiple={true}
                    maxFiles={SUB_MEDIA_MAX_NUM - subMediaFileInfo.length}
                    emptyStatus={true}
                    emptyStatusText="IMAGE"
                    onChange={(files) => {
                      handleChangeSubMedia(files);
                      handleChangeSubMediaText(files);
                    }}
                  />
                )}
              </Grid>
            </Grid>
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
