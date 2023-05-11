import { useState } from 'react';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import useLoading from '@hooks/useLoading';

/**
 * 섬네일 이미지 서비스
 */
export const useContentImageService = ({ formMethod, formKey }: { formMethod: any; formKey: string }) => {
  const { setValue, getValues } = formMethod;
  const { handleUpload } = useFileUploader({ domainType: UploadDomainType.STORY });
  const { showLoading, hideLoading } = useLoading();
  const [imageFileInfo, setImageFileInfo] = useState<UploadFileInfo[]>([]); // 섬네일 이미지

  /**
   * 이미지 추가
   */
  const handleChangeImage = (updateFileInfos: UploadFileInfo[]) => {
    setImageFileInfo(updateFileInfos);
  };

  /**
   * 이미지 삭제
   * @param index
   */
  const handleRemoveImage = (index) => {
    setImageFileInfo([...imageFileInfo.slice(0, index), ...imageFileInfo.slice(index + 1)]);
    setValue(formKey, null);
  };

  /**
   * 이미지 업로드
   */
  const handleImageUpload = async () => {
    let imageInfo = [];
    try {
      if (imageFileInfo) {
        showLoading();
        imageInfo = await handleUpload(imageFileInfo);
        setImageFileInfo([{ path: imageInfo[0].path, extension: imageInfo[0].extension }]);
        hideLoading();
      }
    } catch (e) {
      hideLoading();
    }

    const imageId = getValues(formKey);
    setValue(formKey, imageInfo.length > 0 ? imageInfo[0].id : imageId);
  };

  return {
    imageFileInfo,
    handleChangeImage,
    handleRemoveImage,
    handleImageUpload,
  };
};
