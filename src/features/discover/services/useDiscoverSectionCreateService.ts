import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { DiscoverSectionDisplayType, DiscoverSectionQueryKeys, DiscoverSectionType } from '../constants';
import {
  useDiscoverKeywordComboListQuery,
  useDiscoverSectionCreatableTypeQuery,
  useDiscoverSectionCreateMutation,
  useModal,
} from '../hooks';
import { getDisplayTypeDefaultBySectionType } from '../models';
import { DiscoverSectionCreateFormField } from '../types';

const discoverSectionDefaultFormField: DiscoverSectionCreateFormField = {
  title: '',
  displayType: '',
  sectionType: '',
  keyword: null,
};

export type ReturnTypeUseDiscoverSectionCreateService = ReturnType<typeof useDiscoverSectionCreateService>;

export const useDiscoverSectionCreateService = () => {
  const formRef = useRef<HTMLFormElement>();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const { isOpenModal, handleOpenModal, handleCloseModal } = useModal();
  const formMethod = useForm<DiscoverSectionCreateFormField>({
    defaultValues: discoverSectionDefaultFormField,
  });
  const { watch, setValue, handleSubmit, reset, clearErrors } = formMethod;

  const { data: sectionCreatableTypeList } = useDiscoverSectionCreatableTypeQuery({ enabled: isOpenModal });

  useEffect(() => {
    const subscription = watch(({ displayType, sectionType }, { name }) => {
      // 주문상태 변경시 error clear
      if (name === 'sectionType') {
        !!displayType && setValue('displayType', '');
        clearErrors();
      } else if (name === 'displayType') {
        setValue(
          'title',
          getDisplayTypeDefaultBySectionType(
            sectionType as DiscoverSectionType,
            displayType as DiscoverSectionDisplayType,
          ),
        );
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const { mutateAsync: registDiscoverSection } = useDiscoverSectionCreateMutation();
  const { data: keywordComboList } = useDiscoverKeywordComboListQuery({
    enabled: isOpenModal,
    cacheTime: 0,
  });

  /**
   * 디스커버 섹션 등록
   */
  const handleCreateSection = (values: DiscoverSectionCreateFormField) => {
    registDiscoverSection(values, {
      onSuccess: () => {
        queryClient.refetchQueries(DiscoverSectionQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '등록완료',
          content: `디스커버 섹션이 등록되었습니다.`,
          onClose: () => {
            handleCloseModal();
            reset(discoverSectionDefaultFormField);
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `디스커버 섹션 등록 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 디스커버 섹션 등록 submit
   */
  const handleSubmitCreateSection = handleSubmit((values) => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `디스커버 섹션을 등록 하시겠습니까?`,
      onConfirm: () => handleCreateSection(values),
      confirmText: '등록',
    });
  });

  /**
   * 디스커버 섹션 등록 submit click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 디스커버 섹션 등록 취소
   */
  const handleClickCancel = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `디스커버 섹션 등록을 취소 하시겠습니까?`,
      onConfirm: () => {
        reset(discoverSectionDefaultFormField);
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
    keywordComboList,
    sectionCreatableTypeList,
    handleSubmitCreateSection,
    handleClickSubmit,
    handleClickCancel,
    handleOpenModal,
  };
};
