import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { DiscoverKeywordQueryKeys } from '../constants';
import { useDiscoverKeywordCreateMutation, useModal } from '../hooks';
import { DiscoverKeywordCreateFormField } from '../types';

const discoverKeywordDefaultFormField: DiscoverKeywordCreateFormField = {
  keyword: '',
};

export type ReturnTypeUseDiscoverKeywordCreateService = ReturnType<typeof useDiscoverKeywordCreateService>;

export const useDiscoverKeywordCreateService = () => {
  const formRef = useRef<HTMLFormElement>();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<DiscoverKeywordCreateFormField>({
    defaultValues: discoverKeywordDefaultFormField,
  });
  const { handleSubmit, reset } = formMethod;

  const { mutateAsync: registDiscoverKeyword } = useDiscoverKeywordCreateMutation();

  const handleCreateKeyword = ({ keyword }: DiscoverKeywordCreateFormField) => {
    registDiscoverKeyword(keyword, {
      onSuccess: () => {
        queryClient.refetchQueries(DiscoverKeywordQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '등록완료',
          content: `키워드가 등록되었습니다.`,
          onClose: () => {
            handleCloseModal();
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `키워드 등록 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 디스커버 등록 submit
   */
  const handleSubmitCreateKeyword = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `키워드를 등록 하시겠습니까?`,
      onConfirm: () => handleCreateKeyword(values),
      confirmText: '등록',
    });
  });

  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleClickCancel = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `키워드 등록을 취소 하시겠습니까?`,
      onConfirm: () => {
        reset(discoverKeywordDefaultFormField);
        handleCloseModal();
        dialog.close();
      },
      confirmText: '닫기',
    });
  };

  return {
    formMethod,
    formRef,
    isOpenModal,
    handleSubmitCreateKeyword,
    handleClickSubmit,
    handleClickCancel,
    handleOpenModal,
  };
};
