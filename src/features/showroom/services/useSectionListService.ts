import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import { useState, useCallback } from 'react';
import { DialogType } from '@models/DialogModel';
import { useDialog } from '@hooks/useDialog';
import { useShowroom } from '../hooks';
import { SectionListItem } from '../types';
import { useDeleteSectionMutation, useUpdateSectionStatusMutation } from './mutations';
import { useSectionListQuery } from './queries';

export const useSectionListService = () => {
  const dialog = useDialog();
  const { id: showroomId } = useShowroom();

  const [pagination, setPagination] = useState<{ page: number; size: number }>({ page: 1, size: 10 });
  const [selectItemIds, setSelectItemIds] = useState<number[]>([]);

  const sectionQuery = useSectionListQuery({ showroomId, ...pagination }, { enabled: !!showroomId });

  const updateMutation = useUpdateSectionStatusMutation({
    onSuccess: () => {
      sectionQuery.refetch();
      toast.success('전시 섹션 상태를 변경했습니다');
    },
    onError: (error) => {
      toast.error(error?.data?.message || '전시 섹션 상태를 변경할 수 없습니다');
    },
  });

  const deleteMutation = useDeleteSectionMutation({
    onSuccess: () => {
      setSelectItemIds([]);
      sectionQuery.refetch();
      toast.success('전시 섹션을 삭제했습니다');
    },
    onError: (error) => {
      toast.error(error?.data?.message || '전시 섹션을 삭제할 수 없습니다');
    },
  });

  const handleChangePage = (page: typeof pagination.page, size: typeof pagination.size) => {
    if (pagination.page !== page || pagination.size !== size) {
      setSelectItemIds([]);
      setPagination({ page, size });
    }
  };

  const handleChangeSelectItemIds = (ids: typeof selectItemIds) => {
    setSelectItemIds(ids);
  };

  const handleChangeStatus = useCallback(
    ({ id, status, contentCount }: SectionListItem) => {
      if (status === 'PRIVATE' && contentCount === 0) {
        return dialog.open({
          type: DialogType.ALERT,
          content: '섹션에 전시된 상품이 없어\n공개 상태로 변경이 불가해요',
        });
      }

      dialog.open({
        type: DialogType.CONFIRM,
        content: '공개 설정을 변경할까요?',
        onConfirm: () => {
          dialog.close();
          updateMutation.mutate({ showroomId, sectionId: id, status: status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC' });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showroomId],
  );

  const handleDeleteItems = useCallback(() => {
    if (isEmpty(selectItemIds)) {
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      content: '선택한 섹션을 삭제할까요?',
      onConfirm: () => {
        dialog.close();
        deleteMutation.mutate({ showroomId, contentIds: selectItemIds });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showroomId, selectItemIds]);

  return {
    ...pagination,
    items: sectionQuery.data?.content || [],
    total: sectionQuery.data?.totalElements || 0,
    isLoading: sectionQuery.isLoading,
    selectItemIds,
    handler: {
      changePage: handleChangePage,
      changeStatus: handleChangeStatus,
      changeSelect: handleChangeSelectItemIds,
      deleteSection: handleDeleteItems,
    },
  };
};
