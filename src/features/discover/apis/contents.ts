import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { ContentsSchema } from '../schemas';
import { ContentsSearchParams } from '../types';

/**
 * 콘텐츠 리스트 조회
 */
export const getContentsList = ({
  page,
  size,
  ...params
}: ContentsSearchParams): Promise<PaginationResponse<ContentsSchema>> => {
  return baseApiClient.post<PaginationResponse<ContentsSchema>>(`/story/search?page=${page}&size=${size}`, params);
};
