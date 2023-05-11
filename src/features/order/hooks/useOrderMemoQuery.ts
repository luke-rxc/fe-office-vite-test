import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getOrderMemos } from '../apis';
import { OrderMemoQueryKeys } from '../constants';
import { OrderMemoItemModel, toOrderMemoListModel } from '../models';
import { OrderMemoItemSchema } from '../schemas';
import { OrderMemoRequest } from '../types';

/**
 * 주문 메모 조회 query hook
 */
export const useOrderMemoQuery = (
  params: OrderMemoRequest,
  isPartnerType: boolean = false,
  option: UseQueryOptions<Array<OrderMemoItemSchema>, ErrorModel, Array<OrderMemoItemModel>> = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof OrderMemoQueryKeys['list']>>) => {
    const [{ params, isPartnerType }] = queryKey;
    return getOrderMemos(params, isPartnerType);
  }, []);

  return useQuery(OrderMemoQueryKeys.list(params, isPartnerType), queryFn, {
    select: (data) => toOrderMemoListModel(data),
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
