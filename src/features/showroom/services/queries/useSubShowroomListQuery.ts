import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { toShowroomListModel } from '../../models';
import { getSubShowroomList, GetSubShowroomListParams } from '../../apis';

type UseSubShowroomListQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof getSubShowroomList>>, ErrorModel, ReturnType<typeof toShowroomListModel>>,
  'select'
>;

export const SubShowroomListQueryKeys = {
  all: [{ scope: 'sub-showroom-list' }] as const,
  lists: () => [{ ...SubShowroomListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: GetSubShowroomListParams) => [{ ...SubShowroomListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 소속쇼룸 목록 조회 Query
 */
export const useSubShowroomListQuery = (params: GetSubShowroomListParams, options?: UseSubShowroomListQueryOptions) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof SubShowroomListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getSubShowroomList(params);
    },
    [],
  );

  return useQuery(SubShowroomListQueryKeys.list(params), queryFn, {
    select: (data) => toShowroomListModel(data),
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
