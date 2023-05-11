import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { RaffleEventQueryKeys } from '../constants';
import { useLiveComboListQuery, useModal, useRaffleEventCreateMutation } from '../hooks';
import { toRaffleEventCreateParams } from '../models';
import { RaffleEventCreateFormField, RaffleEventCreateParams } from '../types';

export type ReturnTypeUseRaffleEventCreateService = ReturnType<typeof useRaffleEventCreateService>;

const defaultFormValues: RaffleEventCreateFormField = {
  eventName: '',
  liveItem: null,
};

/**
 * 래플 이벤트 생성 service
 */
export const useRaffleEventCreateService = () => {
  const formRef = useRef<HTMLFormElement>();
  const formMethod = useForm<RaffleEventCreateFormField>({
    defaultValues: defaultFormValues,
  });

  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const dialog = useDialog();

  const { reset, handleSubmit } = formMethod;

  const { data: liveComboList, isLoading: isLoadingLiveComboList } = useLiveComboListQuery();
  const { mutateAsync: createRaffleEvent } = useRaffleEventCreateMutation({
    onError: (error) => {
      dialog.open({
        content: `등록 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
  });

  useEffect(() => {
    if (isLoadingLiveComboList) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingLiveComboList]);

  /**
   * 래플 이벤트 등록 처리
   */
  const executeCreateRaffleEvent = async (params: RaffleEventCreateParams) => {
    await createRaffleEvent(params);
    queryClient.invalidateQueries(RaffleEventQueryKeys.lists());

    dialog.open({
      title: '알림',
      content: '등록이 완료되었습니다.',
      type: DialogType.ALERT,
      onClose: () => {
        reset(defaultFormValues);
        dialog.close();
        handleCloseModal();
      },
    });
  };

  /**
   * 래플 이벤트 등록 submit
   */
  const handleSubmitCreateRaffleEvent = handleSubmit((values) => {
    const params = toRaffleEventCreateParams(values);

    dialog.open({
      title: '확인',
      content: '등록하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: () => executeCreateRaffleEvent(params),
      onClose: dialog.close,
    });
  });

  /**
   * 래플 이벤트 등록 click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 래플 이벤트 등록 cancel click
   */
  const handleClickCancel = () => {
    // dialog.open({
    //   type: DialogType.CONFIRM,
    //   title: '확인',
    //   content: `신규 이벤트 생성을 취소 하시겠습니까?`,
    //   onConfirm: () => {
    //     reset(defaultFormValues);
    //     handleCloseModal();
    //     dialog.close();
    //   },
    //   confirmText: '닫기',
    // });
    reset(defaultFormValues);
    handleCloseModal();
    dialog.close();
  };

  return {
    formMethod,
    formRef,
    isOpenModal,
    liveComboList,
    handleOpenModal,
    handleSubmitCreateRaffleEvent,
    handleClickSubmit,
    handleClickCancel,
  };
};
