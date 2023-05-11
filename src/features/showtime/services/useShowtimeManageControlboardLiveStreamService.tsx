import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { changeShowtimeLiveChannel, createShowtimeLiveChannel, getShowtimeLiveChannelPolling } from '../apis';
import { ShowtimeManageLiveStreamControlActions } from '../components';
import {
  BroadcastActionType,
  BroadcastActionTypeLabel,
  BroadcastType,
  BroadcastTypeLabel,
  LiveChannelType,
  LiveStatus,
  RehearsalStatus,
  showtimeLiveChannelQueryKey,
} from '../constants';
import { useInterval } from '../hooks';
import { ShowtimeLiveChannelModel } from '../models';
import { ShowtimeLiveChannelSchema } from '../schemas';
import { BroadcastActionInfos } from '../types';

/**
 * 컨트롤 보드 스트림 및 송출 제어 service
 */
export const useShowtimeManageControlboardLiveStreamService = (
  showTimeId: number,
  liveChannelItem: ShowtimeLiveChannelModel | undefined,
) => {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<BroadcastType>(BroadcastType.REHEARSAL);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState<boolean>(false);
  const { open: dialogOpen, close: dialogClose } = useDialog();

  useEffect(() => {
    // 리허설, 본방송이 라이브일 경우 selectedTab 설정
    if (liveChannelItem?.isLive) {
      setSelectedTab(liveChannelItem?.isLiveOnAir ? BroadcastType.ON_AIR : BroadcastType.REHEARSAL);
    }
  }, [liveChannelItem?.isLive, liveChannelItem?.isLiveOnAir]);

  // 스트림 생성
  const { mutateAsync: createLiveChannel } = useMutation(
    (broadcastType: BroadcastType) => createShowtimeLiveChannel(showTimeId, broadcastType),
    {
      onSuccess: (data) => {
        const item = queryClient.getQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId]);
        queryClient.setQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId], {
          ...item,
          ...data,
        });
      },

      onError: (error) => {
        dialogOpen({
          type: DialogType.ALERT,
          content: `스트림 생성중 문제가 발생하였습니다. ${error.data.message && `\r\n(${error.data.message})`}`,
        });
      },
    },
  );

  // 라이브 상태 변경
  const { mutateAsync: changeLiveChannel } = useMutation(
    ({ broadcastType, action }: { broadcastType: BroadcastType; action: BroadcastActionType }) =>
      changeShowtimeLiveChannel(showTimeId, broadcastType, action),
    {
      onSuccess: (data) => {
        const item = queryClient.getQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId]);
        queryClient.setQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId], {
          ...item,
          ...data,
        });
      },

      onError: (error) => {
        dialogOpen({
          type: DialogType.ALERT,
          content: `라이브 상태 변경중 문제가 발생하였습니다. ${error.data.message && `\r\n(${error.data.message})`}`,
        });
      },
    },
  );

  // 쇼타임 라이브 채널 정보 polling
  const { mutateAsync: pollingLiveChannel } = useMutation(
    (broadcastType: BroadcastType) => getShowtimeLiveChannelPolling(showTimeId, broadcastType),
    {
      onSuccess: (data) => {
        const item = queryClient.getQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId]);
        queryClient.setQueryData<ShowtimeLiveChannelSchema>([showtimeLiveChannelQueryKey, showTimeId], {
          ...item,
          ...data,
        });
      },
    },
  );

  useInterval(() => {
    // 리허설, 본방송이 라이브일 경우 쇼타임 라이브 채널 정보 polling 처리
    if (liveChannelItem?.isLive) {
      pollingLiveChannel(liveChannelItem?.isLiveOnAir ? BroadcastType.ON_AIR : BroadcastType.REHEARSAL);
    }
  }, 5000);

  /**
   * 리허설 action 정보 조회
   */
  const getRehearsalActionInfos = (liveStatus: RehearsalStatus, existAnotherLive: boolean): BroadcastActionInfos => {
    switch (liveStatus) {
      case RehearsalStatus.NONE:
      case RehearsalStatus.END:
        return [
          [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, true],
        ];
      case RehearsalStatus.CREATING:
        return [
          [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, true],
          [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, true],
        ];
      case RehearsalStatus.REHEARSAL:
        return [
          [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, true],
          [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, existAnotherLive],
        ];
    }
  };

  /**
   * 본방송 action 정보 조회
   */
  const getAirActionInfos = (liveStatus: LiveStatus, existAnotherLive: boolean): BroadcastActionInfos => {
    switch (liveStatus) {
      case LiveStatus.NONE:
        return [
          [LiveChannelType.CREATE, BroadcastType.ON_AIR, BroadcastActionType.ON_AIR, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.STANDBY:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CANCEL_STREAM, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.READY:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CANCEL_STREAM, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.LIVE:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CHANGE_STREAM, existAnotherLive],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, existAnotherLive],
        ];
      case LiveStatus.END:
        return [
          [LiveChannelType.CREATE, BroadcastType.ON_AIR, BroadcastActionType.ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
    }
  };

  const rehearsalActionInfos: BroadcastActionInfos = useMemo(() => {
    return getRehearsalActionInfos(
      liveChannelItem?.rehearsalStatus,
      liveChannelItem?.liveStatus !== LiveStatus.NONE && liveChannelItem?.liveStatus !== LiveStatus.END,
    );
  }, [liveChannelItem?.liveStatus, liveChannelItem?.rehearsalStatus]);
  const onAirActionInfos: BroadcastActionInfos = useMemo(() => {
    return getAirActionInfos(
      liveChannelItem?.liveStatus,
      liveChannelItem?.rehearsalStatus !== RehearsalStatus.NONE &&
        liveChannelItem?.rehearsalStatus !== RehearsalStatus.END,
    );
  }, [liveChannelItem?.liveStatus, liveChannelItem?.rehearsalStatus]);

  /**
   * 라이브 채널 action
   */
  const executeLiveChannelAction = useCallback(
    async (
      liveChannelType: LiveChannelType,
      broadcastType: BroadcastType,
      broadcastActionType: BroadcastActionType,
    ) => {
      const toastId = toast.loading(
        `${BroadcastTypeLabel[broadcastType]}의 ${BroadcastActionTypeLabel[broadcastActionType]} 처리중입니다.`,
      );

      try {
        if (liveChannelType === LiveChannelType.CREATE) {
          await createLiveChannel(broadcastType);
          await pollingLiveChannel(broadcastType);
        } else if (liveChannelType === LiveChannelType.UPDATE) {
          await changeLiveChannel({ broadcastType, action: broadcastActionType });
        }
      } finally {
        toast.remove(toastId);
      }
    },
    [changeLiveChannel, createLiveChannel, pollingLiveChannel],
  );

  /**
   * action item 클릭 event
   */
  const onClickActionItem = useCallback(
    async (
      liveChannelType: LiveChannelType,
      broadcastType: BroadcastType,
      broadcastActionType: BroadcastActionType,
    ) => {
      if (broadcastType === BroadcastType.ON_AIR) {
        dialogOpen({
          title: '확인',
          content: `${BroadcastActionTypeLabel[broadcastActionType]}을 진행 하시겠습니까?`,
          type: DialogType.CONFIRM,
          onConfirm: async () => {
            await executeLiveChannelAction(liveChannelType, broadcastType, broadcastActionType);
            dialogClose();
          },
          onClose: dialogClose,
        });
      } else {
        executeLiveChannelAction(liveChannelType, broadcastType, broadcastActionType);
      }
    },
    [dialogClose, dialogOpen, executeLiveChannelAction],
  );

  /**
   * 스트림 및 송출 제어 tab items
   */
  const tabItems = useMemo(() => {
    if (!liveChannelItem) {
      return [];
    }

    return [
      {
        label: '리허설',
        value: BroadcastType.REHEARSAL,
        children: (
          <ShowtimeManageLiveStreamControlActions
            liveStatusLabel={liveChannelItem.rehearsalStatusLabel}
            liveStatusMessage={liveChannelItem.rehearsalStatusMessage}
            streamStatus={liveChannelItem.rehearsalStreamStatus}
            streamStatusMessage={liveChannelItem.rehearsalStreamStatusMessage}
            broadcastType={BroadcastType.REHEARSAL}
            actionInfos={rehearsalActionInfos}
            onClickActionItem={onClickActionItem}
          />
        ),
      },
      {
        label: '본방송',
        value: BroadcastType.ON_AIR,
        children: (
          <ShowtimeManageLiveStreamControlActions
            liveStatusLabel={liveChannelItem.liveStatusLabel}
            liveStatusMessage={liveChannelItem.liveStatusMessage}
            streamStatus={liveChannelItem.liveStreamStatus}
            streamStatusMessage={liveChannelItem.liveStreamStatusMessage}
            broadcastType={BroadcastType.ON_AIR}
            actionInfos={onAirActionInfos}
            onClickActionItem={onClickActionItem}
          />
        ),
      },
    ];
  }, [liveChannelItem, onAirActionInfos, onClickActionItem, rehearsalActionInfos]);

  /**
   * tab 선택 event
   */
  const onChangeTab = (value: BroadcastType) => {
    setSelectedTab(value);
  };

  /**
   * 플레이어 loading update
   */
  const updateLoadingPlayer = (loading: boolean) => {
    setIsLoadingPlayer(loading);
  };

  return { selectedTab, tabItems, isLoadingPlayer, onChangeTab, updateLoadingPlayer };
};
