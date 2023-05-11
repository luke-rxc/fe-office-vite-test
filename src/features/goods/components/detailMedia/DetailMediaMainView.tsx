import { Box } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import type { SxProps } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import { UploadMedia, UploadMediaProps } from '@components/uploader/UploadMedia';
interface Props extends UploadMediaProps {
  isError: boolean;
  sx?: SxProps<Theme>;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '20px',
    outline: 'none',
    '& img': {
      width: '100%',
      height: 'auto',
    },
  },
}));

export const DetailMediaMainView = ({ fileInfo, videoProps, isError, sx }: Props) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.root}
      sx={{
        borderColor: isError ? 'error.main' : 'divider',
        ...sx,
      }}
    >
      {fileInfo && <UploadMedia fileInfo={fileInfo} videoProps={videoProps} imageResizeWidth={512} />}
    </Box>
  );
};
