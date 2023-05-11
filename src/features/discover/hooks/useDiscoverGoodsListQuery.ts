import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { postDiscoverSectionGoodsList } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { GoodsModel, toGoodsListModel } from '../models';
import { GoodsSchema } from '../schemas';
import { DiscoverSectionTypeListParams } from '../types';

/**
 * 디스커버 상품 리스트 조회 query
 */
export const useDiscoverGoodsListQuery = (
  params: DiscoverSectionTypeListParams,
  option: UseQueryOptions<PaginationResponse<GoodsSchema>, ErrorModel, PaginationResponse<GoodsModel>> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverCommonQueryKeys['goodsList']>>) => {
      const [{ params }] = queryKey;
      return postDiscoverSectionGoodsList(params);
    },
    [],
  );

  return useQuery(DiscoverCommonQueryKeys.goodsList(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toGoodsListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
