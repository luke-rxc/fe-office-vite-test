import { QueryState } from '@hooks/useQueryState';
import { FeedMainLandingTypeOption, FeedSubLandingTypeOption } from '../constants';
import { MainFeedLandingType } from '../schemas';

export interface MainFeedQueryState extends QueryState {
  page: string;
  limit: string;
}

export interface DeleteFeedPublishingMutationParams {
  homeFeedId: number;
}

export interface PostFeedPublishMutationParams {
  homeFeedId: number;
}

export interface GetFeedQueryParams {
  homeFeedId: number;
}

export interface GetFeedLandingInfoQueryParams {
  landingType: MainFeedLandingType;
  referenceId: number;
}

export interface PostFeedMutationParams {
  description: string;
  landingType: MainFeedLandingType;
  mediaId: number;
  publishEndDate: number;
  publishStartDate: number;
  referenceId: number;
  sortNum: number;
  title: string;
  videoRepeatPoint?: number;
}

export interface PutFeedMutationParams extends PostFeedMutationParams {
  homeFeedId: number;
}

export interface DeleteFeedMutationParams {
  homeFeedId: number;
}

/**
 * form
 */
type FormDefaultValue = string;

export interface MainFeedDetailFormFields {
  landingType: {
    main: FeedMainLandingTypeOption;
    sub: FeedSubLandingTypeOption;
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
