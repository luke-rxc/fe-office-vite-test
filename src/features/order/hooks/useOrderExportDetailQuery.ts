import { OrderExportDetailSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderExportDetail } from '../apis';
import { OrderExportQueryKeys } from '../constants';
import { OrderExportDetailModel, toOrderExportDetailModel } from '../models';

/**
 * 주문 출고 상세 조회 query hook
 */
export const useOrderExportDetailQuery = (
  exportId: string,
  option: UseQueryOptions<OrderExportDetailSchema, ErrorModel, OrderExportDetailModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderExportQueryKeys['detail']>>) => {
      const [{ exportId }] = queryKey;
      return getOrderExportDetail(exportId);
    },
    [],
  );

  return useQuery(OrderExportQueryKeys.detail(exportId), queryFn, {
    select: toOrderExportDetailModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
