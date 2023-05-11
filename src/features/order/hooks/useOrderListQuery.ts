import { OrderSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrders } from '../apis';
import { OrderQueryKeys } from '../constants';
import { OrderModel, toOrderModelList } from '../models';
import { OrderListSearchParams } from '../types';

/**
 * 주문 리스트 조회 query
 */
export const useOrderListQuery = (
  params: OrderListSearchParams,
  isManager: boolean,
  option: UseQueryOptions<PaginationResponse<OrderSchema>, ErrorModel, PaginationResponse<OrderModel>> = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getOrders(params);
  }, []);

  return useQuery(OrderQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toOrderModelList(data.content, isManager),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
