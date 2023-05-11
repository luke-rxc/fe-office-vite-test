import { LandingType, LiveContentsType, ScheduleBannerType, ScheduleType } from '../constants';

/**
 * 컨텐츠 이미지
 */
export interface ContentsImageSchema {
  extension: string;
  height: number;
  id: number;
  path: string;
  width: number;
  originalFileName: string;
}

/**
 * 쇼룸 schema
 */
export interface ShowRoomSchema {
  id: number;
  name: string;
  primaryImage: ContentsImageSchema;
}

/**
 * 라이브 컨텐츠 schema
 */
export interface LiveContentsSchema {
  id: number;
  contentsType: LiveContentsType;
  title: string;
}

/**
 * 편성표 item schema
 */
export interface ScheduleTableItemSchema {
  id: number;
  scheduleDate: number;
  type: ScheduleType;
  bannerType: ScheduleBannerType;
  scheduled: boolean;
  showRoom: ShowRoomSchema;
  liveContents: LiveContentsSchema;
}

export interface GuestShowRoomSchema {
  id: number;
  name: string;
}

/**
 * 라이브 콘텐츠 상세 schema
 */
export interface LiveContentsDetailSchema {
  id: number;
  contentsType: LiveContentsType;
  title: string;
  liveStartDate: number;
  showRoom: ShowRoomSchema;
  guestShowRoomList: Array<GuestShowRoomSchema>;
}

/**
 * 편성표 상세 배너상품 schema
 */
export interface ScheduleTableDetailBannerGoodsSchema {
  id: number;
  name: string;
  consumerPrice: { price: number };
  price: { price: number };
  primaryImage: ContentsImageSchema;
}

/**
 * 편성표 상세 item schema
 */
export interface ScheduleTableDetailItemSchema {
  id: number;
  type: ScheduleType;
  liveContents: LiveContentsDetailSchema;
  title: string | null;
  subtitle: string | null;
  benefits: string | null;
  bgImage: ContentsImageSchema | null;
  chromakeyImage: ContentsImageSchema | null;
  bgColor: string | null;
  landingType: LandingType;
  landingStoryId: number | null;
  bannerType: ScheduleBannerType;
  bannerButtonText: string | null;
  bannerImage1: ContentsImageSchema | null;
  bannerImage2: ContentsImageSchema | null;
  bannerImage3: ContentsImageSchema | null;
  bannerGoodsList: Array<ScheduleTableDetailBannerGoodsSchema>;
  bannerScheme: string | null;
  scheduled: boolean;
  followerCount: number;
}
