import { PublishStatus } from '../constants';
import { ImageSchema } from './CommonSchema';
import { GoodsSchema } from './GoodsSchema';

/**
 * 디스커버 배너 schema
 */
export interface DiscoverBannerSchema {
  id: number;
  title: string;
  subTitle: string;
  landingType: string;
  landingRefId: number;
  publishStartDate: number;
  publishEndDate: number;
  primaryImageFile: ImageSchema;
  status: PublishStatus;
  isPublished: boolean;
  published?: boolean;
}

/**
 * 디스커버 배너 랜딩정보 schema
 */
export interface DiscoverBannerLandingInfoSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: string;
}

/**
 * 디스커버 배너 상세 schema
 */
export interface DiscoverBannerDetailSchema {
  id: number;
  title: string;
  subTitle: string;
  landingType: string;
  landingRefId: number;
  publishStartDate: number;
  publishEndDate: number;
  primaryImageFile: ImageSchema;
  isPublished: boolean;
  items: Array<GoodsSchema>;
}
