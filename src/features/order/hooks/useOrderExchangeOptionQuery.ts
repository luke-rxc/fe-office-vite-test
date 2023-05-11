import { OrderRequestExchangeOptionSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderExchangeOption } from '../apis';
import { OrderExchangeQueryKeys } from '../constants';
import { OrderRequestExchangeOptionModel, toOrderRequestExchangeOptionModel } from '../models';

/**
 * 교환가능 주문 option 조회 query
 */
export const useOrderExchangeOptionQuery = (
  orderId: string,
  option: UseQueryOptions<OrderRequestExchangeOptionSchema, ErrorModel, OrderRequestExchangeOptionModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderExchangeQueryKeys['exchangeOption']>>) => {
      const [{ orderId }] = queryKey;
      return getOrderExchangeOption(orderId);
    },
    [],
  );

  return useQuery(OrderExchangeQueryKeys.exchangeOption(orderId), queryFn, {
    select: toOrderRequestExchangeOptionModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
