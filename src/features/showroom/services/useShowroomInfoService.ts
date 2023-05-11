/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';
import toNumber from 'lodash/toNumber';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { showroomUpdateValidation } from '../utils';
import { ShowroomFormFieldOptions } from '../types';
import { ShowroomFieldDefaultValues, ShowroomTypeOptions, ShowroomStatusOptions } from '../constants';
import { useShowroom } from '../hooks';
import { useUpdateShowroomInfoMutation } from './mutations';
import {
  ShowroomListQueryKeys,
  ShowroomInfoQueryKeys,
  useShowroomInfoQuery,
  useBrandComboListQuery,
  useKeywordComboListQuery,
} from './queries';

/**
 * 쇼룸 정보 조회 및 수정 Service
 */
export const useShowroomInfoService = () => {
  const { id } = useParams();
  const [mode, setMode] = useState<'edit' | 'read'>('read');
  const dialog = useDialog();
  const showroom = useShowroom();
  const queryClient = useQueryClient();

  /**
   * 쇼룸ID
   */
  const showroomId = toNumber(id);

  /**
   * 쇼룸 필드 값
   */
  const formMethods = useForm({
    defaultValues: ShowroomFieldDefaultValues,
    resolver: showroomUpdateValidation(showroomId),
  });

  /**
   * 쇼룸 정보 수정 Mutation
   */
  const showroomUpdateMutation = useUpdateShowroomInfoMutation({});

  /**
   * 쇼룸 정보 조회 Query
   */
  // prettier-ignore
  const showroomQuery = useShowroomInfoQuery({ showroomId }, { onSuccess: (data) => {
    formMethods.reset(data);
    showroom.refetch({ showroomId });
  } });

  /**
   * 키워드 콤보 Query
   */
  const keywordsComboQuery = useKeywordComboListQuery({ enabled: mode === 'edit' });

  /**
   * 브랜드 콤보 Query
   */
  const brandComboQuery = useBrandComboListQuery(
    { showroomId: showroomId, providerId: showroomQuery?.data?.provider.id },
    { enabled: mode === 'edit' },
  );

  /**
   * 쇼룸 필드 옵션
   */
  const formOptions: ShowroomFormFieldOptions = {
    provider: [],
    type: ShowroomTypeOptions,
    status: ShowroomStatusOptions,
    brand: brandComboQuery?.data || [],
    keywords: keywordsComboQuery?.data || [],
  };

  /**
   * 쇼룸 수정
   */
  const handleEdit = () => setMode('edit');

  /**
   * 쇼룸 수정 저장
   */
  const handleSave = formMethods.handleSubmit((values) => {
    if (isEqual(formMethods.getValues(), showroomQuery?.data)) {
      return dialog.open({ type: DialogType.ALERT, content: '변경된 내용이 없습니다.' });
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '변경 사항을 저장 및 적용 합니다.\n이대로 저장 할까요?',
      onConfirm: async () => {
        try {
          dialog.close();

          // 쇼룸 수정 요청
          const data = await showroomUpdateMutation.mutateAsync({ ...values, showroomId: showroomId });

          // 쇼룸 정보 update
          queryClient.setQueryData(ShowroomInfoQueryKeys.item({ showroomId }), data);

          // 쇼룸 목록 refetch
          queryClient.refetchQueries(ShowroomListQueryKeys.lists());

          setMode('read');
          toast.success('쇼룸 수정 완료');
        } catch (error) {
          dialog.close();
          toast.error(error?.data?.message || '쇼룸 수정 실패');
        }
      },
    });
  });

  /**
   * 쇼룸 수정 취소
   */
  const handleCancel = () => {
    // 변경된 값이 없으면 바로 수정 취소 수행
    if (isEqual(formMethods.getValues(), showroomQuery?.data)) {
      return setMode('read');
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '정말, 기본 정보 및 꾸미기를 취소하시나요?\n작성한 내용은 저장되지 않습니다.',
      onConfirm: () => {
        dialog.close();
        setMode('read');
        formMethods.reset(showroomQuery.data);
      },
    });
  };

  /**
   * Mount시 ShowroomFormField setting
   */
  useEffect(() => {
    if (showroomQuery.data && !isEqual(showroomQuery.data, formMethods.getValues())) {
      showroom.refetch({ showroomId });
      formMethods.reset(showroomQuery.data);
    }
  }, []);

  return {
    mode,
    formMethods,
    formOptions,
    handler: {
      edit: handleEdit,
      save: handleSave,
      cancel: handleCancel,
    },
  };
};
