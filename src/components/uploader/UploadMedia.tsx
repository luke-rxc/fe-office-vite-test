import { useState, useEffect, memo } from 'react';
import { Box } from '@material-ui/core';
import { pathConfig } from '@config';
import { imageToDataUrl, getIsVideoType, getIsImageType } from '@utils/files';
import { UploadFileInfo } from '@models/UploadModel';

export interface UploadMediaProps {
  fileInfo: UploadFileInfo;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  imageResizeWidth?: number;
}

interface ViewerProps {
  url: string;
  width?: number;
  height?: number;
}
interface VideoViewerProps extends ViewerProps {
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

const { cdnUrl } = pathConfig;
const getImageResizeSuffix = (isImageType: boolean, imageResizeWidth: number) => {
  if (isImageType && imageResizeWidth && imageResizeWidth > 0) {
    return `?im=Resize,width=${imageResizeWidth}`;
  }
  return '';
};
export const UploadMedia = ({ fileInfo, videoProps, imageResizeWidth }: UploadMediaProps) => {
  const { file, path, extension, width, height } = fileInfo;
  const isVideoType = path ? getIsVideoType(extension.toLowerCase()) : /^video/.test(file.type);
  const isImageType = path ? getIsImageType(extension.toLowerCase()) : /^image/.test(file.type);
  const isEtcType = !isVideoType && !isImageType;
  const [resourceUrl, setResourceUrl] = useState(
    path ? `${cdnUrl}/${path}${getImageResizeSuffix(isImageType, imageResizeWidth)}` : '',
  );

  useEffect(() => {
    async function loadToImgUrl() {
      const dataUrl = await imageToDataUrl(file);
      dataUrl !== resourceUrl && setResourceUrl(dataUrl);
    }

    function loadToVideoUrl() {
      const dataUrl = URL.createObjectURL(file);
      dataUrl !== resourceUrl && setResourceUrl(dataUrl);
    }

    if (path) {
      setResourceUrl(
        (prevResource) => `${cdnUrl}/${path}${getImageResizeSuffix(isImageType, imageResizeWidth)}` || prevResource,
      );
    } else {
      if (isImageType) {
        loadToImgUrl();
      } else if (isVideoType) {
        loadToVideoUrl();
      }
    }

    /**
     * @description
     *  video data 변환 (createObjectURL) 시, 새로운 data url 로 변환
     *  useEffect 의 dependencies 에 resourceUrl 을 넣으면 이 부분 때문에 무한 루프 발생
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, path, isVideoType, isImageType]);

  /** @todo width, height check, office 에서 꼭 필요한지? */
  return (
    <>
      {isVideoType && <VideoViewer url={resourceUrl} videoProps={videoProps} />}
      {isImageType && <ImageViewer url={resourceUrl} width={width} height={height} />}
      {isEtcType && (
        <Box sx={{ ml: 1, mr: 1, wordBreak: 'break-all' }}>
          {file?.name && (
            <p>
              <strong>FILE NAME: </strong>
              {file.name}
            </p>
          )}
          {path && (
            <p>
              <strong>FILE LINK: </strong>
              {cdnUrl}/{path}
            </p>
          )}
        </Box>
      )}
    </>
  );
};

const ImageViewer = memo(({ url, width, height }: ViewerProps) => (
  <img
    src={url}
    alt="upload_image"
    width={width || 'inherit'}
    height={height || 'inherit'}
    style={{ objectFit: 'contain' }}
  />
));

const VideoViewer = memo(({ url, videoProps }: VideoViewerProps) => (
  <video
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
    muted
    playsInline
    src={url}
    {...videoProps}
  />
));
