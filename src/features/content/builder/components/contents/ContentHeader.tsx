import { useEffect, useState } from 'react';
import type { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { List, Grid, Box, Paper, Typography, Divider, Button } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { ContentFormModel, ContentModel, FormContentHeaderModel, FormContentHeaderUploaderModel } from '../../models';
import { CONTENT_BACKGROUND_TYPE, FORM_KEY, VERTICAL_ALIGN_TYPE } from '../../constants';
import { useMediaService } from '../../services';
import { getInitFileInfo } from '../../utils';
import { FormControlRadioGroup } from '../form';
import { MediaFileUploader } from '../MediaFileUploader';
import { ControlColorPicker } from '../ControlColorPicker';
import { GuideText, ListItemWrapper } from '../Styled';
import { Popup } from '../Popup';
import { PreviewArcodian } from '../PreviewArcodian';

/**
 * 헤더 컴포넌트
 */
type ContentHeaderProps = {
  content: ContentModel;
};
export const ContentHeader: VFC<ContentHeaderProps> = ({ content }) => {
  const { id } = content;
  const { getValues, setValue } = useFormContext();
  const formValue: ContentFormModel = getValues(`${id}`);
  // 콘텐츠 정보
  const {
    verticalAlign,
    backgroundType,
    backgroundColor,
    backgroundMedia: backgroundMediaContents,
    logoImage: logoImageContents,
    mainImage: mainImageContents,
    footerImage: footerImageContents,
  } = formValue[FORM_KEY.CONTENTS] as FormContentHeaderModel;
  // 미디어 업로드 정보
  const { backgroundMedia, logoImage, mainImage, footerImage } = formValue[
    FORM_KEY.MEDIA_UPLOADER
  ] as FormContentHeaderUploaderModel;

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

  // logo Image form Value 처리
  const {
    fileInfo: logoImageFileInfo,
    handleChange: handleChangeLogoImage,
    handleRemove: handleRemoveLogoImage,
    fileErrors: logoImageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(logoImage),
    singleType: true,
    id,
    formKey: 'logoImage',
  });

  // main Image form Value 처리
  const {
    fileInfo: mainImageFileInfo,
    handleChange: handleChangeMainImage,
    handleRemove: handleRemoveMainImage,
    fileErrors: mainImageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(mainImage),
    singleType: true,
    id,
    formKey: 'mainImage',
  });
  // footer Image form Value 처리
  const {
    fileInfo: footerImageFileInfo,
    handleChange: handleChangeFooterImage,
    handleRemove: handleRemoveFooterImage,
    fileErrors: footerImageFileErrors,
  } = useMediaService({
    initFileInfo: getInitFileInfo(footerImage),
    singleType: true,
    id,
    formKey: 'footerImage',
  });

  /**
   * 초기 조건값으로 렌더가 되지 않은 폼데이터들은 formValue에서 키 값이 삭제되는 이슈.
   * 초기 렌더 시점에 formValue를 강제로 한번 업데이트 한다.
   */
  useEffect(() => {
    setValue(`${id}.${FORM_KEY.CONTENTS}`, {
      ...formValue[FORM_KEY.CONTENTS],
      verticalAlign,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContents,
      logoImage: logoImageContents,
      mainImage: mainImageContents,
      footerImage: footerImageContents,
    });
    setValue(`${id}.${FORM_KEY.MEDIA_UPLOADER}`, {
      ...formValue[FORM_KEY.MEDIA_UPLOADER],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PreviewArcodian
        title="헤더 컴포넌트"
        previewImage={['story/20220209/aadd161c-11c2-459d-b6a9-ac589095dbe8.png']}
      />
      {/* 백그라운드 설정 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          백그라운드 설정
        </Typography>
        <List>
          {/* 백그라운드 이미지 */}
          <ListItemWrapper listTitleName="백그라운드" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
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
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
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
                        title="이미지 업로드 가이드"
                        desc={['권장 이미지 사이즈: (세로형) 1080 x 1440 px', '이미지 파일 형식: jpg, png ']}
                      />
                    </Box>
                  </Box>
                )}
                {bgType === CONTENT_BACKGROUND_TYPE.COLOR && (
                  <ControlColorPicker
                    sx={{ display: 'inline' }}
                    name={`${id}.${FORM_KEY.CONTENTS}.backgroundColor`}
                    defaultValue={backgroundColor}
                    colorSize="medium"
                  />
                )}
              </Box>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* 백그라운드 로고 이미지 */}
          <ListItemWrapper listTitleName="백그라운드 로고 이미지" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box>
                  <MediaFileUploader
                    fileInfos={logoImageFileInfo.length ? [logoImageFileInfo[0]] : []}
                    width={300}
                    height={300}
                    accept="image/*"
                    multiple={false}
                    maxFiles={logoImageFileInfo.length ? undefined : 1}
                    emptyStatus={!logoImageFileInfo.length}
                    emptyStatusText="IMAGE"
                    fileError={logoImageFileErrors.length ? logoImageFileErrors[0] : null}
                    onChange={(files) => {
                      if (files.length > 0) {
                        handleChangeLogoImage(files);
                      }
                    }}
                    onRemove={(index) => {
                      handleRemoveLogoImage(index);
                    }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <GuideText
                    title="로고 이미지 업로드 가이드"
                    desc={['권장 이미지 사이즈: 1440 x 1440 px', '이미지 파일 형식: png']}
                  />
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 메인이미지 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          메인이미지 설정
        </Typography>
        <List>
          {/* 메인이미지 배치 */}
          <ListItemWrapper
            listTitleName={
              <>
                메인이미지 배치
                <Popup title="예시>">
                  <Grid container sx={{ width: 500 }} spacing={1}>
                    <Grid item xs={6}>
                      <p>중앙(세로) 정렬</p>
                      <img
                        width="100%"
                        src="https://cdn-image.prizm.co.kr/story/20220209/09437696-d53e-4b16-a892-a6ddfcbef22a.gif"
                        alt=""
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <p>하단(세로) 정렬</p>
                      <img
                        width="100%"
                        src="https://cdn-image.prizm.co.kr/story/20220209/1e7f13fd-db59-4971-ba6a-6611ff8b38d4.gif"
                        alt=""
                      />
                    </Grid>
                  </Grid>
                </Popup>
              </>
            }
          >
            <Box sx={{ width: '100%' }}>
              <Grid container item>
                <Box sx={{ width: '100%' }}>
                  <FormControlRadioGroup
                    row
                    name={`${id}.${FORM_KEY.CONTENTS}.verticalAlign`}
                    defaultValue={verticalAlign}
                    options={[
                      { label: '중앙(세로) 정렬', value: VERTICAL_ALIGN_TYPE.CENTER },
                      { label: '하단(세로) 정렬', value: VERTICAL_ALIGN_TYPE.BOTTOM },
                    ]}
                  />
                </Box>
              </Grid>
            </Box>
          </ListItemWrapper>
          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* 메인이미지 등록 */}
          <ListItemWrapper listTitleName="메인이미지 등록" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box>
                  <MediaFileUploader
                    fileInfos={mainImageFileInfo.length ? [mainImageFileInfo[0]] : []}
                    width={300}
                    height={400}
                    accept="image/*"
                    multiple={false}
                    maxFiles={mainImageFileInfo.length ? undefined : 1}
                    emptyStatus={!mainImageFileInfo.length}
                    emptyStatusText="IMAGE"
                    fileError={mainImageFileErrors.length ? mainImageFileErrors[0] : null}
                    onChange={(files) => {
                      if (files.length > 0) {
                        handleChangeMainImage(files);
                      }
                    }}
                    onRemove={(index) => {
                      handleRemoveMainImage(index);
                    }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <GuideText
                    title="이미지 업로드 가이드"
                    desc={[
                      '권장 이미지 사이즈',
                      '- (중앙 정렬) 1080 x 810 px',
                      '- (하단 정렬) 1080 x 1440 px',
                      '이미지 파일 형식: png',
                    ]}
                  />
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>

      {/* 하단 이미지 */}
      <Paper elevation={2} sx={{ p: 3, mt: 10 }}>
        <Typography color="textPrimary" variant="h6">
          하단 로고 설정
        </Typography>
        <List>
          {/* 하단 푸터 이미지 등록 */}
          <ListItemWrapper listTitleName="하단 로고 이미지 등록" isRequired>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box>
                  <MediaFileUploader
                    fileInfos={footerImageFileInfo.length ? [footerImageFileInfo[0]] : []}
                    width={300}
                    height={150}
                    accept="image/*"
                    multiple={false}
                    maxFiles={footerImageFileInfo.length ? undefined : 1}
                    emptyStatus={!footerImageFileInfo.length}
                    emptyStatusText="IMAGE"
                    fileError={footerImageFileErrors.length ? footerImageFileErrors[0] : null}
                    onChange={(files) => {
                      if (files.length > 0) {
                        handleChangeFooterImage(files);
                      }
                    }}
                    onRemove={(index) => {
                      handleRemoveFooterImage(index);
                    }}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <GuideText
                    title="이미지 업로드 가이드"
                    desc={['권장 이미지 사이즈: 1080 x 224 px', '이미지 파일 형식: png']}
                  />
                  <Typography color="secondary" variant="body2">
                    (*아래의 템플릿을 다운로드하여 제작후 업로드 필수)
                  </Typography>
                  <Button
                    type="button"
                    endIcon={<ArrowRightAltIcon />}
                    onClick={() => {
                      window.open('https://cdn-image.prizm.co.kr/story/guide/logo/Header_logo_area1.psd', '_blank');
                    }}
                    variant="outlined"
                    sx={{ minWidth: 150, mt: 2 }}
                  >
                    템플릿 다운로드
                  </Button>
                </Box>
              </Box>
            </Box>
          </ListItemWrapper>
        </List>
      </Paper>
    </>
  );
};
