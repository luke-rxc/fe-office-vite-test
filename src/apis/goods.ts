import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { GoodsSchema } from '@schemas/GoodsSchema';

interface RequestParams {
  size: number;
  page: number;
  sort: string;
  name: string;
  goodsIds: Array<string>;
}

export const getGoods = ({ page, size, sort, ...params }: RequestParams): Promise<PaginationResponse<GoodsSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsSchema>>(
    `/goods/search?page=${page}&size=${size}&sort=${sort}`,
    params,
  );
};
