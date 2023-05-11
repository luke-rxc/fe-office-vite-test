import { OrderReturnDetailItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderReturnDetail } from '../apis';
import { OrderReturnQueryKeys } from '../constants';
import { OrderReturnDetailItemModel, toOrderReturnDetailItemModel } from '../models';

/**
 * 주문 반품 상세 조회 query
 */
export const useOrderReturnDetailQuery = (
  returnId: string,
  option: UseQueryOptions<OrderReturnDetailItemSchema, ErrorModel, OrderReturnDetailItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderReturnQueryKeys['detail']>>) => {
      const [{ returnId }] = queryKey;
      return getOrderReturnDetail(returnId);
    },
    [],
  );

  return useQuery(OrderReturnQueryKeys.detail(returnId), queryFn, {
    select: toOrderReturnDetailItemModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
