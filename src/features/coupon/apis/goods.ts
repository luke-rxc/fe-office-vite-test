import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { GoodsSchema } from '../schemas';

interface RequestParams {
  size: number;
  page: number;
  name: string;
  goodsIds: Array<string>;
}

export const getGoods = ({ page, size, ...params }: RequestParams): Promise<PaginationResponse<GoodsSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsSchema>>(`/goods/search?page=${page}&size=${size}`, params);
};
