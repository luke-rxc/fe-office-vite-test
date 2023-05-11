import { OrderRefundReasonItemListSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getRefundReasonItems } from '../apis';
import { OrderRefundQueryKeys } from '../constants';
import { OrderRefundReasonItemListModel, toOrderRefundReasonItemListModel } from '../models';

/**
 * 환불 사유 항목 조회 query
 */
export const useOrderRefundReasonQuery = (
  option: UseQueryOptions<OrderRefundReasonItemListSchema, ErrorModel, OrderRefundReasonItemListModel> = {},
) => {
  const queryFn = useCallback(() => {
    return getRefundReasonItems();
  }, []);

  return useQuery(OrderRefundQueryKeys.refundReasons(), queryFn, {
    select: toOrderRefundReasonItemListModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
