import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

export interface TableThumbnailProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
}

/**
 * 테이블의 이미지요소를 위한 컴포넌트
 */
export const TableThumbnail: React.FC<TableThumbnailProps> = ({
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  ...props
}) => (
  <ThumbnailBox
    width={width || 64}
    height={height || 64}
    maxWidth={maxWidth}
    maxHeight={maxHeight}
    minWidth={minWidth}
    minHeight={minHeight}
  >
    <img alt="" {...props} />
  </ThumbnailBox>
);

const ThumbnailBox = styled(Box)`
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.palette.divider};

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
