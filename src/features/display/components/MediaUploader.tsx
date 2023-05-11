import { FileUploader, FileUploaderProps } from '@components/uploader/FileUploader';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import styled from '@emotion/styled';
import { Box, Grid, Typography } from '@material-ui/core';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { ControlledText, LabelWrapper } from '.';
import { UseMainBannerDetailService } from '../services';

interface Props extends Pick<UseMainBannerDetailService, 'fileInfos'> {
  showDeleteButton: boolean;
  label: string;
  accept?: FileUploaderProps['accept'];
  guideContent?: ReactNode;
  error?: FieldError;
}

export const MediaUploader = ({
  showDeleteButton,
  label,
  fileInfos,
  accept = 'image/*, video/*',
  guideContent,
  error,
}: Props) => {
  return (
    <LabelWrapper label={label} required height="8rem">
      <Grid container gap={2} alignItems="flex-end">
        {!fileInfos.value.length && (
          <FileUploader
            accept={accept}
            fileInfos={fileInfos.value}
            onChange={fileInfos.handleMediaChange}
            maxSize={2 ** 20 * 20} // 20MB
          />
        )}

        {fileInfos &&
          fileInfos.value.map((file, index) => (
            <Box key={index}>
              <UploadMediaWithAction
                fileInfo={file}
                onDelete={showDeleteButton ? fileInfos.handleRemoveAll : undefined}
              />
            </Box>
          ))}
        <Box m="5px 0 0 -10px">
          <ControlledText name="mediaId" rules={{ required: '미디어(동영상)을 선택하세요' }} sx={{ display: 'none' }} />
        </Box>

        {guideContent}
      </Grid>
      {!!error && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
    </LabelWrapper>
  );
};

const ErrorMessageStyled = styled(Typography)`
  margin: 10px 0 0;
  color: #f44336;
  font-size: 0.75rem;
`;
