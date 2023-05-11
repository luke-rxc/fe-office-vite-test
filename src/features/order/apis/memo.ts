import { baseApiClient } from '@utils/api';
import { OrderMemoDomainType } from '../constants';
import { OrderMemoItemSchema } from '../schemas';
import { OrderMemoRegistRequest, OrderMemoRequest } from '../types';

/**
 * 주문메모 조회
 */
export const getOrderMemos = (
  { orderId, domain, subId }: OrderMemoRequest,
  isPartnerType: boolean = false,
): Promise<Array<OrderMemoItemSchema>> => {
  if (domain === OrderMemoDomainType.ORDER) {
    return baseApiClient.get<Array<OrderMemoItemSchema>>(`/order/${orderId}/memo${isPartnerType ? '/partner' : ''}`);
  }

  return baseApiClient.get<Array<OrderMemoItemSchema>>(
    `/order/${orderId}/memo${isPartnerType ? '/partner' : ''}/${domain}/${subId}`,
  );
};

/**
 * 매니저 주문메모 등록
 */
export const postOrderManagerMemo = ({
  orderId,
  ...params
}: OrderMemoRegistRequest): Promise<Array<OrderMemoItemSchema>> => {
  return baseApiClient.post<Array<OrderMemoItemSchema>>(`/order/${orderId}/memo`, params);
};
