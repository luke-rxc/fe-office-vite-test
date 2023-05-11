import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { toShowroomInfoModel } from '../../models';
import { getShowroomInfo, GetShowroomInfoParams } from '../../apis';

type UseShowroomQueryOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getShowroomInfo>>,
    ErrorModel,
    Awaited<ReturnType<typeof toShowroomInfoModel>>
  >,
  'select'
>;

export const ShowroomInfoQueryKeys = {
  all: [{ scope: 'showroom' }] as const,
  item: (params: GetShowroomInfoParams) => [{ ...ShowroomInfoQueryKeys.all[0], params }] as const,
};

/**
 * 쇼룸 정보 조회 Query
 */
export const useShowroomInfoQuery = (params: GetShowroomInfoParams, options?: UseShowroomQueryOptions) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof ShowroomInfoQueryKeys['item']>>) => {
      const [{ params }] = queryKey;
      return getShowroomInfo(params);
    },
    [],
  );

  return useQuery(ShowroomInfoQueryKeys.item(params), queryFn, {
    select: toShowroomInfoModel,
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
