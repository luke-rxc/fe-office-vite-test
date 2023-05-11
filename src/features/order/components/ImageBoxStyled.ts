import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

export const ImageBoxStyled = styled(Box)<{ path: string }>`
  width: 40px;
  height: 40px;
  margin: 10px;
  background-image: ${({ path }) => `url(${path})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border: 1px solid #0000001f;
  border-radius: 4px;
`;
