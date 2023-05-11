/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';
import { useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { DialogType } from '@models/DialogModel';
import { useDialog } from '@hooks/useDialog';
import { sectionValidation } from '../utils';
import { SectionFormFieldOptions } from '../types';
import { SectionFieldDefaultValues, SectionFormStatusFieldOptions } from '../constants';
import { useUpdateSectionInfoMutation, useCreateSectionMutation } from './mutations';
import { useSectionInfoQuery, SectionListQueryKeys, GoodsListQueryKeys } from './queries';

export const useSectionInfoService = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const params = useParams();
  const dialog = useDialog();

  const showroomId = toNumber(params.id || 0);
  const sectionId = toNumber(params.sectionId || 0);

  const [mode, setMode] = useState<'create' | 'edit' | 'read'>(sectionId ? 'read' : 'create');

  const [contentIds, setContentIds] = useState<number[]>([]);

  /**
   * 섹션 필드 값
   */
  const formMethods = useForm({
    defaultValues: SectionFieldDefaultValues,
    resolver: sectionValidation(),
  });

  const sectionQuery = useSectionInfoQuery(
    { showroomId, sectionId },
    {
      cacheTime: 0,
      enabled: !!showroomId && !!sectionId,
      onSuccess: (data) => {
        formMethods.reset(data);
      },
    },
  );

  const sectionCreateMutation = useCreateSectionMutation({
    onSuccess: (data) => {
      toast.success('섹션 생성 완료');
      queryClient.removeQueries({ queryKey: SectionListQueryKeys.lists() });
      queryClient.refetchQueries(GoodsListQueryKeys.list({ showroomId, sectionId }));
      setMode('read');
      navigate(`${data.id}`);
    },
    onError: (error) => {
      toast.error(error?.data?.message || '섹션 생성 실패');
    },
  });

  const sectionUpdateMutation = useUpdateSectionInfoMutation({
    onSuccess: () => {
      toast.success('섹션 수정 완료');
      queryClient.removeQueries({ queryKey: SectionListQueryKeys.lists() });
      queryClient.refetchQueries(GoodsListQueryKeys.list({ showroomId, sectionId })).finally(() => {
        setMode('read');
      });
    },
    onError: (error) => {
      toast.error(error?.data?.message || '섹션 수정 실패');
    },
  });

  const formOptions: SectionFormFieldOptions = {
    status: SectionFormStatusFieldOptions,
  };

  // 전시 아이템 수정
  const handleUpdateItems = (ids: number[]) => {
    setContentIds(ids);
  };

  // 생성
  const handleCreate = useCallback(
    formMethods.handleSubmit((values) => {
      if (values.status === 'PUBLIC' && isEmpty(contentIds)) {
        return dialog.open({
          type: DialogType.ALERT,
          content: '공개상태는 1개 이상의 전시 상품이 있어야 합니다',
        });
      }
      sectionCreateMutation.mutate({ ...values, contentIds, showroomId });
    }),
    [contentIds],
  );

  const handleEdit = () => {
    setMode('edit');
  };

  const handleRefresh = async () => {
    try {
      await sectionQuery.refetch();
      await queryClient.refetchQueries(GoodsListQueryKeys.list({ showroomId, sectionId }));
      toast.success('새로고침 완료');
    } catch (error) {
      toast.error(error?.data?.message || '섹션 정보를 새로 고칠 수 없습니다');
    }
  };

  // 저장
  const handleSave = useCallback(
    formMethods.handleSubmit((values) => {
      if (values.status === 'PUBLIC' && isEmpty(contentIds)) {
        return dialog.open({
          type: DialogType.ALERT,
          content: '공개상태는 1개 이상의 전시 상품이 있어야 합니다',
        });
      }

      dialog.open({
        type: DialogType.CONFIRM,
        content: '변경 사항을 저장 및 적용 합니다.\n이대로 저장 할까요?',
        onConfirm: () => {
          dialog.close();
          sectionUpdateMutation.mutateAsync({ ...values, contentIds, showroomId, sectionId });
        },
      });
    }),
    [contentIds],
  );

  // 취소
  const handleCancel = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      content: `정말, 색션 ${mode === 'create' ? '추가' : '수정'}를 취소하시나요?\n작성한 내용은 저장되지 않습니다.`,
      onConfirm: () => {
        dialog.close();
        if (mode === 'create') {
          return navigate(`/showroom/${showroomId}`);
        }
        setMode('read');
        formMethods.reset(sectionQuery.data);
      },
    });
  };

  return {
    mode,
    formMethods,
    formOptions,
    handler: {
      save: handleSave,
      edit: handleEdit,
      cancel: handleCancel,
      create: handleCreate,
      updateItem: handleUpdateItems,
      refresh: handleRefresh,
    },
  };
};
