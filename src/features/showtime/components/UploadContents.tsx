import { FileUploader } from '@components/uploader/FileUploader';
import styled from '@emotion/styled';
import { Box, Button, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import { FieldError } from 'react-hook-form';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { VideoPlayType } from '@services/useFileUploader';

interface Props {
  accept?: string | Array<string>;
  contents: Array<UploadFileInfo>;
  error?: FieldError;
  multiple?: boolean;
  maxFiles?: number;
  onChangeUploadFile: (fileInfos: Array<UploadFileInfo>) => void;
  onRemoveUploadFile: (index: number) => void;
  onChangeVideoPlayType?: (id: number, value: VideoPlayType) => void;
}

/**
 * upload content component
 */
export const UploadContents = ({
  accept = 'image/*',
  contents,
  error,
  multiple = false,
  maxFiles,
  onChangeUploadFile,
  onRemoveUploadFile,
  onChangeVideoPlayType,
}: Props) => {
  const onClickDeleteContents = (index: number) => () => onRemoveUploadFile(index);

  return (
    <>
      <FileUploader
        accept={accept}
        width={90}
        height={37}
        fileInfos={contents}
        multiple={multiple}
        maxFiles={maxFiles}
        onChange={onChangeUploadFile}
        render={() => <Button variant="outlined">UPLOAD</Button>}
        sx={{
          p: 0,
          border: 'none',
          '&:hover': {},
        }}
      />
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {(contents ?? []).map((content, index) => (
          <UploadMediaWithAction
            key={content.id ?? `file-${index}`}
            width={multiple ? 160 : 140}
            height={multiple ? 160 : 140}
            fileInfo={content}
            onDelete={onClickDeleteContents(index)}
            onSelect={onChangeVideoPlayType}
            videoPlayType={content.videoPlayType}
            videoProps={{ autoPlay: true, loop: true }}
          />
        ))}
      </Box>
      {!!error && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
    </>
  );
};

const ErrorMessageStyled = styled(Typography)`
  margin: 10px 0 0;
  color: #f44336;
  font-size: 0.75rem;
`;
