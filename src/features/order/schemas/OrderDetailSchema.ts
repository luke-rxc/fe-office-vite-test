import { OrderPaymentType } from '../constants';

/**
 * 주문 상세 주문자 schema
 */
export interface OrderDetailOrdererSchema {
  email: string;
  name: string;
  phone: string;
}

/**
 * 주문 상세 받는정보 schema
 */
export interface OrderDetailRecipientSchema {
  isChangeShippingInfo: true;
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
  deliveryRequestMessage: string;
  pcccNumber: string;
}

/**
 * 주문 상세 결제 schema
 */
export interface OrderDetailPaymentSchema {
  paymentType: {
    type: OrderPaymentType;
    name: string;
    description: string;
  };
  amount: number;
  totalShippingCost: number;
  totalUsedCouponSale: number;
  usedPoint: number;
}

/**
 * 주문 상세 schema
 */
export interface OrderDetailSchema {
  orderId: number;
  isRefundable: boolean;
  isReturnable: boolean;
  isExchangeable: boolean;
  orderer: OrderDetailOrdererSchema;
  recipient: OrderDetailRecipientSchema;
  payment: OrderDetailPaymentSchema;
}
