import { useDialog } from '@hooks/useDialog';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { useEffect } from 'react';
import { lazy, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { createShowtimeChatChannel, getShowtimeChatChannel, getShowtimeContentsItem } from '../apis';
import { TabItem } from '../components';
import {
  ContentsType,
  ManagePageType,
  ManagePageTypeLabel,
  showtimeChatChannelQueryKey,
  showtimeContentsItemQueryKey,
  showtimeLiveChannelCreateQueryKey,
} from '../constants';
import { toShowtimeChatChannelModel, toShowtimeContentsItemModel } from '../models';

const ShowtimeManageAuctionContainer = lazy(() => import('../containers/ShowtimeManageAuctionContainer'));
const ShowtimeManageControlboardContainer = lazy(() => import('../containers/ShowtimeManageControlboardContainer'));
const ShowtimeManageAnchorPointContainer = lazy(() => import('../containers/ShowtimeManageAnchorPointContainer'));
const ShowtimeManageChatManagementContainer = lazy(() => import('../containers/ShowtimeManageChatManagementContainer'));
const ShowtimeManageRaffleEventContainer = lazy(() => import('../containers/ShowtimeManageRaffleEventContainer'));

interface Props {
  showTimeId: number;
  pageType: string;
}

export const useShowtimeManageDashboardService = ({ showTimeId, pageType }: Props) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<ManagePageType>(pageType as ManagePageType);
  const { open: dialogOpen } = useDialog();

  const {
    isSuccess: isSuccessCreateChatChannel,
    isLoading: isLoadingCreateChatChannel,
    isError: isErrorCreateChatChannel,
  } = useQuery(showtimeLiveChannelCreateQueryKey, () => createShowtimeChatChannel(showTimeId));

  const {
    data: showtimeContentsItem,
    isLoading: isLoadingShowtimeContentsItem,
    isError: isErrorShowtimeContentsItem,
  } = useQuery([showtimeContentsItemQueryKey, showTimeId], () => getShowtimeContentsItem(showTimeId), {
    select: toShowtimeContentsItemModel,
    enabled: !isLoadingCreateChatChannel && isSuccessCreateChatChannel,
  });

  const {
    data: chatChannelItem,
    isLoading: isLoadingChatChannelItem,
    isError: isErrorChatChannelItem,
  } = useQuery([showtimeChatChannelQueryKey, showTimeId], () => getShowtimeChatChannel(showTimeId), {
    select: toShowtimeChatChannelModel,
    enabled: !isLoadingCreateChatChannel && isSuccessCreateChatChannel,
  });

  useEffect(() => {
    if (isErrorCreateChatChannel || isErrorShowtimeContentsItem || isErrorChatChannelItem) {
      dialogOpen({
        type: DialogType.ALERT,
        title: '에러',
        content: '해당 라이브 정보를 받아올수 없습니다.\r\n다시 시도해주세요.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorCreateChatChannel, isErrorShowtimeContentsItem, isErrorChatChannelItem]);

  const handleChangeTab = (selectTabValue: ManagePageType) => {
    navigate(`/showtime/manage/dashboard/${showTimeId}/${selectTabValue.toLowerCase()}`);
    setSelectedTab(selectTabValue);
  };

  const tabItems: Array<TabItem<ManagePageType>> = useMemo(() => {
    return [
      {
        label: ManagePageTypeLabel[ManagePageType.CHAT],
        value: ManagePageType.CHAT,
        children: (
          <ShowtimeManageChatManagementContainer
            showTimeId={showTimeId}
            chatChannelItem={chatChannelItem}
            showtimeContentsItem={showtimeContentsItem}
          />
        ),
      },
      // {
      //   label: ManagePageTypeLabel[ManagePageType.CHAT_MONITORING],
      //   value: ManagePageType.CHAT_MONITORING,
      //   children: '채팅 모니터링 (준비중)',
      // },
      {
        label: ManagePageTypeLabel[ManagePageType.CONTROL_BOARD],
        value: ManagePageType.CONTROL_BOARD,
        children: <ShowtimeManageControlboardContainer showTimeId={showTimeId} />,
      },
      {
        label: ManagePageTypeLabel[ManagePageType.ANCHOR_POINT],
        value: ManagePageType.ANCHOR_POINT,
        children: <ShowtimeManageAnchorPointContainer showTimeId={showTimeId} />,
        hide: showtimeContentsItem?.contentsType === ContentsType.AUCTION,
      },
      {
        label: ManagePageTypeLabel[ManagePageType.AUCTION],
        value: ManagePageType.AUCTION,
        children: <ShowtimeManageAuctionContainer showTimeId={showTimeId} chatChannelItem={chatChannelItem} />,
        hide: showtimeContentsItem?.contentsType !== ContentsType.AUCTION,
      },
      {
        label: ManagePageTypeLabel[ManagePageType.RAFFLE_EVENT],
        value: ManagePageType.RAFFLE_EVENT,
        children: <ShowtimeManageRaffleEventContainer showTimeId={showTimeId} />,
      },
      // {
      //   label: ManagePageTypeLabel[ManagePageType.STATISTICS],
      //   value: ManagePageType.STATISTICS,
      //   children: '통계 (준비중)',
      // },
    ];
  }, [showTimeId, chatChannelItem, showtimeContentsItem]);

  return {
    tabItems,
    selectedTab,
    isLoadingCreateChatChannel,
    isLoadingShowtimeContentsItem,
    isLoadingChatChannelItem,
    isErrorCreateChatChannel,
    isErrorShowtimeContentsItem,
    isErrorChatChannelItem,
    handleChangeTab,
  };
};
