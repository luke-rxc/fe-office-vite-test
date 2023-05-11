import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { Box, Button, Divider, FormHelperText, Grid, List, Paper, Typography } from '@material-ui/core';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import {
  ContentFormModel,
  ContentModel,
  FormContentLiveModel,
  FormContentLiveUploaderModel,
  LiveModel,
  ContentShowroomModel,
} from '../../models';
import {
  BOOLEAN_VALUE_TYPE,
  FORM_KEY,
  LIVE_SUBTITLE_MAX_NUM,
  LIVE_TITLE_MAX_NUM,
  ALIGN_TYPE,
  LIVE_OVERLAY_TYPE_OPTIONS,
  LIVE_OVERLAY_TYPE,
  LIVE_TIME_COLOR_TYPE_OPTIONS,
} from '../../constants';
import { LiveListContainer } from '../../containers';
import { useContentContext } from '../../hooks';
import { useMediaService } from '../../services';
import { getInitFileInfo } from '../../utils';
import { FormControlRadioGroup } from '../form';
import { LiveList } from '../LiveList';
import { MediaFileUploader } from '../MediaFileUploader';
import { PreviewArcodian } from '../PreviewArcodian';
import { TextController } from '../TextController';
import { GuideText, ListItemWrapper } from '../Styled';

/**
 * 라이브 싱글타입 컴포넌트
 */
