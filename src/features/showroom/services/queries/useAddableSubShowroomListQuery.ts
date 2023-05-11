import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited, ArrayElement, ShowroomSearchFields } from '../../types';
import { SearchBaseSchema } from '../../schemas';
import { toShowroomListModel, toShowroomSearchParamsModel } from '../../models';
import { getAddableSubShowroomList, GetAddableSubShowroomListParams } from '../../apis';

type QueryParams = Pick<GetAddableSubShowroomListParams, 'showroomId'> & ShowroomSearchFields;

type QueryResponse = Awaited<ReturnType<typeof getAddableSubShowroomList>>;

type QueryReturnData = SearchBaseSchema<ArrayElement<ReturnType<typeof toShowroomListModel>>>;

type UseAddableSubShowroomListQueryOptions = Omit<
  UseQueryOptions<QueryResponse, ErrorModel, QueryReturnData>,
  'select'
>;

export const AddableShowroomListQueryKeys = {
  all: [{ scope: 'addable-sub-showroom' }] as const,
  lists: () => [{ ...AddableShowroomListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: QueryParams) => [{ ...AddableShowroomListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 등록가능 소속쇼룸 목록 조회 Query
 */
export const useAddableSubShowroomListQuery = (
  params: QueryParams,
  options?: UseAddableSubShowroomListQueryOptions,
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof AddableShowroomListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      const { showroomId, ...rest } = params;

      return getAddableSubShowroomList({ showroomId, ...toShowroomSearchParamsModel(rest) });
    },
    [],
  );

  return useQuery(AddableShowroomListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toShowroomListModel(data?.content),
    }),
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
