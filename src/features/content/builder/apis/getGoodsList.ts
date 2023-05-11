import { baseApiClient } from '@utils/api';
import { GoodsRequestParams } from '../models';
import { GoodsSearchSchema } from '../schemas';

/**
 * 상품 리스트 조회
 */
export const getGoodsList = (contentId, params: GoodsRequestParams): Promise<GoodsSearchSchema> => {
  const { page, size, ...param } = params;
  return baseApiClient.post<GoodsSearchSchema>(`/v1/story/${contentId}/goods?page=${page}&size=${size}`, {
    ...param,
  });
};
