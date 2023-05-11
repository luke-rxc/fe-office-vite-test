import { useEffect } from 'react';
import useLoading from '@hooks/useLoading';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType, UploadFileType, VideoPlayType } from '@services/useFileUploader';
import { ImageListSortHandlerProps, ImageListSortType, MediaMultiUploadType } from '../../constants';
import { usePageType } from '../../hooks';
import { uploadMediaValidation } from '../../utils';
import { useDetailMediaValidDialogService } from './useDetailMediaValidDialogService';

interface Props {
  initFileInfos?: UploadFileInfo[];
  baseVideoPlayType?: VideoPlayType;
}

const MediaValidationRules = {
  MAIN: {
    imageRules: [
      {
        width: 1440,
        height: 1440,
        max: {
          width: 1920,
          height: 1920,
        },
      },
    ],
    videoRules: [{ width: 1080, height: 1080 }],
  },
  DETAIL: {
    imageRules: [
      {
        width: 1440,
        height: null,
        max: {
          width: 1920,
          height: null,
        },
      },
    ],
    videoRules: [
      { width: 1080, height: 1080 },
      { width: 1080, height: 1920 },
      { width: 1920, height: 1080 },
    ],
  },
};

export const useDetailMediaMultiService = ({ initFileInfos, baseVideoPlayType = VideoPlayType.ONCE }: Props) => {
  const { isPartnerSite } = usePageType();
  // main Uploader
  const {
    fileInfos,
    handleSwap,
    handleMoveTop,
    handleMoveBottom,
    handleUpdateFileInfo,
    handleUpload,
    handleRemove,
    isLoadingUploadContent,
  } = useFileUploader({
    domainType: UploadDomainType.GOODS,
    initFileInfos: initFileInfos ?? [],
  });
  const { showLoading, hideLoading } = useLoading();

  const { errorMediaValidDialog } = useDetailMediaValidDialogService();

  /** 추가 미디어(이미지, 동영상) 업로드 */
  const handleChangeUpload = async (uploadFilesInfo: UploadFileInfo[], uploadType: MediaMultiUploadType) => {
    try {
      if (isPartnerSite) {
        const rules =
          uploadType === MediaMultiUploadType.MAIN ? MediaValidationRules.MAIN : MediaValidationRules.DETAIL;

        const validInfo = await uploadMediaValidation({
          files: uploadFilesInfo.map((fileInfo) => fileInfo.file),
          ...rules,
        });

        if (!validInfo.isValid) {
          errorMediaValidDialog(validInfo.errors);
          return;
        }
      }

      const uploadedFileInfo = await handleUpload(uploadFilesInfo);
      const transUploadedFileInfo = uploadedFileInfo.map((fileInfo) => {
        const isVideoType = fileInfo.fileType === UploadFileType.VIDEO;
        return {
          ...fileInfo,
          fileType: isVideoType ? UploadFileType.VIDEO : UploadFileType.IMAGE,
          videoPlayType: isVideoType ? baseVideoPlayType : null,
        };
      });
      handleUpdateFileInfo(transUploadedFileInfo);
    } catch (e) {}
  };

  /** 추가 이미지 Swap Order */
  const handleSwapImageList: ImageListSortHandlerProps = (index, sortType) => {
    const finalIndex = fileInfos.length - 1;
    if (sortType === ImageListSortType.FORWARD) {
      if (index === finalIndex) {
        return;
      }
      handleSwap(index, index + 1);
    }

    if (sortType === ImageListSortType.BACK) {
      // back
      if (index === 0) {
        return;
      }
      handleSwap(index, index - 1);
    }

    if (sortType === ImageListSortType.TOP) {
      if (index === 0) {
        return;
      }
      handleMoveTop(index);
    }

    if (sortType === ImageListSortType.BOTTOM) {
      if (index === finalIndex) {
        return;
      }
      handleMoveBottom(index);
    }
  };

  // Init Modify : file Info update
  useEffect(() => {
    if (!!initFileInfos.length) {
      handleUpdateFileInfo(initFileInfos, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFileInfos.length]);

  // loading
  useEffect(() => {
    isLoadingUploadContent ? showLoading() : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUploadContent]);

  return {
    fileInfos,
    handleChangeUpload,
    handleSwapImageList,
    handleUpdateFileInfo,
    handleRemove,
  };
};
