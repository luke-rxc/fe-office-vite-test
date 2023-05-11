import { OrderDetailCommonSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderCommon } from '../apis';
import { OrderQueryKeys } from '../constants';
import { OrderDetailCommonModel, toOrderDetailCommonModel } from '../models';

/**
 * 주문 상세 common 조회 query
 */
export const useOrderDetailCommonQuery = (
  orderId: string,
  option: UseQueryOptions<OrderDetailCommonSchema, ErrorModel, OrderDetailCommonModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderQueryKeys['detailCommon']>>) => {
      const [{ orderId }] = queryKey;
      return getOrderCommon(orderId);
    },
    [],
  );

  return useQuery(OrderQueryKeys.detailCommon(orderId), queryFn, {
    select: toOrderDetailCommonModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
