import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { GoodsSchema, ContentsSchema, ShowroomSchema } from '../schemas';
import { DiscoverSectionCreatableTypeSchema, DiscoverSectionItemSchema } from '../schemas/DiscoverSectionSchema';
import {
  DiscoverSectionCreateParams,
  DiscoverSectionModifyParams,
  DiscoverSectionQueryState,
  DiscoverSectionTypeListParams,
} from '../types';

/**
 * 디스커버 섹션 리스트 조회
 */
export const getDiscoverSectionList = ({
  page,
  limit,
}: DiscoverSectionQueryState): Promise<PaginationResponse<DiscoverSectionItemSchema>> => {
  return baseApiClient.get<PaginationResponse<DiscoverSectionItemSchema>>(
    `/discover/section?page=${page}&size=${limit}`,
  );
};

/**
 * 디스커버 섹션 리스트 전체 조회
 */
export const getDiscoverSectionAllList = (): Promise<Array<DiscoverSectionItemSchema>> => {
  return baseApiClient.get<Array<DiscoverSectionItemSchema>>(`/discover/section/list`);
};

/**
 * 디스커버 섹션 삭제 처리
 */
export const deleteDiscoverSection = (sectionId: number): Promise<object> => {
  return baseApiClient.delete<object>(`/discover/section/${sectionId}`);
};

/**
 * 디스커버 섹션 등록 처리
 */
export const postDiscoverSection = (params: DiscoverSectionCreateParams): Promise<object> => {
  return baseApiClient.post<object>(`/discover/section`, params);
};

/**
 * 디스커버 섹션 상세 조회
 */
export const getDiscoverSection = (sectionId: string): Promise<DiscoverSectionItemSchema> => {
  return baseApiClient.get<DiscoverSectionItemSchema>(`/discover/section/${sectionId}`);
};

/**
 * 디스커버 섹션 수정 처리
 */
export const putDiscoverSection = ({ sectionId, ...params }: DiscoverSectionModifyParams): Promise<object> => {
  return baseApiClient.put<object>(`/discover/section/${sectionId}`, params);
};

/**
 * 디스커버 섹션 상품 리스트 조회
 */
export const postDiscoverSectionGoodsList = ({
  page,
  size,
  ...params
}: DiscoverSectionTypeListParams): Promise<PaginationResponse<GoodsSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsSchema>>(
    `/discover/section/search/goods?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 디스커버 섹션 콘텐츠 리스트 조회
 */
export const postDiscoverSectionContentsList = ({
  page,
  size,
  ...params
}: DiscoverSectionTypeListParams): Promise<PaginationResponse<ContentsSchema>> => {
  return baseApiClient.post<PaginationResponse<ContentsSchema>>(
    `/discover/section/search/story?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 디스커버 섹션 쇼룸 리스트 조회
 */
export const postDiscoverSectionShowroomList = ({
  page,
  size,
  ...params
}: DiscoverSectionTypeListParams): Promise<PaginationResponse<ShowroomSchema>> => {
  return baseApiClient.post<PaginationResponse<ShowroomSchema>>(
    `/discover/section/search/showroom?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 디스커버 섹션 생성가능 타입 조회
 */
export const getDiscoverSectionCreatableType = (): Promise<Array<DiscoverSectionCreatableTypeSchema>> => {
  return baseApiClient.get<Array<DiscoverSectionCreatableTypeSchema>>(`/discover/section/creatable-type`);
};
