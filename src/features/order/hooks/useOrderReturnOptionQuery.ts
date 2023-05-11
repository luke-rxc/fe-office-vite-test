import { OrderRequestReturnOptionSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderReturnOption } from '../apis';
import { OrderReturnQueryKeys } from '../constants';
import { OrderRequestReturnOptionModel, toOrderRequestReturnOptionModel } from '../models';

/**
 * 반품신청가능 주문 option 조회 query
 */
export const useOrderReturnOptionQuery = (
  orderId: string,
  option: UseQueryOptions<OrderRequestReturnOptionSchema, ErrorModel, OrderRequestReturnOptionModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderReturnQueryKeys['returnOption']>>) => {
      const [{ orderId }] = queryKey;
      return getOrderReturnOption(orderId);
    },
    [],
  );

  return useQuery(OrderReturnQueryKeys.returnOption(orderId), queryFn, {
    select: toOrderRequestReturnOptionModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
