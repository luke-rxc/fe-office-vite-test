import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import useLoading from '@hooks/useLoading';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';

interface Props {
  initFileInfos?: UploadFileInfo[];
  fieldValueName: string;
}

export const useDetailUploadService = ({ initFileInfos, fieldValueName }: Props) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fileInfos, handleUpdateFileInfo, handleUpload, handleRemove, isLoadingUploadContent } = useFileUploader({
    domainType: UploadDomainType.GOODS,
    initFileInfos: initFileInfos ?? [],
  });
  const { showLoading, hideLoading } = useLoading();

  /** validation Error */
  const validErrorMessage =
    !fileInfos.length && errors[fieldValueName]?.message ? errors[fieldValueName]?.message : null;

  /** 추가 업로드 */
  const handleChangeUpload = async (uploadFilesInfo: UploadFileInfo[]) => {
    try {
      const uploadedFileInfo = await handleUpload(uploadFilesInfo);
      handleUpdateFileInfo(uploadedFileInfo);
    } catch (e) {}
  };

  // Init Modify : file Info update
  useEffect(() => {
    if (!!initFileInfos.length) {
      handleUpdateFileInfo(initFileInfos, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFileInfos.length]);

  // fileInfos
  useEffect(() => {
    if (fileInfos.length) {
      /** @issue 렌더링 이슈에 따른 value 미입력 이슈 해결 */
      window.requestAnimationFrame(() => {
        setValue(fieldValueName, [...fileInfos]);
      });
    } else {
      setValue(fieldValueName, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileInfos, setValue]);

  // loading
  useEffect(() => {
    isLoadingUploadContent ? showLoading() : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUploadContent]);

  return {
    fileInfos,
    validErrorMessage,
    handleChangeUpload,
    handleUpdateFileInfo,
    handleRemove,
  };
};
