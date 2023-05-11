import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getScheduleTableItem, putScheduleTableItem } from '../apis';
import {
  LandingType,
  ScheduleBannerType,
  scheduleTableItemQueryKey,
  ScheduleTableUploadType,
  SchedulingStatus,
} from '../constants';
import { useModal } from '../hooks';
import {
  ContentsImageModel,
  toScheduleModifyForm,
  toScheduleModifyParams,
  toScheduleTableDetailItemModel,
} from '../models';
import { ScheduleModifyForm, ScheduleModifyParams } from '../types';
import { ReturnTypeUseScheduleTableService } from './useScheduleTableService';

export type ReturnTypeUseScheduleModifyService = ReturnType<typeof useScheduleModifyService>;

const defaultFormValues: ScheduleModifyForm = {
  title: '',
  subtitle: '',
  bgColor: '',
  landingType: LandingType.MODAL,
  landingStoryId: '',
  benefits: '',
  bannerType: ScheduleBannerType.NONE,
  scheduling: SchedulingStatus.CLOSED,
  bgImageId: '',
  chromakeyImageId: '',
  bannerButtonText: '',
  bannerScheme: '',
  bannerImageId: '',
  bannerImage1Id: '',
  bannerImage2Id: '',
  bannerImage3Id: '',
};

interface Props {
  onReloadCurrentScheduleTable: ReturnTypeUseScheduleTableService['handleReloadCurrentScheduleTable'];
}

/**
 * 편성표 수정 service
 */
