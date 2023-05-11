import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getShowtimeRaffleItem } from '../apis';
import { ShowtimeRaffleEventQueryKeys } from '../constants';
import { ShowtimeRaffleEventDetailItemModel, toShowtimeRaffleEventDetailItemModel } from '../models';
import { ShowtimeRaffleEventDetailItemSchema } from '../schemas';

/**
 * 라이브(쇼타임) 래플 이벤트 상세 조회 query
 */
export const useShowtimeRaffleEventDetailQuery = (
  showTimeId: number,
  raffleId: number,
  option: UseQueryOptions<ShowtimeRaffleEventDetailItemSchema, ErrorModel, ShowtimeRaffleEventDetailItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof ShowtimeRaffleEventQueryKeys['detail']>>) => {
      const [{ showTimeId, raffleId }] = queryKey;
      return getShowtimeRaffleItem(showTimeId, raffleId);
    },
    [],
  );

  return useQuery(ShowtimeRaffleEventQueryKeys.detail(showTimeId, raffleId), queryFn, {
    select: (data) => {
      return toShowtimeRaffleEventDetailItemModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
