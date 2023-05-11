import { OrderMemoRequest } from '../types';

/**
 * 주문메모 query keys
 */
export const OrderMemoQueryKeys = {
  all: [{ scope: 'order-memo' }] as const,
  lists: () => [{ ...OrderMemoQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: OrderMemoRequest, isPartnerType: boolean) =>
    [{ ...OrderMemoQueryKeys.lists()[0], params, isPartnerType }] as const,
} as const;
