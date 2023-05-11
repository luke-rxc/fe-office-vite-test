import { baseApiClient } from '@utils/api';
import { ScheduleTableDetailItemSchema, ScheduleTableItemSchema } from '../schemas';
import { ScheduleModifyParams, ScheduleSearchParams } from '../types';

/**
 * 편성표 검색
 */
export const getScheduleItems = (params: ScheduleSearchParams): Promise<Array<ScheduleTableItemSchema>> => {
  return baseApiClient.post<Array<ScheduleTableItemSchema>>('/contents-schedule/search', params);
};

/**
 * 편성표 상세조회
 */
export const getScheduleTableItem = (id: number): Promise<ScheduleTableDetailItemSchema> => {
  return baseApiClient.get<ScheduleTableDetailItemSchema>(`/contents-schedule/${id}`);
};

/**
 * 편성표 수정
 */
export const putScheduleTableItem = (params: ScheduleModifyParams): Promise<ScheduleTableDetailItemSchema> => {
  return baseApiClient.put<ScheduleTableDetailItemSchema>(`/contents-schedule/${params.id}`, params);
};
