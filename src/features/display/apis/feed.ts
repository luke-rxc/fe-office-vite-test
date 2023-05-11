import { baseApiClient } from '@utils/api';
import {
  MainFeedDetailSchema,
  MainFeedLandingInfoSchema,
  MainFeedResponse,
  MainFeedSchema,
  UnpublishedMainFeedResponse,
} from '../schemas';
import {
  DeleteFeedMutationParams,
  DeleteFeedPublishingMutationParams,
  GetFeedLandingInfoQueryParams,
  GetFeedQueryParams,
  MainFeedQueryState,
  PostFeedMutationParams,
  PostFeedPublishMutationParams,
  PutFeedMutationParams,
} from '../types';

/**
 * 편성 홈피드 조회
 */
export const getFeedList = () => {
  return baseApiClient.get<MainFeedResponse>('/home/feed/published');
};

/**
 * 미편성 홈피드 조회
 */
export const getUnpublishedFeedList = ({ page, limit }: MainFeedQueryState) => {
  return baseApiClient.get<UnpublishedMainFeedResponse>(`/home/feed?page=${page}&size=${limit}`);
};

/**
 * 홈피드 편성 제거
 */
export const deleteFeedPublishingStatus = ({ homeFeedId }: DeleteFeedPublishingMutationParams) => {
  return baseApiClient.delete<MainFeedSchema>(`/home/feed/published/${homeFeedId}`);
};

/**
 * 홈피드 편성 추가
 */
export const postFeedToPublish = ({ homeFeedId }: PostFeedPublishMutationParams) => {
  return baseApiClient.post<MainFeedSchema>(`/home/feed/published/${homeFeedId}`);
};

/**
 * 홈피드 상세 조회
 */
export const getFeed = ({ homeFeedId }: GetFeedQueryParams) => {
  return baseApiClient.get<MainFeedDetailSchema>(`/home/feed/${homeFeedId}`);
};

/**
 * 랜딩 정보 조회
 */
export const getFeedLandingInfo = ({ landingType, referenceId }: GetFeedLandingInfoQueryParams) => {
  return baseApiClient.get<MainFeedLandingInfoSchema>(`/home/feed/landing/${landingType}/${referenceId}`);
};

/**
 * 홈피드 등록
 */
export const postFeed = (params: PostFeedMutationParams) => {
  return baseApiClient.post<MainFeedDetailSchema>('/home/feed', params);
};

/**
 * 홈피드 수정
 */
export const putFeed = ({ homeFeedId, ...params }: PutFeedMutationParams) => {
  return baseApiClient.put<MainFeedDetailSchema>(`/home/feed/${homeFeedId}`, params);
};

/**
 * 홈피드 삭제
 */
export const deleteFeed = ({ homeFeedId }: DeleteFeedMutationParams) => {
  return baseApiClient.delete<void>(`/home/feed/${homeFeedId}`);
};
