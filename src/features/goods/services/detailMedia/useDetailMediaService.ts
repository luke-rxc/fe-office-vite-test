import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadFileInfo } from '@models/UploadModel';
import { VideoPlayType } from '@services/useFileUploader';
import { toMediaFormData } from '../../models';
import { useDetailMediaMainService } from './useDetailMediaMainService';
import { useDetailMediaMultiService } from './useDetailMediaMultiService';

export interface MediaServiceProps {
  initMainImage?: UploadFileInfo;
  initSubImages?: UploadFileInfo[];
  initComponents?: UploadFileInfo[];
}

export const useDetailMediaService = ({ initMainImage, initSubImages, initComponents }: MediaServiceProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  /**
   * Main Uploader (섬네일 이미지)
   */
  const {
    fileInfos: mainFileInfos,
    handleChangeUpload: handleChangeMainUpload,
    validErrorMessage,
  } = useDetailMediaMainService({
    initFileInfos: initMainImage ? [initMainImage] : [],
  });

  /**
   * Sub Uploader (대표 컨텐츠)
   */
  const {
    fileInfos: subFileInfos,
    handleChangeUpload: handleChangeSubUpload,
    handleUpdateFileInfo: handleUpdateSubFileInfo,
    handleSwapImageList: handleSwapSubImageList,
    handleRemove: handleSubRemove,
  } = useDetailMediaMultiService({
    initFileInfos: initSubImages && !!initSubImages.length ? initSubImages : [],
  });

  /** validation Error */
  const validSubMediaErrorMessage =
    !subFileInfos.length && errors.subMediaFiles?.message ? errors.subMediaFiles?.message : null;

  /**
   * Component Uploader (컴포넌트)
   */
  const {
    fileInfos: compFileInfos,
    handleChangeUpload: handleChangeCompUpload,
    handleUpdateFileInfo: handleUpdateCompFileInfo,
    handleSwapImageList: handleSwapCompImageList,
    handleRemove: handleCompRemove,
  } = useDetailMediaMultiService({
    initFileInfos: initComponents && !!initComponents.length ? initComponents : [],
    baseVideoPlayType: VideoPlayType.DEFAULT,
  });

  useEffect(() => {
    const { info, ids } = subFileInfos.length ? toMediaFormData(subFileInfos) : { info: [], ids: [] };
    requestAnimationFrame(() => {
      setValue('imageFileIds', [...ids]);
      setValue('subMediaFiles', [...info]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFileInfos, setValue]);

  useEffect(() => {
    const { info } = compFileInfos.length ? toMediaFormData(compFileInfos) : { info: [] };
    requestAnimationFrame(() => {
      setValue('components', [...info]);
    });
  }, [compFileInfos, setValue]);

  return {
    // main Uploader
    mainFileInfos,
    validErrorMessage,
    handleChangeMainUpload,
    // sub Uploader
    subFileInfos,
    validSubMediaErrorMessage,
    handleChangeSubUpload,
    handleUpdateSubFileInfo,
    handleSwapSubImageList,
    handleSubRemove,
    // Component Uploader
    compFileInfos,
    handleChangeCompUpload,
    handleUpdateCompFileInfo,
    handleSwapCompImageList,
    handleCompRemove,
  };
};
