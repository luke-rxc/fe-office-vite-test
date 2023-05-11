import { baseApiClient } from '@utils/api';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { LiveRequestParams } from '../models';
import { LiveSchema } from '../schemas';

/**
 * 라이브 리스트 조회
 */
export const getLiveList = ({ page, size, ...params }: LiveRequestParams): Promise<PaginationResponse<LiveSchema>> => {
  return baseApiClient.post<PaginationResponse<LiveSchema>>(`/live/search?page=${page}&size=${size}`, {
    ...params,
  });
};
