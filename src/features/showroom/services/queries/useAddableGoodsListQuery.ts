import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited, ArrayElement, GoodsSearchFields } from '../../types';
import { SearchBaseSchema } from '../../schemas';
import { toGoodsSearchListModel, toGoodsSearchParamsModel } from '../../models';
import { getAddableGoodsList, GetAddableGoodsListParams } from '../../apis';

type QueryParams = Pick<GetAddableGoodsListParams, 'showroomId' | 'sectionId'> & GoodsSearchFields;

type QueryResponse = Awaited<ReturnType<typeof getAddableGoodsList>>;

type QueryReturnData = SearchBaseSchema<ArrayElement<ReturnType<typeof toGoodsSearchListModel>>>;

type UseAddableGoodsListQueryOptions = Omit<UseQueryOptions<QueryResponse, ErrorModel, QueryReturnData>, 'select'>;

export const AddableGoodsListQueryKeys = {
  all: [{ scope: 'addable-showroom-goods' }] as const,
  lists: () => [{ ...AddableGoodsListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: QueryParams) => [{ ...AddableGoodsListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 등록가능 소속쇼룸 목록 조회 Query
 */
export const useAddableGoodsListQuery = (params: QueryParams, options?: UseAddableGoodsListQueryOptions) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof AddableGoodsListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      const { showroomId, sectionId, exceptGoodsIds, ...rest } = params;

      return getAddableGoodsList({ showroomId, sectionId, exceptGoodsIds, ...toGoodsSearchParamsModel(rest) });
    },
    [],
  );

  return useQuery(AddableGoodsListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toGoodsSearchListModel(data?.content),
    }),
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
