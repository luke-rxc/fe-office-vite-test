import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { DiscoverBannerModel } from '../models';

interface Props {
  item: DiscoverBannerModel;
}

export const MediaViewer = ({ item }: Props) => {
  if (!item.primaryImageFile.path) {
    return null;
  }

  return (
    <Box>
      <ImageStyled
        alt={item.primaryImageFile.originalFileName}
        src={`${item.primaryImageFile.fullPath}?im=Resize,width=192`}
      />
    </Box>
  );
};

const ImageStyled = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
`;
