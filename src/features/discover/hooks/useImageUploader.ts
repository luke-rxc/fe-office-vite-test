import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import { UseFormReturn } from 'react-hook-form';
import { DiscoverBannerFormField } from '../types';

interface Props {
  formMethod: UseFormReturn<DiscoverBannerFormField>;
  formId: keyof DiscoverBannerFormField;
  formLabel: string;
}

export type ReturnTypeUseImageUploader = ReturnType<typeof useImageUploader>;

/**
 * 이미지 업로더 hook
 */
export const useImageUploader = ({ formMethod, formId, formLabel }: Props) => {
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();

  const {
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = formMethod;

  const uploaderError = errors[formId];

  const uploader = useFileUploader({
    domainType: UploadDomainType.DISCOVER,
    initFileInfos: [],
  });

  /**
   * 파일 업로드 change
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    try {
      showLoading();
      setError(formId, null);
      const uploadFiles = await uploader.handleUpload(fileInfos);
      uploader.handleUpdateFileInfo(uploadFiles, true);
      setValue(formId, uploadFiles[0].id.toString());
      trigger(formId);
    } catch (e) {
      dialog.open({
        content: `${formLabel} 업로드에 문제가 발생하였습니다. 다시 확인해주세요.`,
        type: DialogType.ALERT,
      });
    } finally {
      hideLoading();
    }
  };

  /**
   * 업로드 파일 제거
   */
  const handleRemoveUploadFile = (index: number) => {
    uploader.handleRemove(index);
    setValue(formId, '');
    trigger(formId);
  };

  /**
   * 업로드 파일 업데이트
   */
  const handleUpdateFileInfo = (image: UploadFileInfo) => {
    uploader.handleUpdateFileInfo([image], true);
  };

  return {
    contents: uploader.fileInfos,
    uploaderError,
    onChangeUploadFile: handleChangeUploadFile,
    onRemoveUploadFile: handleRemoveUploadFile,
    onUpdateFileInfo: handleUpdateFileInfo,
  };
};
