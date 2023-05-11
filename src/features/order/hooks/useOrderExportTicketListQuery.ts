import { OrderExportTicketItemSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderExportTicketList } from '../apis';
import { OrderExportTicketQueryKeys } from '../constants';
import { OrderExportTicketItemModel, toOrderExportTicketListModel } from '../models';
import { OrderExportTicketListSearchParams } from '../types';

/**
 * 출고(티켓) 리스트 조회 query
 */
export const useOrderExportTicketListQuery = (
  params: OrderExportTicketListSearchParams,
  option: UseQueryOptions<
    PaginationResponse<OrderExportTicketItemSchema>,
    ErrorModel,
    PaginationResponse<OrderExportTicketItemModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderExportTicketQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getOrderExportTicketList(params);
    },
    [],
  );

  return useQuery(OrderExportTicketQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toOrderExportTicketListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
