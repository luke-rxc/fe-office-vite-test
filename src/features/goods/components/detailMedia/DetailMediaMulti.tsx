import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { UploadFileInfo } from '@models/UploadModel';
import { FileUploader } from '@components/uploader/FileUploader';
import type { VideoPlayType } from '@services/useFileUploader';
import { DetailImageList } from './DetailImageList';
import { ImageListSortHandlerProps, MediaMultiUploadType } from '../../constants';

interface Props {
  fileInfos?: UploadFileInfo[];
  maxFiles: number;
  onChange: (uploadFilesInfo: UploadFileInfo[], uploadType: MediaMultiUploadType) => Promise<void>;
  onRemove: (index: number) => void;
  onSort: ImageListSortHandlerProps;
  onUpdate: (updateFiles: UploadFileInfo[], isOverwrite: boolean) => void;
  render?: React.ReactNode;
  errorMessage?: string;
  // 비디오 옵션 선택창 비활성화 유무(비활성화 한다면, 기본값으로 진행)
  isDisableVideoRadioUi?: boolean;
  // 업로드 타입
  uploadType: MediaMultiUploadType;
}

export const DetailMediaMulti: React.FC<Props> = ({
  uploadType,
  fileInfos,
  maxFiles,
  onChange,
  onRemove: handleRemove,
  onSort: handleSort,
  onUpdate: handleUpdate,
  render = null,
  errorMessage,
  isDisableVideoRadioUi = false,
}) => {
  const theme = useTheme();
  const { setValue } = useFormContext();
  const handleVideoTypeChange = (videoPlayType: VideoPlayType, idx: number) => {
    // value update
    setValue(`mediaVideoType[${idx}]`, videoPlayType);

    // file Info update
    const changeInfo = {
      ...fileInfos[idx],
      videoPlayType,
    };

    const updateFileInfos = [...fileInfos.slice(0, idx), changeInfo, ...fileInfos.slice(idx + 1)];
    handleUpdate(updateFileInfos, true);
  };

  const handleChange = (uploadFilesInfo: UploadFileInfo[]) => {
    onChange(uploadFilesInfo, uploadType);
  };

  return (
    <>
      {!!fileInfos.length && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {fileInfos.map((fileInfo, index) => (
            <DetailImageList
              key={`file${fileInfo.id}`}
              fileInfo={fileInfo}
              index={index}
              isDisableVideoRadioUi={isDisableVideoRadioUi}
              isFirst={index === 0}
              isLast={index === fileInfos.length - 1}
              isSingle={fileInfos.length === 1}
              onRemove={handleRemove}
              onSort={handleSort}
              onVideoTypeChange={handleVideoTypeChange}
            />
          ))}
        </Box>
      )}
      <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
        <FileUploader
          accept="image/jpg, image/jpeg, image/png, video/mp4"
          fileInfos={fileInfos}
          onChange={handleChange}
          maxFiles={maxFiles}
          width={100}
          height={50}
          sx={{ borderColor: errorMessage ? theme.palette.error.main : '' }}
        />
        {errorMessage && (
          <Typography display="block" variant="caption" color="error" sx={{ ml: 1 }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
      {render}
    </>
  );
};
