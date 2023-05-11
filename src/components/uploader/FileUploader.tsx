import { useCallback, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import type { DropzoneOptions } from 'react-dropzone';
import toast from 'react-hot-toast';
import { SxProps } from '@material-ui/system';
import { Box } from '@material-ui/core';
import PlusIcon from '@assets/icons/Plus';
import { UploadFileInfo } from '@models/UploadModel';

export interface FileUploaderProps extends DropzoneOptions {
  width?: number;
  height?: number;
  sx?: SxProps;
  fileInfos: UploadFileInfo[];
  onValidationError?: (errors: ErrorProps) => void;
  onChange?: (fileInfos: UploadFileInfo[]) => void;
  render?: () => ReactNode;
}

interface ErrorMessageProps {
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  accept?: string | string[];
}

interface ErrorProps {
  error: string;
  files: File[];
}

const ErrorTypes = {
  MAXSIZE: 'file-too-large',
  MINSIZE: 'file-too-small',
  ACCEPT: 'file-invalid-type',
  MAXFILES: 'too-many-files',
} as const;

const getErrorMessage = (code: string, { maxSize, minSize, maxFiles, accept }: ErrorMessageProps) => {
  switch (code) {
    case ErrorTypes.MAXSIZE:
      return `첨부파일은 최대 ${maxSize}Byte 이하로 업로드 가능합니다.`;
    case ErrorTypes.MINSIZE:
      return `첨부파일은 최소 ${minSize}Byte 이상으로 업로드 가능합니다.`;
    case ErrorTypes.ACCEPT:
      return accept
        ? `첨부파일은 ${Array.isArray(accept) ? accept.join(', ') : accept} 타입만 가능합니다.`
        : '업로드 할 수 없는 타입입니다.';
    case ErrorTypes.MAXFILES:
      return `첨부파일은 최대 ${maxFiles}개까지 등록 가능합니다.`;
    default:
      return null;
  }
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  disabled,
  multiple,
  maxFiles,
  // 기본 값 = 10MB
  maxSize = 10485760,
  minSize,
  width,
  height,
  fileInfos,
  sx,
  onDrop: handleDrop,
  onDropRejected: handleOnDropRejected,
  onValidationError: handleValidationError,
  onChange: handleChange,
  render,
  ...other
}) => {
  const isSingle = !(multiple || (maxFiles && maxFiles > 1));
  const onDropRejected = useCallback(
    (fileRejections) => {
      const rejectItem = fileRejections[0];
      const errorFilename = rejectItem.file.path;
      const errorMsg = getErrorMessage(rejectItem.errors[0].code, {
        maxSize,
        minSize,
        maxFiles: isSingle ? 1 : maxFiles,
        accept,
      });

      if (handleValidationError) {
        handleValidationError({
          error: errorMsg,
          files: [rejectItem.file],
        });
      } else {
        toast.error(`${errorFilename} ${errorMsg}`);
      }
    },
    [maxSize, minSize, isSingle, maxFiles, accept, handleValidationError],
  );

  const onDrop = async (files: File[]) => {
    if (files.length + fileInfos.length > maxFiles) {
      const errorMsg = getErrorMessage(ErrorTypes.MAXFILES, { maxFiles });
      if (handleValidationError) {
        handleValidationError({
          error: errorMsg,
          files,
        });
      } else {
        toast.error(errorMsg);
      }
      return false;
    }

    const uploadFilesInfo = files.map((file) => ({ file }));
    handleChange && handleChange(uploadFilesInfo);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    minSize,
    maxSize,
    multiple: !isSingle,
    disabled,
    onDrop,
    onDropRejected,
  });

  return (
    <div {...other}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          width: width ? width : 120,
          height: height ? height : width ? width : 120,
          p: 1,
          ...(isDragActive && {
            backgroundColor: 'action.active',
            opacity: 0.5,
          }),
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
            opacity: 0.5,
          },
          ...sx,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {render ? (
          render()
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <PlusIcon />
          </Box>
        )}
      </Box>
    </div>
  );
};
