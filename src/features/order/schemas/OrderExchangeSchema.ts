import {
  OrderGoodsOptionSchema,
  OrderGoodsSchema,
  OrderProviderSchema,
  OrderRequestReturnSenderSchema,
  StatusSchema,
} from '.';

/**
 * 주문 상품 option item schema
 */
export interface OrderGoodsOptionItemSchema extends OrderGoodsOptionSchema {
  isExchangeable: boolean;
}

/**
 * 주문 교환신청 가능 item option schema
 */
export interface OrderRequestExchangeableItemOptionSchema {
  id: number;
  itemId: number;
  exportId: number;
  provider: OrderProviderSchema;
  goods: OrderGoodsSchema;
  ea: number;
  exportEa: number;
  exchangeableEa: number;
  status: StatusSchema;
  exportStatus: StatusSchema;
  goodsOptionList: Array<OrderGoodsOptionItemSchema>;
  packageOption: OrderGoodsOptionSchema;
  isRequiredEvenEa: boolean;
  isAutoReturnable: boolean;
}

/**
 * 주문 교환신청 option schema
 */
export interface OrderRequestExchangeOptionSchema {
  orderId: number;
  exchangeableItemOptionList: Array<OrderRequestExchangeableItemOptionSchema>;
  returnSender: OrderRequestReturnSenderSchema;
}
