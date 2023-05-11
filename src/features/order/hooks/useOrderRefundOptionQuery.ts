import { OrderRequestRefundOptionSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderRefundOption } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { OrderRequestRefundOptionModel, toOrderRequestRefundOptionModel } from '../models';

/**
 * 환불신청가능 주문 option 조회 query
 */
export const useOrderRefundOptionQuery = (
  orderId: string,
  option: UseQueryOptions<OrderRequestRefundOptionSchema, ErrorModel, OrderRequestRefundOptionModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderRefundQueryKeys['refundOption']>>) => {
      const [{ orderId }] = queryKey;
      return getOrderRefundOption(orderId);
    },
    [],
  );

  return useQuery(OrderRefundQueryKeys.refundOption(orderId), queryFn, {
    select: toOrderRequestRefundOptionModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
