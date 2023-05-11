import { baseApiClient } from '@utils/api';
import {
  BannerLandingInfoSchema,
  MainBannerDetailSchema,
  MainBannerResponse,
  MainBannerSchema,
  UnpublishedMainBannerResponse,
} from '../schemas';
import {
  DeleteBannerMutationParams,
  DeleteBannerPublishingMutationParams,
  GetBannerQueryParams,
  GetBannerLandingInfoQueryParams,
  MainBannerQueryState,
  PostBannerMutationParams,
  PostBannerPublishMutationParams,
  PutBannerMutationParams,
} from '../types';

/**
 * 편성 홈배너 조회
 */
export const getBannerList = () => {
  return baseApiClient.get<MainBannerResponse>('/home/banner/published');
};

/**
 * 미편성 홈배너 조회
 */
export const getUnpublishedBannerList = ({ page, limit }: MainBannerQueryState) => {
  return baseApiClient.get<UnpublishedMainBannerResponse>(`/home/banner?page=${page}&size=${limit}`);
};

/**
 * 홈배너 편성 제거
 */
export const deleteBannerPublishingStatus = ({ homeBannerId }: DeleteBannerPublishingMutationParams) => {
  return baseApiClient.delete<MainBannerSchema>(`/home/banner/published/${homeBannerId}`);
};

/**
 * 홈배너 편성 추가
 */
export const postBannerToPublish = ({ homeBannerId }: PostBannerPublishMutationParams) => {
  return baseApiClient.post<MainBannerSchema>(`/home/banner/published/${homeBannerId}`);
};

/**
 * 홈배너 상세 조회
 */
export const getBanner = ({ homeBannerId }: GetBannerQueryParams) => {
  return baseApiClient.get<MainBannerDetailSchema>(`/home/banner/${homeBannerId}`);
};

/**
 * 랜딩 정보 조회
 */
export const getBannerLandingInfo = ({ landingType, referenceId }: GetBannerLandingInfoQueryParams) => {
  return baseApiClient.get<BannerLandingInfoSchema>(`/home/banner/landing/${landingType}/${referenceId}`);
};

/**
 * 홈배너 등록
 */
export const postBanner = (params: PostBannerMutationParams) => {
  return baseApiClient.post<MainBannerDetailSchema>('/home/banner', params);
};

/**
 * 홈배너 수정
 */
export const putBanner = ({ homeBannerId, ...params }: PutBannerMutationParams) => {
  return baseApiClient.put<MainBannerDetailSchema>(`/home/banner/${homeBannerId}`, params);
};

/**
 * 홈배너 삭제
 */
export const deleteBanner = ({ homeBannerId }: DeleteBannerMutationParams) => {
  return baseApiClient.delete<void>(`/home/banner/${homeBannerId}`);
};
