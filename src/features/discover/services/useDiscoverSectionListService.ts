import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { SECTION_DEFAULT_PAGE, SECTION_DEFAULT_LIMIT, DiscoverSectionQueryKeys } from '../constants';
import { useDiscoverSectionDeleteMutation, useDiscoverSectionListQuery } from '../hooks';
import { DiscoverSectionQueryState } from '../types';

export type ReturnTypeUseDiscoverSectionListService = ReturnType<typeof useDiscoverSectionListService>;

/**
 * 디스커버 섹션 리스트 service
 */
export const useDiscoverSectionListService = () => {
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const queryClient = useQueryClient();
  const { queryState, updateQueryState } = useQueryState<DiscoverSectionQueryState>({
    page: SECTION_DEFAULT_PAGE,
    limit: SECTION_DEFAULT_LIMIT,
  });
  const { data: discoverSectionItems, isLoading: isLoadingDiscoverSectionItems } = useDiscoverSectionListQuery(
    queryState,
    { refetchOnMount: true },
  );

  const { mutateAsync: deleteDiscoverSection } = useDiscoverSectionDeleteMutation();

  useEffect(() => {
    if (isLoadingDiscoverSectionItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDiscoverSectionItems]);

  /**
   * 디스커버 섹션 아이템 삭제 (확인)
   */
  const executeDeleteSectionItem = (sectionId: number) => {
    deleteDiscoverSection(sectionId, {
      onSuccess: () => {
        queryClient.refetchQueries(DiscoverSectionQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '삭제완료',
          content: `해당 디스커버 섹션이 삭제 처리되었습니다.\r\n(섹션 ID: ${sectionId})`,
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `디스커버 섹션 삭제 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 디스커버 섹션 아이템 삭제 (확인) click event
   */
  const handleDeleteSectionItem = (sectionId: number) => {
    return () => {
      dialog.open({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `해당 디스커버 섹션을 삭제 처리하시겠습니까?\r\n(섹션 ID: ${sectionId})`,
        onConfirm: () => {
          executeDeleteSectionItem(sectionId);
        },
      });
    };
  };

  /**
   * 페이지 번호 및 페이지수 변경 처리
   */
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      limit: limit.toString(),
    });
  };

  return {
    discoverSectionItems: discoverSectionItems?.content ?? [],
    isLoading: isLoadingDiscoverSectionItems,
    pagination: {
      limit: Number(queryState.limit) || SECTION_DEFAULT_LIMIT,
      page: Number(queryState.page) || SECTION_DEFAULT_PAGE,
      total: discoverSectionItems?.totalElements || 0,
      onChange: handleChangePagination,
    },
    handleDeleteSectionItem,
  };
};
