import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import {
  useFeedDeletePublishingMutation,
  useFeedPostPublishMutation,
  useMainFeedQuery,
  useUnpublishedFeedQuery,
  useUnpublishedMainFeedPagination,
} from '.';
import { FEED_DEFAULT_LIMIT, FEED_DEFAULT_PAGE } from '../constants';
import { DeleteFeedPublishingMutationParams, MainFeedQueryState } from '../types';

export type UseMainFeedListService = ReturnType<typeof useMainFeedListService>;

export const useMainFeedListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  const navigate = useNavigate();

  const { queryState, updateQueryState } = useQueryState<MainFeedQueryState>({
    page: String(FEED_DEFAULT_PAGE),
    limit: String(FEED_DEFAULT_LIMIT),
  });

  const { data: mainFeedList, isLoading: isMainFeedListLoading } = useMainFeedQuery();
  const { data: unpublishedMainFeedList, isLoading: isUnpublishedMainFeedListLoading } = useUnpublishedFeedQuery({
    queryState,
  });

  const { mutate: deletePublishing } = useFeedDeletePublishingMutation({
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

  const { mutate: addPublishing } = useFeedPostPublishMutation({
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
    (params: DeleteFeedPublishingMutationParams) => {
      dialog.open({
        title: '편성 추가',
        content: '해당 피드를 편성 추가하시겠습니까?',
        type: DialogType.CONFIRM,
        onConfirm: () => {
          dialog.close();
          addPublishing(params);
        },
      });
    },
    [dialog, addPublishing],
  );

  const pagination = useUnpublishedMainFeedPagination({
    total: unpublishedMainFeedList?.totalElements ?? 0,
    queryState,
    updateQueryState,
  });

  const onDeletePublishing = useCallback(
    (params: DeleteFeedPublishingMutationParams) => {
      dialog.open({
        title: '편성 삭제',
        content: '해당 메인 피드 편성을 삭제하시겠습니까?',
        type: DialogType.CONFIRM,
        onConfirm: () => {
          dialog.close();
          deletePublishing(params);
        },
      });
    },
    [dialog, deletePublishing],
  );

  const goToCreatePage = () => {
    navigate('/display/home/feed/create');
  };

  const alertUnableToPublish = () => {
    dialog.open({
      content: '편성이 불가능한 피드입니다.',
      type: DialogType.ALERT,
    });
  };

  return {
    mainFeedList,
    isMainFeedListLoading,
    unpublishedMainFeedList,
    isUnpublishedMainFeedListLoading,
    pagination,
    onDeletePublishing,
    onAddPublishing,
    goToCreatePage,
    alertUnableToPublish,
  };
};
