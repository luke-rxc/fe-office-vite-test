/**
 * 교환 신청 가능한 주문 옵션 조회 query keys
 */
export const OrderExchangeQueryKeys = {
  all: [{ scope: 'order-exchange' }] as const,
  exchangeOption: (orderId: string) =>
    [{ ...OrderExchangeQueryKeys.all[0], entity: 'exchange-option', orderId }] as const,
} as const;