export const useScheduleModifyService = ({ onReloadCurrentScheduleTable: handleReloadCurrentScheduleTable }: Props) => {
  const [modifyId, setModifyId] = useState<number | null>();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<ScheduleModifyForm>({
    defaultValues: defaultFormValues,
  });
  const formRef = useRef<HTMLFormElement>();
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();

  const { handleSubmit, reset, setValue, trigger } = formMethod;

  // 백그라운드 이미지 uploader
  const bgImageUploader = useFileUploader({
    domainType: UploadDomainType.SCHEDULE,
    initFileInfos: [],
  });

  // 크로마키 이미지 uploader
  const chromakeyImageUploader = useFileUploader({
    domainType: UploadDomainType.SCHEDULE,
    initFileInfos: [],
  });

  // 배너 이미지 uploader
  const bannerImageUploader = useFileUploader({
    domainType: UploadDomainType.SCHEDULE,
    initFileInfos: [],
  });

  const { data: scheduleTableDetailItem, isLoading: isLoadingScheduleTableDetailItem } = useQuery(
    [scheduleTableItemQueryKey, modifyId],
    () => getScheduleTableItem(modifyId),
    {
      enabled: !!modifyId,
      select: toScheduleTableDetailItemModel,
    },
  );

  const { mutateAsync: modifyScheduleTableItem } = useMutation(
    (params: ScheduleModifyParams) => putScheduleTableItem(params),
    {
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          content: `편성표 수정중 문제가 발생하였습니다. ${error.data.message && `\r\n(${error.data.message})`}`,
        });
      },
    },
  );

  useEffect(() => {
    if (isLoadingScheduleTableDetailItem) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingScheduleTableDetailItem]);

  useEffect(() => {
    if (!scheduleTableDetailItem) {
      return;
    }

    if (scheduleTableDetailItem.bgImage) {
      const bgImage: UploadFileInfo = {
        ...scheduleTableDetailItem.bgImage,
        path: scheduleTableDetailItem.bgImage.path,
      };

      bgImageUploader.handleUpdateFileInfo([bgImage], true);
    }

    if (scheduleTableDetailItem.chromakeyImage) {
      const chromakeyImage: UploadFileInfo = {
        ...scheduleTableDetailItem.chromakeyImage,
        path: scheduleTableDetailItem.chromakeyImage.path,
      };

      chromakeyImageUploader.handleUpdateFileInfo([chromakeyImage], true);
    }

    if (scheduleTableDetailItem.bannerImage1) {
      const bannerImages: Array<UploadFileInfo> = [];

      for (let i = 0; i < 3; i++) {
        const bannerImage = scheduleTableDetailItem[`bannerImage${i + 1}`] as ContentsImageModel;
        if (bannerImage) {
          bannerImages.push({
            ...bannerImage,
            path: bannerImage.path,
          });
        }
      }

      bannerImageUploader.handleUpdateFileInfo(bannerImages, true);
    }

    reset(toScheduleModifyForm(scheduleTableDetailItem, defaultFormValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleTableDetailItem]);

  const handleModifySchedule = async (values: ScheduleModifyForm) => {
    const params = toScheduleModifyParams(modifyId, values);
    showLoading();
    try {
      await modifyScheduleTableItem(params);
      handleReloadCurrentScheduleTable();
    } finally {
      hideLoading();
    }

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: '편성표 수정이 완료되었습니다.',
      onClose: () => {
        handleClickCloseModifySchedule();
        dialog.close();
      },
    });
  };

  /**
   * 편성표 수정 submit
   */
  const handleSubmitModifySchedule = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `편성표를 수정 하시겠습니까?`,
      onConfirm: () => handleModifySchedule(values),
      confirmText: '수정',
    });
  });

  /**
   * 편성표 수정 modal open
   */
  const handleClickOpenModifySchedule = useCallback((id: number) => {
    return () => {
      setModifyId(id);
      handleOpenModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 편성표 수정 modal close
   */
  const handleClickCloseModifySchedule = () => {
    handleCloseModal();
    bgImageUploader.handleRemoveAll();
    chromakeyImageUploader.handleRemoveAll();
    bannerImageUploader.handleRemoveAll();
    setModifyId(null);
  };

  /**
   * 이미지 업로더 리턴
   */
  const getImageUploaderData = (type: ScheduleTableUploadType) => {
    switch (type) {
      case ScheduleTableUploadType.BG:
        return {
          uploader: bgImageUploader,
          isOverwrite: true,
        };
      case ScheduleTableUploadType.CHROMAKEY:
        return {
          uploader: chromakeyImageUploader,
          isOverwrite: true,
        };
      case ScheduleTableUploadType.BANNER:
        return {
          uploader: bannerImageUploader,
          isOverwrite: false,
        };
    }
  };

  /**
   * 업로드 파일 추가
   * @param {AuctionUploadType} type Upload type
   */
  const handleChangeUploadFile = (type: ScheduleTableUploadType) => {
    return async (fileInfos: Array<UploadFileInfo>) => {
      const { uploader: targetUploader, isOverwrite } = getImageUploaderData(type);

      try {
        const uploadFiles = await targetUploader.handleUpload(fileInfos);
        targetUploader.handleUpdateFileInfo(uploadFiles, isOverwrite);

        switch (type) {
          case ScheduleTableUploadType.BG:
            setValue('bgImageId', uploadFiles[0].id.toString());
            trigger('bgImageId');
            break;
          case ScheduleTableUploadType.CHROMAKEY:
            setValue('chromakeyImageId', uploadFiles[0].id.toString());
            trigger('chromakeyImageId');
            break;
          case ScheduleTableUploadType.BANNER:
            [...targetUploader.fileInfos, ...uploadFiles].forEach((uploadFile, index) => {
              setValue(`bannerImage${index + 1}Id` as keyof ScheduleModifyForm, uploadFile.id.toString());
            });
            setValue('bannerImageId', uploadFiles[0].id.toString());
            trigger('bannerImageId');
            break;
        }
      } catch (e) {
        toast.error('이미지 업로드에 문제가 발생하였습니다. 다시 확인해주세요.');
      }
    };
  };

  /**
   * 업로드 파일 삭제
   * @param {AuctionUploadType} type Upload type
   */
  const handleRemoveUploadFile = (type: ScheduleTableUploadType) => {
    return (index: number) => {
      const { uploader: targetUploader } = getImageUploaderData(type);
      const updateFileInfos = targetUploader.handleRemove(index);

      switch (type) {
        case ScheduleTableUploadType.BG:
          setValue('bgImageId', '');
          trigger('bgImageId');
          break;
        case ScheduleTableUploadType.CHROMAKEY:
          setValue('chromakeyImageId', '');
          trigger('chromakeyImageId');
          break;
        case ScheduleTableUploadType.BANNER:
          const updateIds =
            updateFileInfos.length > 0 ? updateFileInfos.map((item) => item.id.toString()) : ['', '', ''];

          if (updateIds.length < 3) {
            for (let i = 0; i < 3 - updateIds.length; i++) {
              updateIds.push('');
            }
          }

          updateIds.forEach((value, index) => {
            setValue(`bannerImage${index + 1}Id` as keyof ScheduleModifyForm, value);
          });

          setValue('bannerImageId', updateIds[0]);
          trigger('bannerImageId');
          break;
      }
    };
  };

  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return {
    formMethod,
    isOpenModal,
    modifyId,
    scheduleTableDetailItem,
    formRef,
    bgImage: {
      fileInfos: bgImageUploader.fileInfos,
      handleChangeUploadFile: handleChangeUploadFile(ScheduleTableUploadType.BG),
      handleRemoveUploadFile: handleRemoveUploadFile(ScheduleTableUploadType.BG),
    },
    chromakeyImage: {
      fileInfos: chromakeyImageUploader.fileInfos,
      handleChangeUploadFile: handleChangeUploadFile(ScheduleTableUploadType.CHROMAKEY),
      handleRemoveUploadFile: handleRemoveUploadFile(ScheduleTableUploadType.CHROMAKEY),
    },
    bannerImage: {
      fileInfos: bannerImageUploader.fileInfos,
      handleChangeUploadFile: handleChangeUploadFile(ScheduleTableUploadType.BANNER),
      handleRemoveUploadFile: handleRemoveUploadFile(ScheduleTableUploadType.BANNER),
    },
    actions: {
      handleClickOpenModifySchedule,
      handleClickCloseModifySchedule,
      handleSubmitModifySchedule,
      handleClickSubmit,
    },
  };
};
