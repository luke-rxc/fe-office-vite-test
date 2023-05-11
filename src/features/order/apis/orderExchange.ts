import { baseApiClient } from '@utils/api';
import { OrderRequestExchangeOptionSchema } from '../schemas';
import { OrderExchangeRequestParams } from '../types';

/**
 * 교환 신청 가능한 주문 옵션 조회
 */
export const getOrderExchangeOption = (orderId: string): Promise<OrderRequestExchangeOptionSchema> => {
  return baseApiClient.get<OrderRequestExchangeOptionSchema>(`/order/${orderId}/exchange`);
};

/**
 * 교환 요청
 */
export const postOrderExchange = ({ orderId, exportId, ...params }: OrderExchangeRequestParams): Promise<void> => {
  return baseApiClient.post<void>(`/return/exchange/order/${orderId}/export/${exportId}`, params);
};
