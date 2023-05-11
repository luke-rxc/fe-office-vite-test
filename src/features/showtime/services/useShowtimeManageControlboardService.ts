import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { useQuery } from '@hooks/useQuery';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getShowtimeContentsItem, getShowtimeLiveChannel } from '../apis';
import { showtimeContentsItemQueryKey, showtimeLiveChannelQueryKey } from '../constants';
import { toShowtimeContentsItemModel, toShowtimeLiveChannelModel } from '../models';

export const useShowtimeManageControlboardService = (showTimeId: number) => {
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const copy = useClipboardCopy();

  /**
   * 쇼타임 상세 item 조회
   */
  const { data: showtimeContentsItem, isLoading: isLoadingShowtimeContentsItem } = useQuery(
    [showtimeContentsItemQueryKey, showTimeId],
    () => getShowtimeContentsItem(showTimeId),
    {
      select: (data) => {
        return toShowtimeContentsItemModel(data);
      },
    },
  );
  /**
   * 쇼타임 라이브채널 item 조회
   */
  const { data: showtimeLiveChannelItem, isLoading: isLoadingShowtimeLiveChannelItem } = useQuery(
    [showtimeLiveChannelQueryKey, showTimeId],
    () => getShowtimeLiveChannel(showTimeId),
    {
      select: (data) => {
        return toShowtimeLiveChannelModel(data);
      },
    },
  );

  const onSuccessClipboardCopy = () => {
    toast.success('복사가 완료되었습니다.');
  };

  const onErrorClipboardCopy = () => {
    toast.error('복사 도중 문제가 발생하였습니다.');
  };

  const onClickClipboardCopy = (value: string) => {
    return () => copy(value, { onSuccess: onSuccessClipboardCopy, onError: onErrorClipboardCopy });
  };

  useEffect(() => {
    isLoadingShowtimeContentsItem ? increaseLoadingTask() : decreaseLoadingTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingShowtimeContentsItem]);

  useEffect(() => {
    isLoadingShowtimeLiveChannelItem ? increaseLoadingTask() : decreaseLoadingTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingShowtimeLiveChannelItem]);

  return { showtimeContentsItem, showtimeLiveChannelItem, onClickClipboardCopy };
};
