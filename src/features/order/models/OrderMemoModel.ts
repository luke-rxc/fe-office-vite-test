import { toDateFormat } from '@utils/date';
import { OrderMemoItemSchema } from '../schemas';
import { OrderMessage } from '../types';

/**
 * 주문 메모 item model
 */
export interface OrderMemoItemModel extends OrderMessage {}

/**
 * 주문 메모 item schema > 주문 메모 item model convert
 */
export const toOrderMemoItemModel = (item: OrderMemoItemSchema): OrderMemoItemModel => {
  return {
    id: item.id,
    date: toDateFormat(item.createdDateTime, 'yyyy/MM/dd HH:mm:ss'),
    message: `[${item.provider.name}] [${item.createdAdmin.name}] ${item.message}`,
  };
};

/**
 * 주문 메모 item list schema > 주문 메모 item list model convert
 */
export const toOrderMemoListModel = (items: Array<OrderMemoItemSchema>): Array<OrderMemoItemModel> => {
  return items.map(toOrderMemoItemModel);
};
