import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getShowtimeRaffleItems } from '../apis';
import { ShowtimeRaffleEventQueryKeys } from '../constants';
import { ShowtimeRaffleEventDetailModel, toShowtimeRaffleEventDetailModel } from '../models';
import { ShowtimeRaffleEventDetailSchema } from '../schemas';

/**
 * 라이브(쇼타임) 래플 이벤트 목록 조회 query
 */
export const useShowtimeRaffleEventListQuery = (
  showTimeId: number,
  option: UseQueryOptions<ShowtimeRaffleEventDetailSchema, ErrorModel, ShowtimeRaffleEventDetailModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof ShowtimeRaffleEventQueryKeys['list']>>) => {
      const [{ showTimeId }] = queryKey;
      return getShowtimeRaffleItems(showTimeId);
    },
    [],
  );

  return useQuery(ShowtimeRaffleEventQueryKeys.list(showTimeId), queryFn, {
    select: (data) => {
      if (!data) {
        return null;
      }
      return toShowtimeRaffleEventDetailModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
