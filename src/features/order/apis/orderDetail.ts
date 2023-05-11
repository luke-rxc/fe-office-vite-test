import { baseApiClient } from '@utils/api';
import { OrderDetailSchema } from '../schemas';
import { OrderDetailRecipientFormField } from '../types';

export type OrderDetailRecipientRequestParams = OrderDetailRecipientFormField;

/**
 * 주문내역 상세 조회
 */
export const getOrderDetail = (orderId: string): Promise<OrderDetailSchema> => {
  return baseApiClient.get<OrderDetailSchema>(`/order/${orderId}`);
};

/**
 * 주문내역 배송지 정보 업데이트
 */
export const putOrderDelivery = (orderId: string, params: OrderDetailRecipientRequestParams): Promise<void> => {
  return baseApiClient.put<void>(`/order/${orderId}/shipping-info`, params);
};
