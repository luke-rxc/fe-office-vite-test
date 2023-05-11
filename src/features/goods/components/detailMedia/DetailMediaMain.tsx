import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import { FileUploader } from '@components/uploader/FileUploader';
import { DetailMediaMainView } from './DetailMediaMainView';
import { DetailMediaMainViewInfo } from './DetailMediaMainViewInfo';

interface Props {
  fileInfos?: UploadFileInfo[];
  errorMessage?: string;
  onChange: (uploadFilesInfo: UploadFileInfo[]) => Promise<void>;
}

export const DetailMediaMain: React.FC<Props> = ({ fileInfos, errorMessage, onChange: handleChange }) => {
  return (
    <Grid container alignItems="flex-end">
      <Grid item sx={{ mr: 2 }}>
        <DetailMediaMainView fileInfo={fileInfos?.[0]} isError={!!errorMessage} sx={{ width: 400, height: 400 }} />
        <Typography display="block" variant="caption" color="error" align="center">
          {errorMessage}
        </Typography>
      </Grid>
      <Grid item>
        <FileUploader
          accept="image/jpg, image/jpeg, image/png"
          fileInfos={fileInfos}
          onChange={handleChange}
          width={100}
          height={50}
          sx={{ mb: 2 }}
        />
        <Typography color="primary" variant="subtitle2">
          이미지 업로드
        </Typography>
        <Typography sx={{ ml: 1 }} variant="caption">
          크기 : 최소 512px x 512px, 최대 1024px x 1024px
        </Typography>
        <Typography sx={{ ml: 1 }} variant="caption" paragraph={true}>
          용량 : 10MB 이하, 파일 형식 JPG, PNG
        </Typography>
        <DetailMediaMainViewInfo fileInfo={fileInfos?.[0]} />
      </Grid>
    </Grid>
  );
};
