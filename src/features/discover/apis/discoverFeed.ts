import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';
import { DiscoverFeedDisplayGroupInfoParams, DiscoverFeedDisplayGroupParams } from '../types';

/**
 * 디스커버 피드 전시그룹 리스트 조회
 */
export const getDiscoverFeedDisplayGroupList = ({
  page,
  size,
}: DiscoverFeedDisplayGroupParams): Promise<PaginationResponse<DiscoverFeedDisplayGroupSchema>> => {
  return baseApiClient.get<PaginationResponse<DiscoverFeedDisplayGroupSchema>>(
    `/discover/feed?page=${page}&size=${size}`,
  );
};

/**
 * 디스커버 피드 전시그룹(중지) 리스트 조회
 */
export const getDiscoverFeedStopDisplayGroupList = ({
  page,
  size,
}: DiscoverFeedDisplayGroupParams): Promise<PaginationResponse<DiscoverFeedDisplayGroupSchema>> => {
  return baseApiClient.get<PaginationResponse<DiscoverFeedDisplayGroupSchema>>(
    `/discover/feed/stop?page=${page}&size=${size}`,
  );
};

/**
 * 디스커버 피드 기등록된 전시그룹 리스트 조회
 */
export const getDiscoverFeedRegisteredDisplayGroupList = (): Promise<Array<DiscoverFeedDisplayGroupSchema>> => {
  return baseApiClient.get<Array<DiscoverFeedDisplayGroupSchema>>(`/discover/feed/list`);
};

/**
 * 디스커버 피드 전시그룹 등록
 */
export const postDiscoverFeedDisplayGroup = (params: DiscoverFeedDisplayGroupInfoParams): Promise<object> => {
  return baseApiClient.post<object>(`/discover/feed`, params);
};

/**
 * 디스커버 피드 전시그룹 조회
 */
export const getDiscoverFeedDisplayGroup = (feedId: string): Promise<DiscoverFeedDisplayGroupSchema> => {
  return baseApiClient.get<DiscoverFeedDisplayGroupSchema>(`/discover/feed/${feedId}`);
};

/**
 * 디스커버 피드 전시그룹 수정
 */
export const putDiscoverFeedDisplayGroup = ({
  feedId,
  ...params
}: DiscoverFeedDisplayGroupInfoParams): Promise<DiscoverFeedDisplayGroupSchema> => {
  return baseApiClient.put<DiscoverFeedDisplayGroupSchema>(`/discover/feed/${feedId}`, params);
};

/**
 * 디스커버 피드 전시그룹 삭제
 */
export const deleteDiscoverFeedDisplayGroup = (feedId: string): Promise<string> => {
  return baseApiClient.delete<string>(`/discover/feed/${feedId}`);
};
