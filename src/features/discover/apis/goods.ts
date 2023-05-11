import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { GoodsSchema } from '../schemas';
import { GoodsSearchParams } from '../types';

export const getGoodsList = ({
  page,
  size,
  ...params
}: GoodsSearchParams): Promise<PaginationResponse<GoodsSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsSchema>>(`/goods/simple/search?page=${page}&size=${size}`, params);
};
