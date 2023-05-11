import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

interface Props {
  fileName: string;
  path: string;
}

export const ImageViewer = ({ fileName, path }: Props) => {
  if (!path) {
    return null;
  }

  return (
    <Box>
      <ImageStyled alt={fileName} src={`${path}?im=Resize,width=192`} />
    </Box>
  );
};

const ImageStyled = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
`;
