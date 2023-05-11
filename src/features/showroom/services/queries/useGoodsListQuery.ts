import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { getGoodsList, GetGoodsListParams } from '../../apis';
import { toGoodsListModel } from '../../models';

type UseGoodsListQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof getGoodsList>>, ErrorModel, ReturnType<typeof toGoodsListModel>>,
  'select'
>;

export const GoodsListQueryKeys = {
  all: [{ scope: 'showroom-goods' }] as const,
  lists: () => [{ ...GoodsListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: GetGoodsListParams) => [{ ...GoodsListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 전시상품 목록 조회 Query
 */
export const useGoodsListQuery = (params: GetGoodsListParams, options?: UseGoodsListQueryOptions) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof GoodsListQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getGoodsList(params);
  }, []);

  return useQuery(GoodsListQueryKeys.list(params), queryFn, {
    select: toGoodsListModel,
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
