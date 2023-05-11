import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';

interface Props {
  fileInfo?: UploadFileInfo;
}

export const DetailMediaMainViewInfo: React.FC<Props> = ({ fileInfo }) => {
  return (
    <>
      {fileInfo?.file && (
        <Box sx={{ width: '100%', height: '100%', border: 1, borderColor: 'divider', p: 1 }}>
          <Typography color="secondary" variant="subtitle2">
            업로드 파일정보
          </Typography>
          <Typography sx={{ ml: 1 }} variant="body2">
            파일 타입 : {fileInfo.file.type}
          </Typography>
          <Typography sx={{ ml: 1 }} variant="body2">
            용량 : {fileInfo.file.size} bytes
          </Typography>
        </Box>
      )}
    </>
  );
};
