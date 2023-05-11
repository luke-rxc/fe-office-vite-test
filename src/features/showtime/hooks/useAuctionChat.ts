import { useCallback, useState } from 'react';
import { AuctionStatus, SendbirdActionType, SendbirdSubActionType } from '../constants';
import {
  SendbirdActionInfoCountdownMetaModel,
  SendBirdAdminMessageModel,
  SendbirdAuctionInfoBaseMetaModel,
  ShowtimeChatChannelModel,
  toSendbirdAuctionMetaModel,
  toSendbirdUserMessageModel,
} from '../models';
import { SendbirdAuctionMetaSchema } from '../schemas/SendbirdSchema';
import { useInterval } from './useInterval';

/**
 * 경매 채팅 관련 hook
 */
export const useAuctionChat = ({ auctionChatUrl }: ShowtimeChatChannelModel, updateItems: () => Promise<void>) => {
  const [countdown, setCountdown] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { clearTimer } = useInterval(
    () => {
      const currentTime = Date.now();
      if (countdown - currentTime > 0) {
        setRemainingTime(Math.round((countdown - currentTime) / 1000));
      }
    },
    countdown > 0 ? 1000 : null,
  );

  const resetCountdown = useCallback(() => {
    clearTimer();
    setCountdown(0);
    setRemainingTime(0);
    updateItems && updateItems();
  }, [clearTimer, updateItems]);

  const updateStatus = useCallback(
    (auctionInfo: SendbirdActionInfoCountdownMetaModel & SendbirdAuctionInfoBaseMetaModel) => {
      switch (auctionInfo.status) {
        case AuctionStatus.COUNTDOWN: //최종 입찰 카운트다운
          const { seconds, time } = auctionInfo.auction_timer;
          const countdownStart = new Date(time);
          countdownStart.setSeconds(countdownStart.getSeconds() + seconds);
          setCountdown(countdownStart.getTime());
          break;
        case AuctionStatus.BIDDING: // 입찰 처리
          if (countdown > 0) {
            resetCountdown();
          }
          break;
        case AuctionStatus.PAUSE: // 경매 일시정지
          updateItems && updateItems();
          break;
        case AuctionStatus.SUCCESSFUL_BID: // 경매 완료
          updateItems && updateItems();
          break;
      }
    },
    [countdown, resetCountdown, updateItems],
  );

  const handleMessageReceived = useCallback(
    (
      channel: SendBird.OpenChannel | SendBird.GroupChannel,
      message: SendBird.AdminMessage | SendBird.UserMessage,
      userId: string,
    ) => {
      if (channel.url !== auctionChatUrl) {
        return;
      }

      const auctionMessage = toSendbirdUserMessageModel(message, userId) as SendBirdAdminMessageModel;
      const { data } = auctionMessage;
      if (typeof data === 'string') {
        return;
      }

      // 최종 낙찰자 정보 receive시 경매리스트 갱신처리
      if (
        data.actionType === SendbirdActionType.MESSAGE_FOR_ADMIN &&
        data.subActionType === SendbirdSubActionType.FINAL_BIDDER
      ) {
        updateItems();
      }
    },
    [auctionChatUrl, updateItems],
  );

  const handleMetaDataUpdated = useCallback(
    (channel: SendBird.OpenChannel | SendBird.GroupChannel, meta: SendbirdAuctionMetaSchema) => {
      if (channel.url !== auctionChatUrl) {
        return;
      }
      // window.console.log('[meta]: ', meta);
      const { auction_info: auctionInfo } = toSendbirdAuctionMetaModel(meta);
      updateStatus(auctionInfo);
    },
    [auctionChatUrl, updateStatus],
  );

  return { countdown, resetCountdown, remainingTime, handleMessageReceived, handleMetaDataUpdated };
};
