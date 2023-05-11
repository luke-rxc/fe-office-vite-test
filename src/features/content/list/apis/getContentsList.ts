import { baseApiClient } from '@utils/api';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ContentListSchema } from '../schemas';
import { RequestParams } from '../models';

/**
 * 콘텐츠 리스트 조회
 */
export const getContentList = (params: RequestParams): Promise<PaginationResponse<ContentListSchema>> => {
  const { page, size, ...param } = params;
  return baseApiClient.post<PaginationResponse<ContentListSchema>>(`/story/search?page=${page}&size=${size}`, {
    ...param,
  });
};
