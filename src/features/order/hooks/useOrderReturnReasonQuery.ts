import { OrderReturnReasonItemListSchema } from '@features/order/schemas';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getReturnReasonItems } from '../apis';
import { OrderReturnQueryKeys } from '../constants';
import { OrderReturnReasonItemListModel, toOrderReturnReasonItemListModel } from '../models';

/**
 * 반품 사유 항목 조회 query
 */
export const useOrderReturnReasonQuery = (
  option: UseQueryOptions<OrderReturnReasonItemListSchema, ErrorModel, OrderReturnReasonItemListModel> = {},
) => {
  const queryFn = useCallback(() => {
    return getReturnReasonItems();
  }, []);

  return useQuery(OrderReturnQueryKeys.returnReasons(), queryFn, {
    select: toOrderReturnReasonItemListModel,
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