type ContentLiveProps = HTMLAttributes<HTMLDivElement> & {
  content: ContentModel;
  showroom: ContentShowroomModel;
};
export const ContentLive = forwardRef<HTMLDivElement, ContentLiveProps>(({ className, content, showroom }, ref) => {
  const { id, liveList: liveDisplayList = [] } = content;
  const { updateLiveContent } = useContentContext();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const {
    getValues,
    setValue,
    unregister,
    formState: { errors },
  } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);

  // 콘텐츠 정보
  const {
    align,
    backgroundMedia: backgroundMediaContents,
    textEffect,
    title,
    subTitle,
    backgroundType,
    backgroundColor,
    overlayColor,
    timeColor,
  } = formValue[FORM_KEY.CONTENTS] as FormContentLiveModel;
  // 미디어 업로드 정보
  const { backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentLiveUploaderModel;

  const [liveList, setLiveList] = useState<LiveModel[]>(liveDisplayList); // 라이브 리스트
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]); // 편성된 리스트 select 변경
  const [isLiveRegister, setIsLiveRegister] = useState<boolean>(false); // 편성등록 모달
  const [overlayValue, setOverlayValue] = useState(overlayColor);
  const [timeTextValue, setTimeTextValue] = useState(timeColor);
  const [errorMsg, setErrorMsg] = useState<string>(); // validation error
  const error = errors[id]?.liveList as FieldError;

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
   * 라이브 선택
   */
  const handleRowKeyChange = useCallback((keys) => {
    setSelectedRowKeys(keys);
  }, []);

  /**
   * 편성 삭제
   */
  const handleRemoveLive = useCallback(() => {
    if (!selectedRowKeys.length) {
      dialogOpen({
        title: `라이브 삭제`,
        content: '라이브 콘텐츠를 선택해 주세요.',
        type: DialogType.ALERT,
        onClose: () => {
          dialogClose();
        },
      });
      return;
    }
    setLiveList((prevList) => {
      return prevList.filter((live) => !selectedRowKeys.includes(live.id));
    });
  }, [dialogClose, dialogOpen, selectedRowKeys]);

  /**
   * 편성 등록
   */
  const handleRegister = useCallback((list: LiveModel[]) => {
    setLiveList(list);
    setIsLiveRegister(false);
    setErrorMsg('');
  }, []);

  useEffect(() => {
    if (liveList.length === 0 && error?.message) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg('');
    }
  }, [error, liveList.length]);

  /**
   * 라이브 정보 업데이트
   */
  useEffect(() => {
    const liveIdList = liveList.map((live) => live.id);
    // display 라이브 리스트 업데이트
    updateLiveContent(id, liveList);
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    setValue(`${id}.${FORM_KEY.LIVE_LIST}`, [...liveIdList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, liveList, unregister, updateLiveContent, getValues]);

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      align,
      backgroundMedia: backgroundMediaContents,
      textEffect,
      title,
      subTitle,
      backgroundType,
      backgroundColor,
      overlayColor,
      timeColor,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      <PreviewArcodian
        title="라이브 싱글 타입"
        previewImage={['story/20220209/c807a37e-1d97-44d9-81df-d50393932526.png']}
      />

      {/* 라이브 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          편성 라이브
        </Typography>

        <Box>
          <Grid container item sx={{ justifyContent: 'flex-end', mb: 2 }}>
            <Button
              type="button"
              onClick={handleRemoveLive}
              variant="contained"
              color="secondary"
              sx={{ minWidth: 100 }}
              disabled={liveList.length === 0}
            >
              삭제
            </Button>
            <Button
              type="button"
              onClick={() => setIsLiveRegister(true)}
              variant="contained"
              color="primary"
              sx={{ ml: 1, minWidth: 100 }}
            >
              + 편성추가
            </Button>
          </Grid>

          {liveList.length > 0 && (
            <LiveList
              items={liveList}
              rowKey="id"
              pagination={false}
              rowSelection={{
                selectedRowKeys,
                onChange: handleRowKeyChange,
              }}
            />
          )}
        </Box>

        {!!errorMsg === true && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              background: 'rgba(244,67,54,0.1)',
              borderRadius: '8px',
            }}
          >
            <FormHelperText error>{errorMsg}</FormHelperText>
          </Box>
        )}
      </Paper>
      {/* 백그라운드 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드
        </Typography>
        <List>
          {/* 백그라운드 이미지 등록 */}
          <ListItemWrapper listTitleName="백그라운드 이미지 등록" isRequired>
            <Box sx={{ width: '100%', mt: 2 }}>
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
                    title="이미지 업로드 가이드"
                    desc={[
                      '권장 이미지 사이즈:(최소)1080 x 1440 ~ (최대) 1080 x 1920 px',
                      '이미지 파일 형식: jpg, png',
                    ]}
                  />
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 백그라운드 딤드 */}
          <ListItemWrapper listTitleName="이미지 딤드 처리">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <FormControlRadioGroup
                  row
                  name={`${id}.${FORM_KEY.CONTENTS}.overlayColor`}
                  defaultValue={overlayColor}
                  options={LIVE_OVERLAY_TYPE_OPTIONS}
                  onChangeRadio={(e) => setOverlayValue(e.target.value)}
                />
              </Box>
              <Box sx={{ mt: 2, height: 400 }}>
                {overlayValue === LIVE_OVERLAY_TYPE.NONE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/c12bb428-927f-4819-9c9d-35528c153d68.png"
                    alt=""
                  />
                )}
                {overlayValue === LIVE_OVERLAY_TYPE.BLACK && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/5c62a28a-bc67-43ca-a425-2dda15320c0e.png"
                    alt=""
                  />
                )}
                {overlayValue === LIVE_OVERLAY_TYPE.WHITE && (
                  <img
                    width="300"
                    src="https://cdn-image.prizm.co.kr/story/20220209/9a69a044-eed5-460f-81ef-73be05382e0a.png"
                    alt=""
                  />
                )}
              </Box>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />
          {/* 시간정보 정보 텍스트 컬러 */}
          <ListItemWrapper listTitleName="시간정보 텍스트 컬러 설정">
            <Box sx={{ width: '100%' }}>
              <FormControlRadioGroup
                row
                name={`${id}.${FORM_KEY.CONTENTS}.timeColor`}
                defaultValue={timeTextValue}
                options={LIVE_TIME_COLOR_TYPE_OPTIONS}
                onChangeRadio={(e) => setTimeTextValue(e.target.value)}
              />
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
          {/* 가로 정렬 */}
          <ListItemWrapper listTitleName="가로 정렬">
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
      {/* 텍스트 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트 등록
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
          <ListItemWrapper listTitleName="타이틀 (필수)" isRequired>
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.title.text`,
                      defaultValue: title?.text,
                      placeholder: `타이틀을 입력하세요 (띄워쓰기 포함 최대 ${LIVE_TITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: LIVE_TITLE_MAX_NUM },
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
                <Box sx={{ width: '100%', mb: 1 }}>
                  <TextController
                    textInputProps={{
                      name: `${id}.${FORM_KEY.CONTENTS}.subTitle.text`,
                      defaultValue: subTitle?.text,
                      placeholder: `서브타이틀을 입력하세요 (띄워쓰기 포함 최대 ${LIVE_SUBTITLE_MAX_NUM}자 이내)`,
                      inputProps: { max: LIVE_SUBTITLE_MAX_NUM },
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
        </List>
      </Paper>

      {/* 편성등록 */}
      {isLiveRegister && (
        <LiveListContainer showroom={showroom} onConfirm={handleRegister} onCancel={() => setIsLiveRegister(false)} />
      )}
    </div>
  );
});
