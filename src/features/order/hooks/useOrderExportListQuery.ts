import { OrderExportListItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderExportList } from '../apis';
import { OrderExportQueryKeys } from '../constants';
import { OrderExportListItemModel, toOrderExportListModel } from '../models';
import { OrderExportListSearchParams } from '../types';

/**
 * 출고 리스트 조회 query
 */
export const useOrderExportListQuery = (
  params: OrderExportListSearchParams,
  option: UseQueryOptions<
    PaginationResponse<OrderExportListItemSchema>,
    ErrorModel,
    PaginationResponse<OrderExportListItemModel>
  > = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderExportQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getOrderExportList(params);
  }, []);

  return useQuery(OrderExportQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toOrderExportListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
