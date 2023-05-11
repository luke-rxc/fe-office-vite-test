import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { SHORTCUT_DEFAULT_LIMIT, SHORTCUT_DEFAULT_PAGE, MainShortcutQueryKeys } from '../constants';
import {
  useMainShortcutPublishedListQuery,
  useMainShortcutPublishMutation,
  useMainShortcutListQuery,
  useMainShortcutUnpublishMutation,
  useMainShortcutUnpublishedPagination,
} from '../hooks';
import { toMainShortcutListParams } from '../models';
import { MainShortcutQueryState } from '../types';

export const useMainShortcutListService = () => {
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { queryState, updateQueryState } = useQueryState<MainShortcutQueryState>({
    page: SHORTCUT_DEFAULT_PAGE,
    limit: SHORTCUT_DEFAULT_LIMIT,
  });
  const { data: mainShortcutPublishedItems, isLoading: isLoadingMainShortcutPublishedItems } =
    useMainShortcutPublishedListQuery({ refetchOnMount: true });

  const { data: mainShortcutItems, isLoading: isLoadingMainShortcutItems } = useMainShortcutListQuery(
    toMainShortcutListParams(queryState),
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

  const { mutateAsync: requestMainShortcutPublish } = useMainShortcutPublishMutation({
    onError: onError('숏컷 배너 편성중 문제가 발생하였습니다'),
  });
  const { mutateAsync: requestMainShortcutUnpublish } = useMainShortcutUnpublishMutation({
    onError: onError('숏컷 배너 편성삭제중 문제가 발생하였습니다'),
  });

  const mainShortcutPagination = useMainShortcutUnpublishedPagination({
    total: mainShortcutItems?.totalElements ?? 0,
    queryState,
    updateQueryState,
  });

  useEffect(() => {
    if (isLoadingMainShortcutPublishedItems || isLoadingMainShortcutItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMainShortcutPublishedItems, isLoadingMainShortcutItems]);

  /**
   * 편성 추가
   */
  const handleAddPublish = (shortcutId: number) => {
    requestMainShortcutPublish(shortcutId, {
      onSuccess: () => {
        queryClient.refetchQueries(MainShortcutQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '알림',
          content: `숏컷 배너가 편성처리 되었습니다.\r\n(편성 ID: ${shortcutId})`,
        });
      },
    });
  };

  /**
   * 편성 추가
   */
  const handleRemovePublish = (shortcutId: number) => {
    requestMainShortcutUnpublish(shortcutId, {
      onSuccess: () => {
        queryClient.refetchQueries(MainShortcutQueryKeys.lists());
        dialog.open({
          type: DialogType.ALERT,
          title: '알림',
          content: `숏컷 배너가 편성삭제 처리 되었습니다.\r\n(편성 ID: ${shortcutId})`,
        });
      },
    });
  };

  /**
   * 편성 추가 click event
   */
  const handleClickAddPublish = (shortcutId: number) => {
    return () => {
      dialog.open({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `숏컷 배너를 편성 처리 하시겠습니까?\r\n(편성 ID: ${shortcutId})`,
        onConfirm: () => {
          handleAddPublish(shortcutId);
        },
      });
    };
  };

  /**
   * 편성 삭제
   */
  const handleClickRemovePublish = (shortcutId: number) => {
    return () => {
      dialog.open({
        type: DialogType.CONFIRM,
        title: '확인',
        content: `숏컷 배너를 편성삭제 처리 하시겠습니까?\r\n(편성 ID: ${shortcutId})`,
        onConfirm: () => {
          handleRemovePublish(shortcutId);
        },
      });
    };
  };

  /**
   * 배너 생성 페이지 이동
   */
  const handleClickRedirectCreate = () => {
    navigate('/display/home/shortcut/create');
  };

  return {
    mainShortcutPublishedItems: mainShortcutPublishedItems ?? [],
    isLoadingMainShortcutPublishedItems,
    mainShortcutItems: mainShortcutItems?.content ?? [],
    isLoadingMainShortcutItems,
    mainShortcutPagination,
    handleClickAddPublish,
    handleClickRemovePublish,
    handleClickRedirectCreate,
  };
};
