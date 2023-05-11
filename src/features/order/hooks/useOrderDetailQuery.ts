import { OrderDetailSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderDetail } from '../apis';
import { OrderQueryKeys } from '../constants';
import { OrderDetailModel, toOrderDetailModel } from '../models';

/**
 * 주문 상세 조회 query
 */
export const useOrderDetailQuery = (
  orderId: string,
  option: UseQueryOptions<OrderDetailSchema, ErrorModel, OrderDetailModel> = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderQueryKeys['detail']>>) => {
    const [{ orderId }] = queryKey;
    return getOrderDetail(orderId);
  }, []);

  return useQuery(OrderQueryKeys.detail(orderId), queryFn, {
    select: toOrderDetailModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
