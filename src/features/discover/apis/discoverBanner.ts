import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { DiscoverBannerDetailSchema, DiscoverBannerLandingInfoSchema, DiscoverBannerSchema } from '../schemas';
import { DiscoverBannerLandingInfoQueryParams, DiscoverBannerInfoParams, DiscoverBannerListParams } from '../types';

/**
 * 디스커버 편성 배너 리스트 조회
 */
export const getDiscoverBannerPublishedList = (): Promise<Array<DiscoverBannerSchema>> => {
  return baseApiClient.get<Array<DiscoverBannerSchema>>('/discover/banner/published');
};

/**
 * 디스커버 배너 리스트 조회
 */
export const getDiscoverBannerList = ({
  page,
  limit,
}: DiscoverBannerListParams): Promise<PaginationResponse<DiscoverBannerSchema>> => {
  return baseApiClient.get<PaginationResponse<DiscoverBannerSchema>>(`/discover/banner?page=${page}&size=${limit}`);
};

/**
 * 디스커버 배너 편성 처리
 */
export const postDiscoverBannerPublish = (bannerId: number): Promise<object> => {
  return baseApiClient.post<object>(`/discover/banner/publish/${bannerId}`);
};

/**
 * 디스커버 배너 편성삭제 처리
 */
export const deleteDiscoverBannerUnpublish = (bannerId: number): Promise<object> => {
  return baseApiClient.delete<object>(`/discover/banner/publish/${bannerId}`);
};

/**
 * 디스커버 배너 랜딩 정보 조회
 */
export const getDiscoverBannerLandingInfo = ({ landingType, referenceId }: DiscoverBannerLandingInfoQueryParams) => {
  return baseApiClient.get<DiscoverBannerLandingInfoSchema>(`/home/banner/landing/${landingType}/${referenceId}`);
};

/**
 * 디스커버 배너 등록
 */
export const postDiscoverBannerCreate = (params: DiscoverBannerInfoParams) => {
  return baseApiClient.post<object>(`/discover/banner`, params);
};

/**
 * 디스커버 배너 상세 조회
 */
export const getDiscoverBannerDetail = (bannerId: string): Promise<DiscoverBannerDetailSchema> => {
  return baseApiClient.get<DiscoverBannerDetailSchema>(`/discover/banner/${bannerId}`);
};

/**
 * 디스커버 배너 수정
 */
export const putDiscoverBannerCreate = ({ bannerId, ...params }: DiscoverBannerInfoParams) => {
  return baseApiClient.put<object>(`/discover/banner/${bannerId}`, params);
};
