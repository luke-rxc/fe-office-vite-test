import { ExportItemTicketSchema, OrderGoodsSchema, OrderProviderSchema, StatusSchema } from '.';
import { OrderStatus } from '../constants';

/**
 * 주문 출고리스트 item schema
 */
export interface OrderExportListItemSchema {
  id: number;
  orderId: number;
  goodsName: string;
  quantity: string;
  ordererName: string;
  recipientName: string;
  deliveryCompany: string;
  deliveryNumber: string;
  exportedDate: number;
  inShippingDate: number;
  shippingIngDate: number;
  completeDate: number;
  exportStatus: StatusSchema;
  confirmDate: number;
}

/**
 * 주문 출고 item option schema
 */
export interface OrderExportItemOptionSchema {
  id: number;
  orderItemId: number;
  orderItemOptionId: number;
  exportEa: number;
  orderEa: number;
  priceWithExportEa: number;
  goods: OrderGoodsSchema;
  provider: OrderProviderSchema;
  partnerExportCode: string;
}

/**
 * 주문 출고 상세 schema
 */
export interface OrderExportDetailSchema {
  id: number;
  orderId: number;
  status: StatusSchema;
  makeType: string;
  exportedDate: number;
  inShippingDate: number;
  shippingIngDate: number;
  completeDate: number;
  delivery: {
    company: string;
    number: string;
    trackingUrl: string;
  };
  itemOptionList: Array<OrderExportItemOptionSchema>;
  ticket: ExportItemTicketSchema;
}

/**
 * 주문 출고가능 item schema
 */
export interface OrderExportableItemSchema {
  amount: number;
  consumerPrice: number;
  deliveryRequestMessage: string;
  ea: number;
  email: string;
  goodsId: string;
  goodsName: string;
  goodsOptionId: number;
  goodsOptionName: string;
  orderId: number;
  orderItemOptionId: number;
  orderStep: OrderStatus;
  paymentDate: string;
  pcccNumber: string;
  phone: string;
  price: number;
  partnerExportCode: string;
  recipientAddress: string;
  recipientAddressDetail: string;
  recipientPhone: string;
  recipientPostCode: string;
  recipientUserName: string;
  shippingCost: number;
  shippingId: number;
  shippingMethod: string;
  userName: string;
}

/**
 * 주문 일괄출고 결과 message schema
 */
export interface OrderExportRegistMessageSchema {
  optionId: string;
  message: string;
}

/**
 * 주문 일괄출고 결과 schema
 */
export interface OrderExportRegistSchema {
  exportGoodsName: string;
  exportId: number;
  exportedEaSum: number;
  isSuccess: boolean;
  messages: Array<OrderExportRegistMessageSchema>;
  orderEaSum: number;
  orderId: number;
  shippingMethod: string;
}
