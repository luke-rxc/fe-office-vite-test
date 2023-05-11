import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import { find, findIndex, map, uniq } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  BannerMainLandingTypeOption,
  FormMainBannerLadingTypeOptions,
  MainBannerDetailFormDefaultValues,
} from '../constants';
import { toBannerLandingType, toPostBannerRequestModel } from '../models';
import { GetBannerLandingInfoQueryParams, MainBannerDetailFormFields } from '../types';

export const useBannerForm = () => {
  const [landingInfoQueryParams, setLandingInfoQueryParams] = useState<GetBannerLandingInfoQueryParams>(null);

  const dialog = useDialog();
  const formMethods = useForm<MainBannerDetailFormFields>({ defaultValues: MainBannerDetailFormDefaultValues });
  const fileUploader = useFileUploader({ domainType: UploadDomainType.HOME });
  const { showLoading, hideLoading } = useLoading();

  /**
   * 서브 타입을 가지고 있는 메인 랜딩 타입만 추출
   */
  const mainLandingTypesThatHasSubtype = useMemo(() => {
    const mainTypeIndexes = uniq(map(FormMainBannerLadingTypeOptions.sub, 'mainIndex'));
    const mainTypes = mainTypeIndexes.map((index) => FormMainBannerLadingTypeOptions.main[index]);

    return mainTypes;
  }, []);

  const refetchLandingInfo = useCallback(() => {
    setLandingInfoQueryParams({
      landingType: toBannerLandingType(formMethods.getValues('landingType')),
      referenceId: Number(formMethods.getValues('landingId')),
    });
  }, [formMethods]);

  const handleCancel = useCallback(
    (cond: boolean, onCancel?: () => void) => {
      if (cond) {
        dialog.open({
          content: '정말 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.',
          type: DialogType.CONFIRM,
          onConfirm: () => {
            dialog.close();
            onCancel?.();
          },
        });
      } else {
        onCancel?.();
      }
    },
    [dialog],
  );

  const handleInvalid = () => {
    dialog.open({
      content: '편성 정보를 생성할 수 없습니다.\r\n*필수 입력 항목을 모두 작성해 주세요.',
      type: DialogType.ALERT,
    });
  };

  const handleSubmit = (mutate, data) => {
    const params = toPostBannerRequestModel(data);
    mutate(params);
  };

  const hasSubLandingType = useCallback(
    (option: BannerMainLandingTypeOption) => {
      return find(mainLandingTypesThatHasSubtype, option);
    },
    [mainLandingTypesThatHasSubtype],
  );

  /**
   * 특정 메인 랜딩 타입에 존재하는 서브 랜딩 타입을 추출
   */
  const getSubLandingTypeOptions = useCallback(
    (option: BannerMainLandingTypeOption) => {
      if (!hasSubLandingType(option)) return [];

      const index = findIndex(FormMainBannerLadingTypeOptions.main, option);
      return FormMainBannerLadingTypeOptions.sub.filter((opt) => opt.mainIndex === index);
    },
    [hasSubLandingType],
  );

  const resetSubtype = useCallback(
    (value: string) => {
      const option = FormMainBannerLadingTypeOptions.main.find(({ label }) => label === value);
      if (!hasSubLandingType(option)) return;

      const [initialSubType] = getSubLandingTypeOptions(option);
      formMethods.setValue('landingType.sub', initialSubType);
    },
    [formMethods, hasSubLandingType, getSubLandingTypeOptions],
  );

  const updateMediaInfo = (updated: UploadFileInfo[]) => {
    fileUploader.handleUpdateFileInfo(updated, true);
  };

  const handleMediaChange = async (uploadFilesInfo: UploadFileInfo[]) => {
    showLoading('미디어 업로드 중입니다.');

    try {
      const uploaded = await fileUploader.handleUpload(uploadFilesInfo);
      updateMediaInfo(uploaded);

      const [newFile] = uploaded;
      formMethods.setValue('mediaId', newFile?.hls?.id ?? newFile.id, { shouldDirty: true });
      formMethods.trigger('mediaId');
    } catch (e) {
      toast.error('미디어 업로드에 실패했습니다.');
      console.error(e);
    } finally {
      hideLoading();
    }
  };

  const handleRemoveAll = () => {
    formMethods.setValue('mediaId', '');
    fileUploader.handleRemoveAll();
  };

  return {
    formMethods,
    refetchLandingInfo,
    landingInfoParams: {
      value: landingInfoQueryParams,
      setter: setLandingInfoQueryParams,
    },
    handleCancel,
    handleInvalid,
    handleSubmit,
    landingTypeTools: {
      hasSubLandingType,
      getSubLandingTypeOptions,
      resetSubtype,
    },
    fileInfos: {
      value: fileUploader.fileInfos,
      handleRemoveAll,
      updateMediaInfo,
      handleMediaChange,
    },
  };
};
