import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';
import { Box, Divider, Typography } from '@material-ui/core';
import { UploadFileType } from '@services/useFileUploader';
import { GoodsContentType } from '../constants';
import { useGoodsContentService } from '../services/content';

interface Props {
  type: GoodsContentType;
  goodsId: string;
}

export const GoodsContentContainer: React.FC<Props> = ({ type, goodsId }) => {
  const { contentList, isLoading, isError } = useGoodsContentService({ type, goodsId });

  const title = type === GoodsContentType.MAIN ? '대표' : '상세';

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <ContentLayout title={title}>
        <p className="notify">오류입니다. 새로고침하여 다시 진행해 주세요</p>
      </ContentLayout>
    );
  }

  if (contentList && contentList.length === 0) {
    return (
      <ContentLayout title={title}>
        <p className="notify">리스트가 없습니다.</p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={title}>
      {contentList.map(({ path, fileType, width, height, extension, id }, index) => {
        return (
          <Box key={id} sx={{ my: 2 }}>
            <Typography variant="body2" color="primary" fontWeight="bold">{`${
              index + 1
            }) ${fileType}(${extension}) : ${width} x ${height}`}</Typography>
            {fileType === UploadFileType.IMAGE ? (
              <Image src={path} alt="upload_image" />
            ) : (
              <video muted playsInline src={path} controls />
            )}
            <Divider />
          </Box>
        );
      })}
    </ContentLayout>
  );
};

const ContentLayout = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <>
      <Helmet>
        <title>{`${title} 컨텐츠 보기`}</title>
      </Helmet>
      <WrapperStyled>{children}</WrapperStyled>
    </>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 300px;
  padding: 40px;

  & .notify {
    text-align: center;
  }
`;

const Image = styled.img`
  border: 1px solid #ccc;
`;
