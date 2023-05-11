import { OrderReturnListItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderReturnList } from '../apis';
import { OrderReturnQueryKeys } from '../constants';
import { OrderReturnListItemModel, toOrderReturnListModel } from '../models';
import { OrderReturnListSearchParams } from '../types';

/**
 * 반품 리스트 조회 query
 */
export const useOrderReturnListQuery = (
  params: OrderReturnListSearchParams,
  option: UseQueryOptions<
    PaginationResponse<OrderReturnListItemSchema>,
    ErrorModel,
    PaginationResponse<OrderReturnListItemModel>
  > = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderReturnQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getOrderReturnList(params);
  }, []);

  return useQuery(OrderReturnQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toOrderReturnListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
