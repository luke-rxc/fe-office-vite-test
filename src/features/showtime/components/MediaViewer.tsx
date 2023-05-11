import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { UploadFileType } from '@services/useFileUploader';
import { memo } from 'react';

interface Props {
  fileName: string;
  fileType: UploadFileType;
  path: string;
}

interface VideoViewerProps {
  url: string;
}

export const MediaViewer = ({ fileName, fileType, path }: Props) => {
  if (!path) {
    return null;
  }

  if (fileType === UploadFileType.VIDEO) {
    return (
      <VideoStyled>
        <VideoViewer url={path} />
      </VideoStyled>
    );
  }

  return (
    <Box>
      <ImageStyled alt={fileName} src={`${path}?im=Resize,width=192`} />
    </Box>
  );
};

const ImageStyled = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
`;

const VideoStyled = styled(Box)`
  display: flex;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
`;

const VideoViewer = memo(({ url }: VideoViewerProps) => (
  <video
    style={{
      width: '4rem',
      height: '4rem',
      objectFit: 'cover',
      borderRadius: '10px',
    }}
    muted
    playsInline
    src={url}
  />
));
