import { baseApiClient } from '@utils/api';
import { LogDomain } from '../constants/log';
import { OrderLogSchema } from '../schemas';
import { OrderLogParams } from '../types';

/**
 * 주문 처리로그 조회
 */
export const getOrderLog = ({ logDomain, orderId, subId }: OrderLogParams): Promise<OrderLogSchema> => {
  // logDomain이 ORDER 일 경우 주문 처리로그
  // 그 외는 주문 하위 처리로그
  if (logDomain === LogDomain.ORDER) {
    return baseApiClient.get<OrderLogSchema>(`/common/logs/ORDER/id/${orderId}`);
  }

  return baseApiClient.get<OrderLogSchema>(`/common/logs/${logDomain}/id/${orderId}/${subId}`);
};
