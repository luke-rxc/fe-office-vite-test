import React from 'react';
import styled from '@emotion/styled';
import { Box, Paper, Divider, Typography, Button } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { SxProps } from '@material-ui/system';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import DeleteIcon from '@material-ui/icons/Delete';
import { UploadMedia } from '@components/uploader/UploadMedia';
import { UploadFileInfo } from '@models/UploadModel';
import { VideoPlayType, UploadFileType } from '@services/useFileUploader';
import { FormControlRadioGroup } from '@components/form';
import { MediaUploadVideoOptions, ImageListSortType, ImageListSortHandlerProps } from '../../constants';

interface Props {
  fileInfo: UploadFileInfo;
  index?: number;
  sx?: SxProps<Theme>;
  isDisableVideoRadioUi?: boolean;
  // 첫번째 Element 인지?
  isFirst: boolean;
  // 마지막 Element 인지?
  isLast: boolean;
  // 한개만 있는 FileInfo 인지?
  isSingle: boolean;

  onRemove: (index: number) => void;
  onSort: ImageListSortHandlerProps;
  onVideoTypeChange: (videoPlayType: VideoPlayType, idx: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1px 0',
  },
  wrapperMedia: {
    position: 'relative',
    width: '248px',
    height: '248px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    outline: 'none',
    border: '1px solid',
    borderRadius: '20px',
    borderColor: theme.palette.divider,
    overflow: 'hidden',
    '& img': {
      width: '100%',
      height: 'auto',
    },
    '& .ordering': {
      width: '40px',
      height: '40px',
      background: '#fff',
      border: '1px solid',
      borderRadius: '50%',
      borderColor: theme.palette.divider,
      position: 'absolute',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& .typo': {
        color: '#000',
        fontWeight: 'bold',
      },
    },
  },
  wrapperInfo: {
    width: 176,
    '& .type': {
      padding: '5px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    '& .video-type': {
      padding: '0 1px',
    },
  },
}));

export const DetailImageList: React.FC<Props> = ({
  fileInfo,
  index,
  sx,
  isDisableVideoRadioUi = false,
  isFirst,
  isLast,
  isSingle,
  onRemove,
  onSort,
  onVideoTypeChange,
}: Props) => {
  const classes = useStyles();
  const idx = index ?? 0;
  const { fileType, videoPlayType } = fileInfo;
  const isVideoType = fileType === UploadFileType.VIDEO;

  const handleVideoTypeChange = (_: React.ChangeEvent<HTMLInputElement>, value: VideoPlayType) => {
    onVideoTypeChange(value, idx);
  };

  const handleSortPrev = () => {
    onSort(idx, ImageListSortType.BACK);
  };

  const handleSortForward = () => {
    onSort(idx, ImageListSortType.FORWARD);
  };

  const handleSortTop = () => {
    onSort(idx, ImageListSortType.TOP);
  };

  const handleSortBottom = () => {
    onSort(idx, ImageListSortType.BOTTOM);
  };

  const handleRemove = () => {
    onRemove(idx);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapperMedia} sx={{ ...sx }}>
        <Box className="ordering">
          <Typography className="typo">{idx + 1}</Typography>
        </Box>
        <UploadMedia fileInfo={fileInfo} imageResizeWidth={512} />
      </Box>
      <Paper className={classes.wrapperInfo}>
        <Typography className="type">{isVideoType ? '비디오 타입' : '이미지 타입'}</Typography>
        <Divider />

        <Button
          startIcon={<VerticalAlignTop />}
          aria-label="top"
          onClick={handleSortTop}
          disabled={isSingle || isFirst}
        >
          순서 맨위로 이동
        </Button>

        <Button
          startIcon={<KeyboardArrowUp />}
          aria-label="back"
          onClick={handleSortPrev}
          disabled={isSingle || isFirst}
        >
          순서 위로 이동
        </Button>

        <Button
          startIcon={<KeyboardArrowDown />}
          aria-label="forward"
          onClick={handleSortForward}
          disabled={isSingle || isLast}
        >
          순서 아래로 이동
        </Button>

        <Button
          startIcon={<VerticalAlignBottom />}
          aria-label="bottom"
          onClick={handleSortBottom}
          disabled={isSingle || isLast}
        >
          순서 맨아래로 이동
        </Button>

        <Button startIcon={<DeleteIcon />} aria-label="delete" onClick={handleRemove}>
          삭제
        </Button>

        {isVideoType && !isDisableVideoRadioUi && (
          <Box className="video-type">
            <Divider />
            <FormControlRadioGroupStyled
              name={`mediaVideoType[${idx}]`}
              options={MediaUploadVideoOptions}
              row
              value={videoPlayType}
              onChange={handleVideoTypeChange}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const FormControlRadioGroupStyled = styled(FormControlRadioGroup)`
  margin: 5px;
  & > label span {
    font-size: 14px;
  }
`;
