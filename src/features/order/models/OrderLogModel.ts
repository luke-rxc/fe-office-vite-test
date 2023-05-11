import { toDateFormat } from '@utils/date';
import { OrderLogItemSchema, OrderLogSchema } from '../schemas';
import { OrderMessage } from '../types';

/**
 * 주문 로그 model
 */
export interface OrderLogModel {
  logs: Array<OrderMessage>;
}

/**
 * 주문 로그 item schema > 주문 로그 item model convert
 */
export const toOrderLogItemModel = (item: OrderLogItemSchema): OrderMessage => {
  return {
    id: item.id,
    date: toDateFormat(item.createdDateTime, 'yyyy/MM/dd HH:mm:ss'),
    message: `[${item.originName}] ${item.message}`,
  };
};

/**
 * 주문 로그 item list schema > 주문 로그 item list model convert
 */
export const toOrderLogItemModelList = (items: Array<OrderLogItemSchema>): Array<OrderMessage> => {
  return items.map(toOrderLogItemModel);
};

/**
 * 주문 로그 schema > 주문 로그 model convert
 */
export const toOrderLogModel = (item: OrderLogSchema): OrderLogModel => {
  return {
    logs: item.logs ? toOrderLogItemModelList(item.logs) : [],
  };
};
