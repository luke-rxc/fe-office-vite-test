import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  useBannerDeletePublishingMutation,
  useBannerPostPublishMutation,
  useBannerQuery,
  useUnpublishedBannerQuery,
  useUnpublishedMainBannerPagination,
} from '.';
import { BANNER_DEFAULT_LIMIT, BANNER_DEFAULT_PAGE } from '../constants';
import { DeleteBannerPublishingMutationParams, MainBannerQueryState } from '../types';

export type UseMainBannerListService = ReturnType<typeof useMainBannerListService>;

export const useMainBannerListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  const navigate = useNavigate();

  const { queryState, updateQueryState } = useQueryState<MainBannerQueryState>({
    page: String(BANNER_DEFAULT_PAGE),
    limit: String(BANNER_DEFAULT_LIMIT),
  });

  const { data: mainBannerList, isLoading: isMainBannerListLoading } = useBannerQuery();
  const { data: unpublishedMainBannerList, isLoading: isUnpublishedMainBannerListLoading } = useUnpublishedBannerQuery({
    queryState,
  });

  const { mutate: deletePublishing } = useBannerDeletePublishingMutation({
    onMutate: () => {
      showLoading();
    },
    onSuccess: () => {
      toast.success('편성 삭제가 완료되었습니다.');
    },
    onError: (error) => {
      dialog.open({
        content: `편성 삭제 처리 중 문제가 발생했습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
    onSettled: hideLoading,
  });

  const onDeletePublishing = useCallback(
    (params: DeleteBannerPublishingMutationParams) => {
      dialog.open({
        title: '편성 삭제',
        content: '해당 메인 배너 편성을 삭제하시겠습니까?',
        type: DialogType.CONFIRM,
        onConfirm: () => {
          dialog.close();
          deletePublishing(params);
        },
      });
    },
    [dialog, deletePublishing],
  );

  const { mutate: addPublishing } = useBannerPostPublishMutation({
    onMutate: () => {
      showLoading();
    },
    onSuccess: () => {
      toast.success('편성 추가가 완료되었습니다.');
    },
    onError: (error) => {
      dialog.open({
        content: `편성 추가 처리 중 문제가 발생했습니다.\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    },
    onSettled: hideLoading,
  });

  const onAddPublishing = useCallback(
    (params: DeleteBannerPublishingMutationParams) => {
      dialog.open({
        title: '편성 추가',
        content: '해당 배너를 편성 추가하시겠습니까?',
        type: DialogType.CONFIRM,
        onConfirm: () => {
          dialog.close();
          addPublishing(params);
        },
      });
    },
    [dialog, addPublishing],
  );

  const pagination = useUnpublishedMainBannerPagination({
    total: unpublishedMainBannerList?.totalElements ?? 0,
    queryState,
    updateQueryState,
  });

  const goToCreatePage = () => {
    navigate('/display/home/banner/create');
  };

  const alertUnableToPublish = () => {
    dialog.open({
      content: '편성이 불가능한 배너입니다.',
      type: DialogType.ALERT,
    });
  };

  return {
    mainBannerList,
    isMainBannerListLoading,
    unpublishedMainBannerList,
    isUnpublishedMainBannerListLoading,
    pagination,
    onDeletePublishing,
    onAddPublishing,
    goToCreatePage,
    alertUnableToPublish,
  };
};
