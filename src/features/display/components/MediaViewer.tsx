import { pathConfig } from '@config';
import { Box } from '@material-ui/core';
import { MainBannerThumbnailModel } from '../models';

interface Props extends MainBannerThumbnailModel {
  alt?: string;
}

export const MediaViewer = ({ path, label, alt }: Props) => {
  const { cdnUrl } = pathConfig;

  return (
    <Box
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        fontSize: '0.8rem',
        '& > img': {
          width: '4rem',
          height: '4rem',
          objectFit: 'cover',
        },
      }}
    >
      {!!path && <img alt={alt} src={`${cdnUrl}/${path}?im=Resize,width=192`} />}
      {label}
    </Box>
  );
};
