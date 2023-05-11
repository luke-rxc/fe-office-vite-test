import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { AuctionRequestStatus, BroadcastActionType, BroadcastType } from '../constants';
import {
  ShowtimeAnchorPointItemSchema,
  ShowtimeAuctionBidSchema,
  ShowtimeChatChannelSchema,
  ShowtimeContentsItemGoodsSchema,
  ShowtimeContentsItemSchema,
  ShowtimeContentsSchema,
  ShowtimeLiveChannelSchema,
  ShowtimeManageItemAuctionGoodsSchema,
  ShowtimeRaffleEventDetailItemSchema,
  ShowtimeRaffleEventDetailSchema,
} from '../schemas';
import {
  ShowtimeAnchorPointRegistRequestParamItem,
  ShowtimeChangeUnitPriceParams,
  ShowtimeChatStatusNoticeMessageRegistRequestParamItem,
  ShowtimeContentsRequestParamItem,
  ShowtimeRaffleEventItemDrawParams,
} from '../types';

export interface RequestParams {
  page: string;
  size: string;
  contentsType: string;
  keyword: string;
  liveEndDate: number;
  liveStartDate: number;
  liveStatuses: Array<string>;
  openStatuses: Array<string>;
  searchField: string;
  showRoomIds: Array<string>;
  keywordIds: Array<number>;
}

/**
 * 쇼타임(라이브) 리스트 조회
 */
export const getShowtimeContents = ({
  page,
  size,
  ...params
}: RequestParams): Promise<PaginationResponse<ShowtimeContentsSchema>> => {
  return baseApiClient.post<PaginationResponse<ShowtimeContentsSchema>>(`/live/search?page=${page}&size=${size}`, {
    ...params,
  });
};

/**
 * 쇼타임(라이브) 등록
 */
export const registShowtimeContents = (params: ShowtimeContentsRequestParamItem): Promise<void> => {
  return baseApiClient.post<void>(`/live`, { ...params });
};

/**
 * 쇼타임(라이브) 아이템 조회
 */
export const getShowtimeContentsItem = (liveId: number): Promise<ShowtimeContentsItemSchema> => {
  return baseApiClient.get<ShowtimeContentsItemSchema>(`/live/${liveId}`);
};

/**
 * 쇼타임(라이브) 수정
 */
export const modifyShowtimeContents = (liveId: number, params: ShowtimeContentsRequestParamItem): Promise<void> => {
  return baseApiClient.put<void>(`/live/${liveId}`, { ...params });
};

/**
 * 쇼타임(라이브) 경매목록 조회
 */
export const getShowtimeAuctionItems = (liveId: number): Promise<Array<ShowtimeManageItemAuctionGoodsSchema>> => {
  return baseApiClient.get<Array<ShowtimeManageItemAuctionGoodsSchema>>(`/live/${liveId}/auction`);
};

/**
 * 쇼타임(라이브) 경매상품 상태변경
 */
export const updateShowtimeAuctionItem = (
  liveId: number,
  auctionId: number,
  requestStatus: AuctionRequestStatus,
): Promise<ShowtimeManageItemAuctionGoodsSchema> => {
  return baseApiClient.put<ShowtimeManageItemAuctionGoodsSchema>(`/live/${liveId}/auction/${auctionId}`, {
    action: requestStatus,
  });
};

/**
 * 쇼타임(라이브) 경매상품 입찰 단위 금액 변경
 */
export const updateShowtimeAuctionItemUnitPrice = (
  liveId: number,
  auctionId: number,
  params: ShowtimeChangeUnitPriceParams,
): Promise<ShowtimeManageItemAuctionGoodsSchema> => {
  return baseApiClient.put<ShowtimeManageItemAuctionGoodsSchema>(`/live/${liveId}/auction/${auctionId}`, {
    action: 'CHANGE_UNIT_PRICE',
    ...params,
  });
};

/**
 * 쇼타임(라이브) 채팅채널 조회
 */
export const getShowtimeChatChannel = (liveId: number): Promise<ShowtimeChatChannelSchema> => {
  return baseApiClient.get<ShowtimeChatChannelSchema>(`/live/${liveId}/chat-channel`);
};

/**
 * 쇼타임(라이브) 채팅채널 개설
 */
export const createShowtimeChatChannel = (liveId: number): Promise<void> => {
  return baseApiClient.post<void>(`/live/${liveId}/channel`);
};

/**
 * 쇼타임(라이브) 경매 낙찰정보 조회
 */
export const getShowtimeAuctionBid = (liveId: number, auctionId: number): Promise<ShowtimeAuctionBidSchema> => {
  return baseApiClient.get<ShowtimeAuctionBidSchema>(`/live/${liveId}/auction/${auctionId}/successful-bid`);
};

/**
 * 쇼타임(라이브) 라이브 채널 정보 조회
 */
export const getShowtimeLiveChannel = (liveId: number): Promise<ShowtimeLiveChannelSchema> => {
  return baseApiClient.get<ShowtimeLiveChannelSchema>(`/live/${liveId}/live-channel`);
};

/**
 * 쇼타임(라이브) 라이브 채널 정보 생성
 */
export const createShowtimeLiveChannel = (
  liveId: number,
  broadcastType: BroadcastType,
): Promise<ShowtimeLiveChannelSchema> => {
  return baseApiClient.post<ShowtimeLiveChannelSchema, object>(`/live/${liveId}/live-channel`, {
    broadcastType,
  });
};

/**
 * 쇼타임(라이브) 라이브 상태 변경
 */
