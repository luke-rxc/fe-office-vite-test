import { OrderStep } from '@constants/order';
import { EnterDrawConditionType } from '@features/raffleEvent/constants';
import { GoodsSearchTagSchema } from '@schemas/GoodsSchema';
import { VatCodeType } from '@constants/goods';
import { KeywordComboItemSchema } from '.';
import {
  AnchorPointImageType,
  AuctionGoodsType,
  AuctionStatus,
  ContentsType,
  LiveStatus,
  OpenStatus,
  RehearsalStatus,
  StreamStatus,
  RaffleEventStatus,
} from '../constants';
import { ShowtimeContentsImage, ShowtimeContentsFileItem, TicketGoods, ShowtimeContentsMedia } from '../types';

/**
 * Showtime 콘텐츠 schema
 */
export interface ShowtimeContentsSchema {
  contentsType: ContentsType;
  goodsCount: number;
  goodsName: string;
  id: number;
  liveStartDate: number;
  liveStatus: LiveStatus;
  openStatus: OpenStatus;
  primaryImage: ShowtimeContentsImage;
  showRoomName: string;
  title: string;
}

/**
 * 쇼타임 콘텐츠 아이템 경매상품 schema
 */
export interface ShowtimeContentsItemAuctionGoodsSchema {
  bidUnitPrice: number;
  description: string;
  displayStartDate: number;
  goodsId: number;
  goodsFiles: Array<ShowtimeContentsFileItem>;
  id: number;
  name: string;
  primaryImage: ShowtimeContentsImage;
  startPrice: number;
  status: AuctionStatus;
  keywordList: Array<KeywordComboItemSchema>;
  /**
   * 경매 상한가
   */
  maximumBidPrice: number;
  itemType: AuctionGoodsType;
  ticket: TicketGoods | null;
  /**
   * 검색 태그
   */
  searchTags: GoodsSearchTagSchema[];
  /**
   * 부가세 코드 등록
   */
  vatCode: VatCodeType;
}

/**
 * 쇼타임 콘텐츠 아이템 상품 schema
 */
export interface ShowtimeContentsItemGoodsSchema {
  consumerPrice: {
    price: number;
  };
  id: number;
  name: string;
  price: {
    price: number;
  };
  primaryImage: ShowtimeContentsImage;
}

/**
 * 게스트 쇼룸 schema
 */
export interface GuestShowRoomSchema {
  id: number;
  name: string;
}

/**
 * 쇼타임 콘텐츠 아이템 schema
 */
export interface ShowtimeContentsItemSchema {
  auctionGoodsList: Array<ShowtimeContentsItemAuctionGoodsSchema>;
  contentsGoodsList: Array<ShowtimeContentsItemGoodsSchema>;
  contentsType: ContentsType;
  description: string;
  id: number;
  liveChannelId: number;
  liveChatId: number;
  livePlayTime: number;
  liveStartDate: string;
  openStatus: OpenStatus;
  primaryImage: ShowtimeContentsImage;
  showRoomId: number;
  showRoomName: string;
  title: string;
  guestShowRoomList: Array<GuestShowRoomSchema>;
  pushTitle: string;
  pushContents: string;
  pipMode: boolean;
}

/**
 * 쇼타임 운영 경매상품 schema
 */
export interface ShowtimeManageItemAuctionGoodsSchema {
  bidUnitPrice: number;
  goodsId: number;
  id: number;
  maximumBidPrice: number;
  name: string;
  primaryImage: ShowtimeContentsImage;
  startPrice: number;
  status: AuctionStatus;
  itemType: AuctionGoodsType;
  ticket: TicketGoods | null;
}

/**
 * 쇼타임 채팅 채널 schema
 */
export interface ShowtimeChatChannelSchema {
  applicationId: string;
  auctionChatUrl: string;
  interactionChatUrl: string;
  liveChatUrl: string;
  userId: string;
}

/**
 * 경매 낙찰자 정보 schema
 */
export interface ShowtimeAuctionBidderSchema {
  nickname: string;
  email: string;
  profileImage: ShowtimeContentsImage;
}

/**
 * 경매 낙찰 주문정보 schema
 */
export interface ShowtimeAuctionOrderSchema {
  id: number;
  paymentDate: number;
  orderStep: OrderStep;
}

/**
 * 경매 낙찰 정보 schema
 */
export interface ShowtimeAuctionBidSchema {
  id: number;
  goodsId: number;
  primaryImage: ShowtimeContentsImage;
  name: string;
  startPrice: number;
  bidUnitPrice: number;
  // 총 입찰 수
  biddingCount: number;
  // 입찰 참여자 수
  bidderCount: number;
  finalPrice: number;
  bidder: ShowtimeAuctionBidderSchema;
  order?: ShowtimeAuctionOrderSchema;
  maximumBidPrice: number;
  itemType?: AuctionGoodsType;
  ticket?: TicketGoods | null;
}

/**
 * 쇼타임 라이브채널 schema
 */
export interface ShowtimeLiveChannelSchema {
  liveStatus: LiveStatus;
  liveStreamStatus: StreamStatus;
  rehearsalStatus: RehearsalStatus;
  rehearsalStreamStatus: StreamStatus;
  liveRtmpUrl: string;
  liveStreamKey: string;
  liveStreamUrl: string;
  liveOriginalUrl: string;
  rehearsalRtmpUrl: string;
  rehearsalStreamKey: string;
  rehearsalStreamUrl: string;
  rehearsalOriginalUrl: string;
}

/**
 * 앵커포인트 편성 item schema
 */
export interface ShowtimeAnchorPointItemSchema {
  id: number;
  name: string;
  imageType: AnchorPointImageType | null;
  imageId: number | null;
  goodsId: number | null;
  image: ShowtimeContentsImage;
  seekingPositionSeconds: number;
  active: boolean;
}

/**
 * 래플 이벤트 item schema
 */
export interface ShowtimeRaffleEventItemSchema {
  enterDrawConditionType: EnterDrawConditionType;
  goodsImage: ShowtimeContentsImage;
  goodsMedia: ShowtimeContentsMedia;
  goodsMediaChromaKey: boolean;
  id: number;
  sortNum: number;
  status: RaffleEventStatus;
  winnerCount: number;
}

/**
 * 래플 이벤트 상세 item schema
 */
export interface ShowtimeRaffleEventDetailSchema {
  id: number;
  itemList: Array<ShowtimeRaffleEventItemSchema>;
  name: string;
}

/**
 * 래플 이벤트 detail item winner schema
 */
export interface ShowtimeRaffleEventDetailItemWinnerSchema {
  userId: number;
  nickname: string;
  email: string;
}

/**
 * 래플 이벤트 detail item schema
 */
export interface ShowtimeRaffleEventDetailItemSchema extends ShowtimeRaffleEventItemSchema {
  drawDate: number;
  enterDrawUserCount: number;
  winnerList: Array<ShowtimeRaffleEventDetailItemWinnerSchema>;
}
