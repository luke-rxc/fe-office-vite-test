import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Paper, Typography, Box, Divider } from '@material-ui/core';
import { ContentFormModel, ContentModel, FormContentFooterModel, FormContentFooterUploaderModel } from '../../models';
import { CONTENT_BACKGROUND_TYPE, FORM_KEY } from '../../constants';
import { getInitFileInfo } from '../../utils';
import { useMediaService } from '../../services';
import { ControlColorPicker } from '../ControlColorPicker';
import { MediaFileUploader } from '../MediaFileUploader';
import { FormControlRadioGroup, FormControlSwitch } from '../form';
import { GuideText, ListItemWrapper } from '../Styled';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 푸터 컴포넌트
 */
type ContentFooterProps = {
  content: ContentModel;
};
export const ContentFooter: VFC<ContentFooterProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    color,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    isOverlay,
  } = formValue[FORM_KEY.CONTENTS] as FormContentFooterModel;
  // 미디어 업로드 정보
  const { backgroundMedia } = formValue[FORM_KEY.MEDIA_UPLOADER] as FormContentFooterUploaderModel;
  const [bgType, setBgType] = useState<CONTENT_BACKGROUND_TYPE>(backgroundType);

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
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      color,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      isOverlay,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="푸터 컴포넌트"
        previewImage={['story/20220209/065a9c9f-85b1-4be6-a854-58c28a9c0689.png']}
      />
      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드
        </Typography>
        <List>
          {/* 백그라운드 이미지 */}
          <ListItemWrapper listTitleName="백그라운드 설정" isRequired>
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
                            '권장 이미지 사이즈:(최소)1080 x 1080 ~ (최대)1080 x 1440 px',
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

      {/* 텍스트 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          텍스트
        </Typography>
        <List>
          {/* 텍스트 색상 */}
          <ListItemWrapper listTitleName="텍스트 색상">
            <Box sx={{ width: '100%' }}>
              <ControlColorPicker
                sx={{ display: 'inline' }}
                name={`${id}.${FORM_KEY.CONTENTS}.color`}
                defaultValue={color}
                colorSize="medium"
              />
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>
    </>
  );
};
