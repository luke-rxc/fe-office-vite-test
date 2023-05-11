import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import useLoading from '@hooks/useLoading';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType } from '@services/useFileUploader';
import { usePageType } from '../../hooks';
import { uploadMediaValidation } from '../../utils';
import { useDetailMediaValidDialogService } from './useDetailMediaValidDialogService';

interface Props {
  initFileInfos?: UploadFileInfo[];
}

export const useDetailMediaMainService = ({ initFileInfos }: Props) => {
  const { isPartnerSite } = usePageType();
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const { showLoading, hideLoading } = useLoading();

  const { errorMediaValidDialog } = useDetailMediaValidDialogService();

  // main Uploader
  const { fileInfos, handleUpdateFileInfo, handleUpload, isLoadingUploadContent } = useFileUploader({
    domainType: UploadDomainType.GOODS,
    initFileInfos: initFileInfos ?? [],
  });

  /** 메인 이미지 업로드 */
  const handleChangeUpload = async (uploadFilesInfo: UploadFileInfo[]) => {
    try {
      if (isPartnerSite) {
        const validInfo = await uploadMediaValidation({
          files: [uploadFilesInfo[0].file],
          imageRules: [
            {
              width: 512,
              height: 512,
              max: {
                width: 1024,
                height: 1024,
              },
            },
          ],
        });

        if (!validInfo.isValid) {
          errorMediaValidDialog(validInfo.errors);
          return;
        }
      }

      const uploadedFileInfo = await handleUpload(uploadFilesInfo);
      // single mode
      handleUpdateFileInfo(uploadedFileInfo, true);
    } catch (e) {}
  };

  /** validation Error */
  const validErrorMessage =
    !fileInfos.length && errors.primaryImageFileId?.message ? errors.primaryImageFileId?.message : null;

  useEffect(() => {
    const fileId = fileInfos.length > 0 && fileInfos[0].id ? fileInfos[0].id : null;
    if (fileId) {
      setValue('primaryImageFileId', fileId);
    }
  }, [fileInfos, setValue]);

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
    validErrorMessage,
    handleChangeUpload,
  };
};
