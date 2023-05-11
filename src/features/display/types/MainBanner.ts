import { QueryState } from '@hooks/useQueryState';
import { BannerMainLandingTypeOption, BannerSubLandingTypeOption } from '../constants';
import { MainBannerLandingType } from '../schemas';

export interface MainBannerQueryState extends QueryState {
  page: string;
  limit: string;
}

export interface DeleteBannerPublishingMutationParams {
  homeBannerId: number;
}

export interface PostBannerPublishMutationParams {
  homeBannerId: number;
}

export interface GetBannerQueryParams {
  homeBannerId: number;
}

export interface GetBannerLandingInfoQueryParams {
  landingType: MainBannerLandingType;
  referenceId: number;
}

export interface PostBannerMutationParams {
  description: string;
  landingType: MainBannerLandingType;
  mediaId: number;
  publishEndDate: number;
  publishStartDate: number;
  referenceId: number;
  sortNum: number;
  title: string;
  videoRepeatPoint?: number;
}

export interface PutBannerMutationParams extends PostBannerMutationParams {
  homeBannerId: number;
}

export interface DeleteBannerMutationParams {
  homeBannerId: number;
}

/**
 * form
 */
type FormDefaultValue = string;

export interface MainBannerDetailFormFields {
  landingType: {
    main: BannerMainLandingTypeOption;
    sub: BannerSubLandingTypeOption;
  };
  landingId: number | FormDefaultValue;
  title: string;
  description: string;
  publishStartDate: number | FormDefaultValue;
  publishEndDate: number | FormDefaultValue;
  sortNum: number | FormDefaultValue;
  mediaId: number | FormDefaultValue;
  videoRepeatPoint?: number | FormDefaultValue;
}
