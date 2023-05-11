import { useDialog } from '@hooks/useDialog';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  deleteShowtimeAnchorPoint,
  getShowtimeAnchorPointItems,
  getShowtimeLinkedGoods,
  pairingShowtimeAnchorPoint,
  unpairingShowtimeAnchorPoint,
} from '../apis';
import {
  AnchorPointActionType,
  AnchorPointActionTypeCompleteMessage,
  AnchorPointActionTypeConfirmMessage,
  AnchorPointActionTypeErrorMessage,
  AnchorPointActionTypeLabel,
  showtimeAnchorPointItemsQueryKey,
  showtimeLinkedGoodsItemsQueryKey,
} from '../constants';
import { ShowtimeAnchorPointItemModel, toContentsGoodsOptionList, toShowtimeAnchorPointItemModelList } from '../models';

interface ConfirmProps {
  title: string;
  content: string;
  onConfirm: () => Promise<void>;
}

export const useShowtimeManageAnchorPointService = (
  showTimeId: number,
  onModifyOpenModal: (anchorPointId: number) => Promise<void>,
) => {
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const queryClient = useQueryClient();

  /**
   * 쇼타임 앵커포인트 현황 조회 (대기)
   */
  const { data: showtimeAnchorPointWaitItems, isLoading: isLoadingShowtimeAnchorPointWaitItems } = useQuery(
    [showtimeAnchorPointItemsQueryKey, showTimeId, false],
    () => getShowtimeAnchorPointItems(showTimeId, false),
    {
      select: (data) => {
        return toShowtimeAnchorPointItemModelList(data);
      },
    },
  );

  /**
   * 쇼타임 앵커포인트 현황 조회 (진행)
   */
  const { data: showtimeAnchorPointActiveItems, isLoading: isLoadingShowtimeAnchorPointActiveItems } = useQuery(
    [showtimeAnchorPointItemsQueryKey, showTimeId, true],
    () => getShowtimeAnchorPointItems(showTimeId, true),
    {
      select: (data) => {
        return toShowtimeAnchorPointItemModelList(data);
      },
    },
  );

  /**
   * 쇼타임 연결된 상품 리스트 조회
   */
  const { data: showtimeLinkedGoodsOptions, isLoading: isLoadingShowtimeLinkedGoodsOptions } = useQuery(
    [showtimeLinkedGoodsItemsQueryKey, showTimeId],
    () => getShowtimeLinkedGoods(showTimeId),
    {
      select: (data) => {
        return toContentsGoodsOptionList(data);
      },
    },
  );

  /**
   * 쇼타임 앵커포인트 item 삭제
   */
  const { mutateAsync: deleteAnchorPoint } = useMutation(
    (anchorPointId: number) => deleteShowtimeAnchorPoint(showTimeId, anchorPointId),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${AnchorPointActionTypeErrorMessage[AnchorPointActionType.DELETE]}\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 쇼타임 앵커포인트 item 즉시편성
   */
  const { mutateAsync: pairingAnchorPoint } = useMutation(
    (anchorPointId: number) => pairingShowtimeAnchorPoint(showTimeId, anchorPointId),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${AnchorPointActionTypeErrorMessage[AnchorPointActionType.PAIRING]}\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 쇼타임 앵커포인트 item 즉시편성
   */
  const { mutateAsync: unpairingAnchorPoint } = useMutation(
    (anchorPointId: number) => unpairingShowtimeAnchorPoint(showTimeId, anchorPointId),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${AnchorPointActionTypeErrorMessage[AnchorPointActionType.UNPAIRING]}\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  useEffect(() => {
    isLoadingShowtimeAnchorPointWaitItems ? increaseLoadingTask() : decreaseLoadingTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingShowtimeAnchorPointWaitItems]);

  useEffect(() => {
    isLoadingShowtimeAnchorPointActiveItems ? increaseLoadingTask() : decreaseLoadingTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingShowtimeAnchorPointActiveItems]);

  useEffect(() => {
    isLoadingShowtimeLinkedGoodsOptions ? increaseLoadingTask() : decreaseLoadingTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingShowtimeLinkedGoodsOptions]);

  /**
   * confirm dialog
   */
  const confirm = ({ title, content, onConfirm }: ConfirmProps) => {
    dialogOpen({
      title: title,
      content: content,
      type: DialogType.CONFIRM,
      onConfirm,
      onClose: dialogClose,
    });
  };

  /**
   * loading dialog
   */
  const loading = () => {
    dialogOpen({
      content: '진행중입니다. 잠시만 기다려주세요.',
      type: DialogType.ALERT,
    });
  };

  /**
   * 앵커포인트 수정 액션
   */
  const handleClickActionModify = (id: number) => {
    onModifyOpenModal(id);
  };

  /**
   * 앵커포인트 액션
   */
  const handleClickAction = (actionType: AnchorPointActionType, item: ShowtimeAnchorPointItemModel) => {
    if (actionType === AnchorPointActionType.MODIFY) {
      handleClickActionModify(item.id);
    } else {
      confirm({
        title: AnchorPointActionTypeLabel[actionType],
        content: `${AnchorPointActionTypeConfirmMessage[actionType]}\r\n(${item.name})`,
        onConfirm: async () => {
          loading();

          if (actionType === AnchorPointActionType.DELETE) {
            await deleteAnchorPoint(item.id);
          } else if (actionType === AnchorPointActionType.PAIRING) {
            await pairingAnchorPoint(item.id);
          } else if (actionType === AnchorPointActionType.UNPAIRING) {
            await unpairingAnchorPoint(item.id);
          }

          dialogOpen({
            title: '알림',
            content: `${AnchorPointActionTypeCompleteMessage[actionType]}\r\n(${item.name})`,
            type: DialogType.ALERT,
          });

          queryClient.invalidateQueries([showtimeAnchorPointItemsQueryKey, showTimeId, false]);
          queryClient.invalidateQueries([showtimeAnchorPointItemsQueryKey, showTimeId, true]);
        },
      });
    }
  };

  return {
    showtimeAnchorPointWaitItems,
    showtimeAnchorPointActiveItems,
    showtimeLinkedGoodsOptions,
    handleClickAction,
  };
};
