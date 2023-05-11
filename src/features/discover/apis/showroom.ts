import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { ShowroomComboListSchema, ShowroomSchema } from '../schemas';
import { ShowroomSearchParams } from '../types';

/**
 * 쇼룸 콤보리스트
 */
export const getShowroomCombo = (): Promise<ShowroomComboListSchema> => {
  return baseApiClient.get<ShowroomComboListSchema>(`/showroom/combo`);
};

/**
 * 쇼룸 리스트 조회
 */
export const getShowroomList = ({
  page,
  size,
  ...params
}: ShowroomSearchParams): Promise<PaginationResponse<ShowroomSchema>> => {
  return baseApiClient.post<PaginationResponse<ShowroomSchema>>(`/showroom/search?page=${page}&size=${size}`, params);
};
