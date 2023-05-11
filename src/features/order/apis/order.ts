import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { OrderStatusSchema, OrderDetailCommonSchema, OrderSchema } from '../schemas';
import { OrderListSearchParams } from '../types';

export interface OrderParams {
  orderId: string;
  itemId: string;
}

/**
 * 주문리스트 조회
 */
export const getOrders = ({
  page,
  size,
  ...params
}: OrderListSearchParams): Promise<PaginationResponse<OrderSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderSchema>>(`/order/search?page=${page}&size=${size}`, params);
};

/**
 * 주문관리 상품준비중에서 결제완료 상태 변경
 */
export const putOrderPaid = (orderId: string): Promise<OrderStatusSchema> => {
  return baseApiClient.put<OrderStatusSchema>(`/order/${orderId}/paid`);
};

/**
 * 주문관리 결제완료에서 상품준비 상태 변경
 */
export const putOrderPreparingGoods = (orderId: string): Promise<OrderStatusSchema> => {
  return baseApiClient.put<OrderStatusSchema>(`/order/${orderId}/preparing-goods`);
};

/**
 * 주문관리 상품준비중에서 결제완료 상태 변경 (파트너)
 */
export const putOrderPaidByPartner = ({ orderId, itemId }: OrderParams): Promise<OrderStatusSchema> => {
  return baseApiClient.put<OrderStatusSchema>(`/order/${orderId}/item/${itemId}/paid`);
};

/**
 * 주문관리 결제완료에서 상품준비 상태 변경 (파트너)
 */
export const putOrderPreparingGoodsByPartner = ({ orderId, itemId }: OrderParams): Promise<OrderStatusSchema> => {
  return baseApiClient.put<OrderStatusSchema>(`/order/${orderId}/item/${itemId}/preparing-goods`);
};

/**
 * 주문내역 공통 조회
 */
export const getOrderCommon = (orderId: string): Promise<OrderDetailCommonSchema> => {
  return baseApiClient.get<OrderDetailCommonSchema>(`/order/${orderId}/common`);
};

/**
 * 배송방법 직접배송으로 변경
 */
export const putChangeDirectShippingMethod = ({ orderId, itemId }: OrderParams): Promise<string> => {
  return baseApiClient.put<string>(`/order/${orderId}/item/${itemId}/shipping-method/direct`);
};

/**
 * 주문리스트 엑셀 data 조회
 */
export const getOrderExcelItems = ({
  page,
  size,
  ...params
}: OrderListSearchParams): Promise<PaginationResponse<OrderSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderSchema>>(`/order/search?page=${page}&size=${size}`, params);
};
