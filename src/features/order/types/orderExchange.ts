/**
 * 교환 요청 상품 옵션
 */
export interface OrderExchangeSender {
  address: string;
  addressDetail: string;
  name: string;
  phone: string;
  postCode: string;
}

/**
 * 교환 요청 상품 옵션
 */
export interface OrderExchangeGoodsOption {
  exchangeGoodsOptionList: Array<{
    exchangeEa: number;
    goodsOptionId: number;
  }>;
  id: number;
  itemId: number;
}

/**
 * 교환 요청 params
 */
export interface OrderExchangeRequestParams {
  orderId: string;
  exportId: string;
  itemOptionList: Array<OrderExchangeGoodsOption>;
  reason: string;
  reasonCode: string;
  returnMethod: string;
  returnSender: OrderExchangeSender;
}
