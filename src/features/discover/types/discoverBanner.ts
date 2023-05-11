import { QueryState } from '@hooks/useQueryState';

/**
 * 디스커버 배너 query state
 */
export interface DiscoverBannerQueryState extends QueryState {
  page: string;
  limit: string;
}

/**
 * 디스커버 배너 list params
 */
export interface DiscoverBannerListParams {
  page: string;
  limit: string;
}

/**
 * 디스커버 배너 form field
 */
export interface DiscoverBannerFormField {
  landingRefId: string;
  landingType: string;
  landingSubType: string;
  primaryImageFileId: string;
  publishEndDate: string;
  publishStartDate: string;
  subTitle: string;
  title: string;
}

/**
 * 디스커버 랜딩정보 조회 params
 */
export interface DiscoverBannerLandingInfoQueryParams {
  landingType: string;
  referenceId: number;
}

/**
 * 디스커버 등록/수정 info params
 */
export interface DiscoverBannerInfoParams {
  landingRefId: number;
  landingType: string;
  primaryImageFileId: number;
  publishEndDate: number;
  publishStartDate: number;
  subTitle: string;
  title: string;
  bannerId?: string;
  items: Array<{
    goodsId: number;
    sortNum: number;
  }>;
}
