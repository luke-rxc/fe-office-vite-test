import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { getShowtimeAnchorPointItem, modifyShowtimeAnchorPoint, registShowtimeAnchorPoint } from '../apis';
import {
  AnchorPointImageType,
  AnchorPointActionTypeCompleteMessage,
  AnchorPointActionTypeConfirmMessage,
  ModalType,
  showtimeAnchorPointItemsQueryKey,
  AnchorPointActionTypeLabel,
  AnchorPointActionType,
  AnchorPointActionTypeErrorMessage,
} from '../constants';
import { useShowtimeModal } from '../hooks';
import {
  toShowtimeAnchorPointFormField,
  toShowtimeAnchorPointItemModel,
  toShowtimeAnchorPointRegistRequestParamItem,
} from '../models';
import { ShowtimeAnchorPointFormField, ShowtimeAnchorPointRegistRequestParamItem } from '../types';

export const initAnchorPointFormValues: ShowtimeAnchorPointFormField = {
  anchorPointId: null,
  actionType: '',
  name: '',
  imageType: AnchorPointImageType.GOODS,
  goodsId: '',
  imageId: '',
  seekingPositionSeconds: [],
};

export const useShowtimeManageAnchorPointModalService = (showTimeId: number) => {
  const { showModal, handleOpenModal: onOpenModal, handleCloseModal: onCloseModal } = useShowtimeModal();
  // Modal type state
  const [modalType, setModalType] = useState<ModalType | undefined>(undefined);

  const [activeAnchorPoint, setActiveAnchorPoint] = useState<boolean | undefined>(undefined);

  // 이미지 연동 uploader
  const imageUploader = useFileUploader({
    domainType: UploadDomainType.GOODS,
    initFileInfos: [],
  });
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const queryClient = useQueryClient();

  const formMethod = useForm<ShowtimeAnchorPointFormField>({
    defaultValues: initAnchorPointFormValues,
  });

  // 쇼타임 앵커포인트 편성 item 등록
  const { mutateAsync: registAnchorPoint } = useMutation(
    (params: ShowtimeAnchorPointRegistRequestParamItem) => registShowtimeAnchorPoint(showTimeId, params),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${AnchorPointActionTypeErrorMessage[AnchorPointActionType.CREATE]}\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  // 쇼타임 앵커포인트 편성 item 수정
  const { mutateAsync: modifyAnchorPoint } = useMutation(
    (params: ShowtimeAnchorPointRegistRequestParamItem) => modifyShowtimeAnchorPoint(showTimeId, params),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${AnchorPointActionTypeErrorMessage[AnchorPointActionType.MODIFY]}\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  // 쇼타임 앵커포인트 item 조회
  const { mutateAsync: getAnchorPointItem } = useMutation((anchorPointId: number) =>
    getShowtimeAnchorPointItem(showTimeId, anchorPointId),
  );

  const {
    formState: { errors },
    register,
    unregister,
    reset,
    setValue,
    trigger,
    watch,
    handleSubmit,
  } = formMethod;
  const imageError = errors['imageId'];
  const selectedImageType = watch('imageType') as AnchorPointImageType;

  useEffect(() => {
    if (selectedImageType === AnchorPointImageType.UPLOAD) {
      register('imageId', { required: '이미지를 업로드해주세요.' });
    } else {
      unregister('imageId');
    }

    return () => {
      unregister('imageId');
    };
  }, [register, selectedImageType, unregister]);

  /**
   * 업로드 파일 추가
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    try {
      const uploadFiles = await imageUploader.handleUpload(fileInfos);
      imageUploader.handleUpdateFileInfo(uploadFiles, true);

      setValue('imageId', uploadFiles[0].id.toString());
    } catch (e) {
      toast.error('이미지 업로드에 문제가 발생하였습니다. 다시 확인해주세요.');
    }
  };

  /**
   * 업로드 파일 삭제
   */
  const handleRemoveUploadFile = (index: number) => {
    imageUploader.handleRemove(index);

    setValue('imageId', '');
    trigger('imageId');
  };

  /**
   * 등록 모달 open
   */
  const handleCreateOpenModal = () => {
    reset({
      ...initAnchorPointFormValues,
      actionType: AnchorPointActionType.CREATE,
    });
    setModalType(ModalType.CREATE);
    onOpenModal();
  };

  /**
   * 모달 close
   */
  const handleCloseModal = (event?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      return false;
    }

    setModalType(undefined);
    setActiveAnchorPoint(undefined);
    onCloseModal();
    reset();
    imageUploader.handleRemoveAll();
  };

  /**
   * 수정 모달 open
   */
  const handleModifyOpenModal = async (anchorPointId: number) => {
    try {
      const responseItem = await getAnchorPointItem(anchorPointId);
      const formItem = toShowtimeAnchorPointFormField(toShowtimeAnchorPointItemModel(responseItem));

      //image type이 업로드 일 경우만 imageUploader에 설정
      if (responseItem.imageType === AnchorPointImageType.UPLOAD) {
        imageUploader.handleUpdateFileInfo([responseItem.image], true);
      }

      setActiveAnchorPoint(responseItem.active);
      reset({ ...formItem, actionType: AnchorPointActionType.MODIFY, anchorPointId });
      setModalType(ModalType.MODIFY);
      onOpenModal();
    } catch (error) {
      dialogOpen({
        content: '문제가 발생하였습니다. 다시 시도해주세요',
        type: DialogType.ALERT,
      });
      handleCloseModal();
    }
  };

  /**
   * 앵커포인트 편성 등록 submit
   */
  const onSubmit = handleSubmit((values) => {
    const params = toShowtimeAnchorPointRegistRequestParamItem(values);
    const actionType = values.actionType as AnchorPointActionType;
    dialogOpen({
      title: AnchorPointActionTypeLabel[actionType],
      content: AnchorPointActionTypeConfirmMessage[actionType],
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        dialogOpen({
          content: '진행중입니다. 잠시만 기다려주세요.',
          type: DialogType.ALERT,
        });

        if (actionType === AnchorPointActionType.CREATE) {
          await registAnchorPoint(params);
        } else if (actionType === AnchorPointActionType.MODIFY) {
          await modifyAnchorPoint(params);
        }

        dialogOpen({
          title: '알림',
          content: AnchorPointActionTypeCompleteMessage[actionType],
          type: DialogType.ALERT,
        });

        queryClient.invalidateQueries([showtimeAnchorPointItemsQueryKey, showTimeId, activeAnchorPoint ?? false]);

        handleCloseModal();
      },
      onClose: dialogClose,
    });
  });

  return {
    showModal,
    modalType,
    formMethod,
    selectedImageType,
    uploadImage: {
      fileInfos: imageUploader.fileInfos,
      error: imageError,
      handleChangeUploadFile,
      handleRemoveUploadFile,
    },
    activeAnchorPoint,
    handleCreateOpenModal,
    handleModifyOpenModal,
    handleCloseModal,
    onSubmit,
  };
};
