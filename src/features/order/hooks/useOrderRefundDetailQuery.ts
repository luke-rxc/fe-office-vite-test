import { OrderRefundDetailItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderRefundDetail } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { OrderRefundDetailItemModel, toOrderRefundDetailItemModel } from '../models';

/**
 * 주문 환불 상세 조회 query
 */
export const useOrderRefundDetailQuery = (
  refundId: string,
  option: UseQueryOptions<OrderRefundDetailItemSchema, ErrorModel, OrderRefundDetailItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderRefundQueryKeys['detail']>>) => {
      const [{ refundId }] = queryKey;
      return getOrderRefundDetail(refundId);
    },
    [],
  );

  return useQuery(OrderRefundQueryKeys.detail(refundId), queryFn, {
    select: toOrderRefundDetailItemModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
