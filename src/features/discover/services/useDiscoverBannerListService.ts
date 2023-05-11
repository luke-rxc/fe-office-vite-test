import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { BANNER_DEFAULT_LIMIT, BANNER_DEFAULT_PAGE, DiscoverBannerQueryKeys } from '../constants';
import {
  useDiscoverBannerPublishedListQuery,
  useDiscoverBannerPublishMutation,
  useDiscoverBannerListQuery,
  useDiscoverBannerUnpublishMutation,
  useUnpublishedDiscoverBannerPagination,
} from '../hooks';
import { toDiscoverBannerListParams } from '../models';
import { DiscoverBannerQueryState } from '../types';

export const useDiscoverBannerListService = () => {
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { queryState, updateQueryState } = useQueryState<DiscoverBannerQueryState>({
    page: BANNER_DEFAULT_PAGE,
    limit: BANNER_DEFAULT_LIMIT,
  });
  const { data: discoverBannerPublishedItems, isLoading: isLoadingDiscoverBannerPublishedItems } =
    useDiscoverBannerPublishedListQuery({ refetchOnMount: true });

  const { data: discoverBannerItems, isLoading: isLoadingDiscoverBannerItems } = useDiscoverBannerListQuery(
    toDiscoverBannerListParams(queryState),
    { refetchOnMount: true },
  );

  const onError = (message: string) => {
    return (error: ErrorModel) => {
      dialog.open({
        type: DialogType.ALERT,
        title: '오류',
        content: `${message}\r\n(${error.data.message})`,
      });
    };
  };

  const { mutateAsync: requestDiscoverBannerPublish } = useDiscoverBannerPublishMutation({
    onError: onError('디스커버 배너 편성중 문제가 발생하였습니다'),
  });
  const { mutateAsync: requestDiscoverBannerUnpublish } = useDiscoverBannerUnpublishMutation({
    onError: onError('디스커버 배너 편성삭제중 문제가 발생하였습니다'),
  });

  const discoverBannerPagination = useUnpublishedDiscoverBannerPagination({
    total: discoverBannerItems?.totalElements ?? 0,
    queryState,
    updateQueryState,
  });

  useEffect(() => {
    if (isLoadingDiscoverBannerPublishedItems || isLoadingDiscoverBannerItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDiscoverBannerPublishedItems, isLoadingDiscoverBannerItems]);

  /**
   * 편성 추가
   */
  const handleAddPublish = (bannerId: number) => {
    requestDiscoverBannerPublish(bannerId, {
      onSuccess: () => {
        queryClient.refetchQueries(DiscoverBannerQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '알림',
          content: `디스커버 배너가 편성처리 되었습니다.\r\n(편성 ID: ${bannerId})`,
        });
      },
    });
  };

  /**
   * 편성 삭제
   */
  const handleRemovePublish = (bannerId: number) => {
    requestDiscoverBannerUnpublish(bannerId, {
      onSuccess: () => {
        queryClient.refetchQueries(DiscoverBannerQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '알림',
          content: `디스커버 배너가 편성삭제 처리 되었습니다.\r\n(편성 ID: ${bannerId})`,
        });
      },
    });
  };

  /**
   * 편성 추가 click event
   */
  const handleClickAddPublish = (bannerId: number) => {
    return () => {
      dialog.open({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `디스커버 배너를 편성 처리 하시겠습니까?\r\n(편성 ID: ${bannerId})`,
        onConfirm: () => {
          handleAddPublish(bannerId);
        },
      });
    };
  };

  /**
   * 편성 삭제 click event
   */
  const handleClickRemovePublish = (bannerId: number) => {
    return () => {
      dialog.open({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `디스커버 배너를 편성삭제 처리 하시겠습니까?\r\n(편성 ID: ${bannerId})`,
        onConfirm: () => {
          handleRemovePublish(bannerId);
        },
      });
    };
  };

  /**
   * 배너 생성 페이지 이동
   */
  const handleClickRedirectCreate = () => {
    navigate('/display/discover/banner/create');
  };

  return {
    discoverBannerPublishedItems: discoverBannerPublishedItems ?? [],
    isLoadingDiscoverBannerPublishedItems,
    discoverBannerItems: discoverBannerItems?.content ?? [],
    isLoadingDiscoverBannerItems,
    discoverBannerPagination,
    handleClickAddPublish,
    handleClickRemovePublish,
    handleClickRedirectCreate,
  };
};
