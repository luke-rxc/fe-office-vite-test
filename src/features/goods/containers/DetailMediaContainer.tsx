import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Grid, Typography } from '@material-ui/core';
import { ListTitle, ListTitleProps } from '@components/ListTitle';
import { FormControlTextField } from '@components/form';
import { DetailMediaMain, DetailMediaMulti } from '../components/detailMedia';
import { DetailToolTip } from '../components/detail';
import { useDetailMediaService, MediaServiceProps } from '../services/detailMedia';
import { AddImageUploadMax, MediaMultiUploadType } from '../constants';
import { StateModel } from '../models';
import { useLogger } from '../hooks';

interface MediaGridProps extends ListTitleProps {
  children?: React.ReactNode;
  divider?: boolean;
  toolTip?: string;
}

export const DetailMediaContainer: React.FC<MediaServiceProps> = ({
  initMainImage = null,
  initSubImages = [],
  initComponents = [],
}) => {
  const {
    // main Uploader
    mainFileInfos,
    validErrorMessage,
    handleChangeMainUpload,
    // sub Uploader
    subFileInfos,
    validSubMediaErrorMessage,
    handleChangeSubUpload,
    handleUpdateSubFileInfo,
    handleSwapSubImageList,
    handleSubRemove,
    // Component Uploader
    compFileInfos,
    handleChangeCompUpload,
    handleUpdateCompFileInfo,
    handleSwapCompImageList,
    handleCompRemove,
  } = useDetailMediaService({
    initMainImage,
    initSubImages,
    initComponents,
  });

  useLogger('DetailMediaContainer');

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader title="이미지 등록" />
          <Divider />
          <CardContent>
            {/* 이미지 등록 썸네일 이미지 */}
            <MediaGrid
              name="썸네일 이미지"
              isRequired
              width="auto"
              divider
              toolTip="상품 목록, 찜하기, 장바구니, 구매 목록에서 보여지는 이미지입니다."
            >
              <DetailMediaMain
                fileInfos={mainFileInfos}
                onChange={handleChangeMainUpload}
                errorMessage={validErrorMessage}
              />
            </MediaGrid>
            {/* // 이미지 등록 썸네일 이미지 */}

            {/* 이미지 추가 상품 대표 컨텐츠 */}
            <MediaGrid
              name={`상품 대표 컨텐츠 ${subFileInfos.length}/${AddImageUploadMax}`}
              isRequired
              width="auto"
              divider
              toolTip={`상품 상세 화면에서 롤링되는 컨텐츠입니다.\r\n*대표 컨텐츠는 옵션 상품이 포함되도록 컨텐츠를 구성해주세요.`}
            >
              <DetailMediaMulti
                uploadType={MediaMultiUploadType.MAIN}
                fileInfos={subFileInfos}
                maxFiles={AddImageUploadMax}
                onChange={handleChangeSubUpload}
                onRemove={handleSubRemove}
                onUpdate={handleUpdateSubFileInfo}
                onSort={handleSwapSubImageList}
                errorMessage={validSubMediaErrorMessage}
                render={
                  <>
                    <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption">
                      크기 : 이미지 (권장크기: 최소 1440px x 1440px, 최대 1920px x 1920px), 비디오 (권장크기: 1080 x
                      1080)
                    </Typography>
                    <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption" paragraph={true}>
                      파일 형식 : JPG, PNG, MP4
                    </Typography>
                  </>
                }
              />
            </MediaGrid>
            {/* // 이미지 추가 컨텐츠 */}

            {/* 상품 상세 컨텐츠 */}
            <MediaGrid
              name="상품 상세 컨텐츠"
              width="auto"
              divider
              toolTip="상품에 대한 상세한 설명을 컨텐츠로 등록해주세요."
            >
              <DetailMediaMulti
                uploadType={MediaMultiUploadType.DETAIL}
                fileInfos={compFileInfos}
                maxFiles={999}
                onChange={handleChangeCompUpload}
                onRemove={handleCompRemove}
                onUpdate={handleUpdateCompFileInfo}
                onSort={handleSwapCompImageList}
                isDisableVideoRadioUi
                render={
                  <>
                    <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption">
                      이미지 권장 크기 : 최소 가로 1440px, 최대 가로 1920px (세로길이무관)
                    </Typography>
                    <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption" display="block">
                      비디오 권장 크기 : 최소 (1:1) 1080 x 1080, 최대 (16:9) 1080 x 1920 or 1920 x 1080
                    </Typography>
                    <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption">
                      파일 형식 : JPG, PNG, MP4
                    </Typography>
                  </>
                }
              />
            </MediaGrid>
            {/* // 상품 상세 컨텐츠 (필수) */}

            {/* 상품 설명 */}
            <MediaGrid
              name="상품 설명(필수)"
              isRequired
              width="auto"
              toolTip={`상품에 대한 간략한 설명을 입력해주세요.\r\n*[상품 설명] > [배송 관련] > [유의사항] 순으로 작성해주세요.`}
            >
              <FormControlTextField<StateModel>
                fullWidth
                multiline
                placeholder="텍스트로 입력해주세요"
                name="description"
                rows={6}
                variant="outlined"
                triggerPressEnterSubmit
                sx={{ mt: 1 }}
              />
            </MediaGrid>
            {/* // 상품 설명 */}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

const MediaGrid: React.FC<MediaGridProps> = ({ children, name, isRequired, width, divider, toolTip }) => {
  return (
    <>
      <Grid container alignItems="center" sx={{ p: 2 }}>
        <Grid item md={2} xs={12} display="flex">
          <Box sx={{ width: 18, height: 18, flexShrink: 0 }}>{toolTip && <DetailToolTip message={toolTip} />}</Box>
          <ListTitle name={name} isRequired={isRequired} width={width} sx={{ ml: 1 }} />
        </Grid>
        <Grid item md={10} xs={12}>
          {children}
        </Grid>
      </Grid>
      {divider && <Divider sx={{ my: 2 }} />}
    </>
  );
};
