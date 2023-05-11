import { OrderRefundPriceInfoSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getRefundPriceInfo } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { OrderRefundPriceInfoModel, toOrderRefundInfoModel } from '../models';

/**
 * 환불처리 금액정보 조회 query
 */
export const useOrderRefundPriceInfoQuery = (
  refundId: string,
  option: UseQueryOptions<OrderRefundPriceInfoSchema, ErrorModel, OrderRefundPriceInfoModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderRefundQueryKeys['priceInfo']>>) => {
      const [{ refundId }] = queryKey;
      return getRefundPriceInfo(refundId);
    },
    [],
  );

  return useQuery(OrderRefundQueryKeys.priceInfo(refundId), queryFn, {
    select: toOrderRefundInfoModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
