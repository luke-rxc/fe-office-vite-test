import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getRaffleEventList } from '../apis';
import { RaffleEventQueryKeys } from '../constants';
import { RaffleEventListItemModel, toRaffleEventListModel } from '../models/RaffleEventModel';
import { RaffleEventListItemSchema } from '../schemas';
import { RaffleEventListSearchParams } from '../types';

/**
 * 래플 이벤트 조회 query
 */
export const useRaffleEventListQuery = (
  params: RaffleEventListSearchParams,
  option: UseQueryOptions<
    PaginationResponse<RaffleEventListItemSchema>,
    ErrorModel,
    PaginationResponse<RaffleEventListItemModel>
  > = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof RaffleEventQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getRaffleEventList(params);
  }, []);

  return useQuery(RaffleEventQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toRaffleEventListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
