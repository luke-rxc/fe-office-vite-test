import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getRaffleEventDetail } from '../apis';
import { RaffleEventQueryKeys } from '../constants';
import { RaffleEventDetailItemModel, toRaffleEventDetailItemModel } from '../models';
import { RaffleEventDetailItemSchema } from '../schemas';

/**
 * 래플 이벤트 상세 조회 query
 */
export const useRaffleEventDetailQuery = (
  raffleId: number,
  option: UseQueryOptions<RaffleEventDetailItemSchema, ErrorModel, RaffleEventDetailItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof RaffleEventQueryKeys['detail']>>) => {
      const [{ raffleId }] = queryKey;
      return getRaffleEventDetail(raffleId);
    },
    [],
  );

  return useQuery(RaffleEventQueryKeys.detail(raffleId), queryFn, {
    select: (data) => {
      return toRaffleEventDetailItemModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
