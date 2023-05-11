import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { Box, Button, Divider, FormHelperText, Grid, List, Paper, Typography } from '@material-ui/core';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import {
  ContentFormModel,
  ContentModel,
  FormContentLiveMultipleModel,
  FormContentLiveMultipleUploaderModel,
  LiveModel,
  ContentShowroomModel,
} from '../../models';
import { useContentContext } from '../../hooks';
import { FORM_KEY, CONTENT_BACKGROUND_TYPE } from '../../constants';
import { LiveListContainer } from '../../containers';
import { useMediaService } from '../../services';
import { getInitFileInfo } from '../../utils';
import { FormControlRadioGroup } from '../form';
import { ControlColorPicker } from '../ControlColorPicker';
import { LiveList } from '../LiveList';
import { MediaFileUploader } from '../MediaFileUploader';
import { PreviewArcodian } from '../PreviewArcodian';
import { GuideText, ListItemWrapper } from '../Styled';

/**
 * 라이브 멀티타입 컴포넌트
 */
type ContentLiveMultipleProps = HTMLAttributes<HTMLDivElement> & {
  content: ContentModel;
  showroom: ContentShowroomModel;
};
export const ContentLiveMultiple = forwardRef<HTMLDivElement, ContentLiveMultipleProps>(
  ({ className, content, showroom }, ref) => {
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
      useBackground,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
    } = formValue[FORM_KEY.CONTENTS] as FormContentLiveMultipleModel;
    // 미디어 업로드 정보
    const { backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentLiveMultipleUploaderModel;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isUseBackground, setIsUseBackground] = useState<boolean>(useBackground);
    const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);
    const [liveList, setLiveList] = useState<LiveModel[]>(liveDisplayList); // 라이브 리스트
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]); // 편성된 리스트 select 변경
    const [isLiveRegister, setIsLiveRegister] = useState<boolean>(false); // 편성등록 모달
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
        useBackground,
        backgroundType,
        backgroundColor,
        backgroundMedia: backgroundMediaContents,
      });
      setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
        ...formValue[FORM_KEY.MEDIA_UPLOADER],
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={ref} className={className}>
        <PreviewArcodian
          title="라이브 멀티 타입"
          previewImage={['story/20230220/a35e1cd4-7309-4077-81f7-be4adcfd4dde.png']}
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
        {/* 백그라운드 설정 */}
        <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
          <Typography color="textPrimary" variant="h6">
            백그라운드
          </Typography>
          <List>
            {/* 백그라운드 설정방식 */}
            {/* <ListItemWrapper listTitleName="백그라운드 설정">
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
            </ListItemWrapper> */}
            {isUseBackground && (
              <>
                <Divider sx={{ mt: 3, mb: 3 }} />
                {/* 백그라운드 미디어 */}
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
                              //  { label: '이미지 업로드', value: CONTENT_BACKGROUND_TYPE.MEDIA },
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
              </>
            )}
          </List>
        </Paper>

        {/* 편성등록 */}
        {isLiveRegister && (
          <LiveListContainer showroom={showroom} onConfirm={handleRegister} onCancel={() => setIsLiveRegister(false)} />
        )}
      </div>
    );
  },
);