export const changeShowtimeLiveChannel = (
  liveId: number,
  broadcastType: BroadcastType,
  action: BroadcastActionType,
): Promise<ShowtimeLiveChannelSchema> => {
  return baseApiClient.put<ShowtimeLiveChannelSchema, object>(`/live/${liveId}/live-channel`, {
    broadcastType,
    action,
  });
};

/**
 * 쇼타임(라이브) 라이브 채널 정보 polling
 */
export const getShowtimeLiveChannelPolling = (
  liveId: number,
  broadcastType: BroadcastType,
): Promise<ShowtimeLiveChannelSchema> => {
  return baseApiClient.put<ShowtimeLiveChannelSchema, object>(`/live/${liveId}/live-status`, {
    broadcastType,
  });
};

/**
 * 쇼타임(라이브) 연결된 상품조회
 */
export const getShowtimeLinkedGoods = (liveId: number): Promise<Array<ShowtimeContentsItemGoodsSchema>> => {
  return baseApiClient.get<Array<ShowtimeContentsItemGoodsSchema>>(`/live/${liveId}/goods`);
};

/**
 * 쇼타임(라이브) 앵커포인트 편성 조회
 */
export const getShowtimeAnchorPointItems = (
  liveId: number,
  active: boolean,
): Promise<Array<ShowtimeAnchorPointItemSchema>> => {
  return baseApiClient.get<Array<ShowtimeAnchorPointItemSchema>>(
    `/live/${liveId}/time-shift?active=${active ? 'true' : 'false'}`,
  );
};

/**
 * 쇼타임(라이브) 앵커포인트 편성 등록
 */
export const registShowtimeAnchorPoint = (
  liveId: number,
  params: ShowtimeAnchorPointRegistRequestParamItem,
): Promise<ShowtimeAnchorPointItemSchema> => {
  return baseApiClient.post<ShowtimeAnchorPointItemSchema>(`/live/${liveId}/time-shift`, { ...params });
};

/**
 * 쇼타임(라이브) 앵커포인트 편성 삭제
 */
export const deleteShowtimeAnchorPoint = (liveId: number, anchorPointId: number): Promise<void> => {
  return baseApiClient.delete<void>(`/live/${liveId}/time-shift/${anchorPointId}`);
};

/**
 * 쇼타임(라이브) 앵커포인트 즉시편성
 */
export const pairingShowtimeAnchorPoint = (liveId: number, anchorPointId: number): Promise<void> => {
  return baseApiClient.put<void>(`/live/${liveId}/time-shift/${anchorPointId}/programming`);
};

/**
 * 쇼타임(라이브) 앵커포인트 편성취소
 */
export const unpairingShowtimeAnchorPoint = (liveId: number, anchorPointId: number): Promise<void> => {
  return baseApiClient.delete<void>(`/live/${liveId}/time-shift/${anchorPointId}/programming`);
};

/**
 * 쇼타임(라이브) 앵커포인트 item 조회
 */
export const getShowtimeAnchorPointItem = (
  liveId: number,
  anchorPointId: number,
): Promise<ShowtimeAnchorPointItemSchema> => {
  return baseApiClient.get<ShowtimeAnchorPointItemSchema>(`/live/${liveId}/time-shift/${anchorPointId}`);
};

/**
 * 쇼타임(라이브) 앵커포인트 편성 수정
 */
export const modifyShowtimeAnchorPoint = (
  liveId: number,
  { anchorPointId, ...params }: ShowtimeAnchorPointRegistRequestParamItem,
): Promise<ShowtimeAnchorPointItemSchema> => {
  return baseApiClient.put<ShowtimeAnchorPointItemSchema>(`/live/${liveId}/time-shift/${anchorPointId}`, {
    ...params,
  });
};

/**
 * 쇼타임(라이브) 채팅채널 메세지 등록
 */
export const registShowtimeChatChannelMessage = (
  liveId: number,
  params: ShowtimeChatStatusNoticeMessageRegistRequestParamItem,
): Promise<ShowtimeAnchorPointItemSchema> => {
  return baseApiClient.post<ShowtimeAnchorPointItemSchema>(`/live/${liveId}/chat-channel/message`, {
    ...params,
  });
};

/**
 * 쇼타임(라이브) 추첨 이벤트 목록 조회
 */
export const getShowtimeRaffleItems = (liveId: number): Promise<ShowtimeRaffleEventDetailSchema> => {
  return baseApiClient.get<ShowtimeRaffleEventDetailSchema>(`/live/${liveId}/raffle-item`);
};

/**
 * 쇼타임(라이브) 추첨 이벤트 상세 조회
 */
export const getShowtimeRaffleItem = (
  liveId: number,
  raffleId: number,
): Promise<ShowtimeRaffleEventDetailItemSchema> => {
  return baseApiClient.get<ShowtimeRaffleEventDetailItemSchema>(`/live/${liveId}/raffle-item/${raffleId}`);
};

/**
 * 쇼타임(라이브) 추첨 이벤트 당첨자 결과 추출
 */
export const putShowtimeRaffleItemDraw = ({
  liveId,
  raffleId,
}: ShowtimeRaffleEventItemDrawParams): Promise<ShowtimeRaffleEventDetailItemSchema> => {
  return baseApiClient.put<ShowtimeRaffleEventDetailItemSchema>(`/live/${liveId}/raffle-item/${raffleId}/draw`);
};

/**
 * 쇼타임(라이브) 추첨 이벤트 당첨자 결과 발표
 */
export const putShowtimeRaffleItemNotifyDraw = ({
  liveId,
  raffleId,
}: ShowtimeRaffleEventItemDrawParams): Promise<ShowtimeRaffleEventDetailItemSchema> => {
  return baseApiClient.put<ShowtimeRaffleEventDetailItemSchema>(`/live/${liveId}/raffle-item/${raffleId}/notify-draw`);
};
