import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { MainShortcutSchema, MainShortcutDetailSchema, MainShortcutLandingSchema } from '../schemas';
import { MainShortcutListParams, MainShortcutLandingInfoQueryParams, MainShortcutInfoParams } from '../types';

/**
 * 숏컷 배너 리스트 조회
 */
export const getMainShortcutPublishedList = (): Promise<Array<MainShortcutSchema>> => {
  return baseApiClient.get<Array<MainShortcutSchema>>('/home/shortcut/published');
};

/**
 * 숏컷 배너 리스트 조회
 */
export const getMainShortcutList = ({
  page,
  limit,
}: MainShortcutListParams): Promise<PaginationResponse<MainShortcutSchema>> => {
  return baseApiClient.get<PaginationResponse<MainShortcutSchema>>(`/home/shortcut?page=${page}&size=${limit}`);
};

/**
 * 숏컷 배너 편성 처리
 */
export const postMainShortcutPublish = (shortcutId: number): Promise<object> => {
  return baseApiClient.post<object>(`/home/shortcut/published/${shortcutId}`);
};

/**
 * 숏컷 배너 편성삭제 처리
 */
export const deleteMainShortcutUnpublish = (shortcutId: number): Promise<object> => {
  return baseApiClient.delete<object>(`/home/shortcut/published/${shortcutId}`);
};

/**
 * 숏컷 배너 랜딩 정보 조회
 */
export const getMainShortcutLandingInfo = ({ landingType, referenceId }: MainShortcutLandingInfoQueryParams) => {
  return baseApiClient.get<MainShortcutLandingSchema>(`/home/shortcut/landing/${landingType}/${referenceId}`);
};

/**
 * 숏컷 배너 등록
 */
export const postMainShortcutCreate = (params: MainShortcutInfoParams) => {
  return baseApiClient.post<object>(`/home/shortcut`, params);
};

/**
 * 숏컷 배너 상세 조회
 */
export const getMainShortcutDetail = (shortcutId: string): Promise<MainShortcutDetailSchema> => {
  return baseApiClient.get<MainShortcutDetailSchema>(`/home/shortcut/${shortcutId}`);
};

/**
 * 숏컷 배너 수정
 */
export const putMainShortcutCreate = ({ shortcutId, ...params }: MainShortcutInfoParams) => {
  return baseApiClient.put<object>(`/home/shortcut/${shortcutId}`, params);
};
