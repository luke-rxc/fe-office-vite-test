import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { ShowroomSearchFields, Awaited, ArrayElement } from '../../types';
import { SearchBaseSchema } from '../../schemas';
import { toShowroomSearchParamsModel, toShowroomListModel } from '../../models';
import { getShowroomList } from '../../apis';

type UseShowroomListQueryOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getShowroomList>>,
    ErrorModel,
    SearchBaseSchema<ArrayElement<ReturnType<typeof toShowroomListModel>>>
  >,
  'select'
>;

export const ShowroomListQueryKeys = {
  all: [{ scope: 'showroom-list' }] as const,
  lists: () => [{ ...ShowroomListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: ShowroomSearchFields) => [{ ...ShowroomListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 쇼룸 목록 조회 Query
 */
export const useShowroomListQuery = (params: ShowroomSearchFields, options?: UseShowroomListQueryOptions) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof ShowroomListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getShowroomList(toShowroomSearchParamsModel(params));
    },
    [],
  );

  return useQuery(ShowroomListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toShowroomListModel(data?.content),
    }),
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
