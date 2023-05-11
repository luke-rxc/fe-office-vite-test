import React from 'react';
import { Box, Typography, List, Button } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { UploadFileInfo } from '@models/UploadModel';
import { FileUploader } from '@components/uploader/FileUploader';
import UploadIcon from '@assets/icons/Upload';
import { DetailUploadList } from './DetailUploadList';

interface Props {
  fileInfos?: UploadFileInfo[];
  maxFiles: number;
  onChange: (uploadFilesInfo: UploadFileInfo[]) => Promise<void>;
  onRemove: (index: number) => void;
  errorMessage?: string;
}

export const DetailUpload: React.FC<Props> = ({
  fileInfos,
  maxFiles,
  onChange: handleChange,
  onRemove: handleRemove,
  errorMessage,
}) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <FileUploader
          accept=".pdf, image/*"
          fileInfos={fileInfos}
          onChange={handleChange}
          maxFiles={maxFiles}
          height={50}
          sx={{ borderColor: errorMessage ? theme.palette.error.main : theme.palette.primary.main }}
          render={() => (
            <Button color="primary" variant="text" component="span" startIcon={<UploadIcon fontSize="small" />}>
              파일첨부
            </Button>
          )}
        />
        {errorMessage && (
          <Typography display="block" variant="caption" color="error" sx={{ ml: 1 }}>
            {errorMessage}
          </Typography>
        )}
        {!!fileInfos.length && (
          <List sx={{ display: 'inline-block' }}>
            {fileInfos.map((fileInfo, index) => (
              <DetailUploadList key={`file${index}`} fileInfo={fileInfo} index={index} onRemove={handleRemove} />
            ))}
          </List>
        )}
      </Box>
    </>
  );
};
