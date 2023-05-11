import { OrderLogSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderLog } from '../apis';
import { OrderQueryKeys } from '../constants';
import { OrderLogModel, toOrderLogModel } from '../models';
import { OrderLogParams } from '../types';

/**
 * 주문 로그 조회 query
 */
export const useOrderLogQuery = (
  params: OrderLogParams,
  option: UseQueryOptions<OrderLogSchema, ErrorModel, OrderLogModel> = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderQueryKeys['log']>>) => {
    const [{ orderId, params }] = queryKey;
    return getOrderLog({ orderId, ...params });
  }, []);

  return useQuery(OrderQueryKeys.log(params), queryFn, {
    select: toOrderLogModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
