import { OrderRefundListItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderRefundList } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { OrderRefundListItemModel, toOrderRefundListModel } from '../models';
import { OrderRefundListSearchParams } from '../types';

/**
 * 환불 리스트 조회 query
 */
export const useOrderRefundListQuery = (
  params: OrderRefundListSearchParams,
  option: UseQueryOptions<
    PaginationResponse<OrderRefundListItemSchema>,
    ErrorModel,
    PaginationResponse<OrderRefundListItemModel>
  > = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderRefundQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getOrderRefundList(params);
  }, []);

  return useQuery(OrderRefundQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toOrderRefundListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
