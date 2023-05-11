import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

interface Props {
  path: string;
  size?: number;
}

export const ContentImage = ({ path, size }: Props) => {
  return <ImageBoxStyled path={path} size={size} />;
};

const ImageBoxStyled = styled(Box)<{ path: string; size?: number }>`
  width: ${({ size }) => (size ? `${size}px` : '80px')};
  height: ${({ size }) => (size ? `${size}px` : '80px')};
  margin: 10px 20px 10px;
  background-image: ${({ path }) => `url(${path})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border: 1px solid #0000001f;
  border-radius: 4px;
`;
