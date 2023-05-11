import { MainShortcutLandingType, MainShortcutTitleType, MainShortcutVideoPlayType, PublishStatus } from '../constants';
import { ImageSchema, MediaSchema } from './CommonSchema';

/**
 * 숏컷 배너 랜딩정보 schema
 */
export interface MainShortcutLandingSchema {
  name: string;
  referenceId: number;
  showRoomName: string;
  type: MainShortcutLandingType;
}

/**
 * 숏컷 배너 schema
 */
export interface MainShortcutSchema {
  id: number;
  landingInfo: MainShortcutLandingSchema;
  media: MediaSchema;
  publishEndDate: string;
  publishStartDate: string;
  sortNum: number;
  status: PublishStatus;
  title: string;
}

/**
 * 숏컷 배너 상세 schema
 */
export interface MainShortcutDetailSchema {
  description: string;
  id: number;
  landingInfo: MainShortcutLandingSchema;
  media: MediaSchema;
  mediaThumbnail: ImageSchema;
  openDescription: boolean;
  publishEndDate: string;
  publishStartDate: string;
  sortNum: number;
  title: string;
  titleImage: ImageSchema;
  titleType: MainShortcutTitleType;
  videoRepeatPoint: number;
  videoRepeatType: MainShortcutVideoPlayType;
}
