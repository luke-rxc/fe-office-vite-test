import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { MainShortcutModel } from '../models';

interface Props {
  item: MainShortcutModel;
}

export const MediaViewer = ({ item }: Props) => {
  const { fullPath, fileTypeLabel, originalFileName } = item.media;

  return (
    <Box>
      {fullPath && <ImageStyled alt={originalFileName} src={`${fullPath}?im=Resize,width=192`} />}
      <Box>{fileTypeLabel}</Box>
    </Box>
  );
};

const ImageStyled = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
`;
