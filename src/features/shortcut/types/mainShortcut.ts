import { QueryState } from '@hooks/useQueryState';
import { MainShortcutTitleType, MainShortcutVideoPlayType } from '../constants';

/**
 * 숏컷 배너 query state
 */
export interface MainShortcutQueryState extends QueryState {
  page: string;
  limit: string;
}

/**
 * 숏컷 배너 list params
 */
export interface MainShortcutListParams {
  page: string;
  limit: string;
}

/**
 * 메인 랜딩정보 조회 params
 */
export interface MainShortcutLandingInfoQueryParams {
  landingType: string;
  referenceId: number;
}

/**
 * 숏컷 배너 form field
 */
export interface MainShortcutFormField {
  descriptionType: string;
  description: string;
  landingType: string;
  mediaId: string;
  mediaThumbnailId: string;
  publishEndDate: string;
  publishStartDate: string;
  referenceId: string;
  sortNum: string;
  landingSubType: string;
  title: string;
  titleImageSvgId: string;
  titleImageLottieId: string;
  titleType: string;
  videoRepeatType: string;
}

/**
 * 숏컷 배너 등록/수정 info params
 */
export interface MainShortcutInfoParams {
  description: string;
  openDescription: boolean;
  landingType: string;
  mediaId: number;
  mediaThumbnailId: number;
  publishEndDate: number;
  publishStartDate: number;
  referenceId: number;
  sortNum: number;
  title: string;
  titleImageId: number;
  titleType: MainShortcutTitleType;
  videoRepeatType: MainShortcutVideoPlayType;
  shortcutId?: string;
}
