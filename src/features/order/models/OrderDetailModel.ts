import {
  OrderDetailOrdererSchema,
  OrderDetailPaymentSchema,
  OrderDetailRecipientSchema,
  OrderDetailSchema,
} from '../schemas';
import { OrderDetailRecipientFormField } from '../types';

/**
 * 주문 상세 주문자 model
 */
export interface OrderDetailOrdererModel extends OrderDetailOrdererSchema {}

/**
 * 주문 상세 받는정보 model
 */
export interface OrderDetailRecipientModel extends OrderDetailRecipientSchema {}

/**
 * 주문 상세 결제 model
 */
export interface OrderDetailPaymentModel extends OrderDetailPaymentSchema {
  amountText: string;
  totalShippingCostText: string;
  totalUsedCouponSaleText: string;
  usedPointText: string;
}

/**
 * 주문 상세 model
 */
export interface OrderDetailModel extends OrderDetailSchema {
  orderer: OrderDetailOrdererModel;
  recipient: OrderDetailRecipientModel;
  payment: OrderDetailPaymentModel;
}

/**
 * OrderDetailPayment schema > OrderDetailPayment model convert
 */
export const toOrderDetailPaymentModel = (item: OrderDetailPaymentSchema): OrderDetailPaymentModel => {
  return {
    ...item,
    amountText: item.amount ? item.amount.toLocaleString() : '',
    totalShippingCostText: item.totalShippingCost ? item.totalShippingCost.toLocaleString() : '',
    totalUsedCouponSaleText: item.totalUsedCouponSale ? item.totalUsedCouponSale.toLocaleString() : '',
    usedPointText: item.usedPoint ? item.usedPoint.toLocaleString() : '',
  };
};

/**
 * OrderDetail schema > OrderDetail model convert
 */
export const toOrderDetailModel = (item: OrderDetailSchema): OrderDetailModel => {
  return {
    ...item,
    orderer: item.orderer as OrderDetailOrdererModel,
    recipient: item.recipient as OrderDetailRecipientModel,
    payment: toOrderDetailPaymentModel(item.payment),
  };
};

/**
 * OrderDetailRecipient model > OrderDetailRecipient form field convert
 */
export const toOrderDetailRecipientFormField = (
  item: OrderDetailRecipientModel,
  initialValues: OrderDetailRecipientFormField,
): OrderDetailRecipientFormField => {
  return {
    name: item.name || initialValues.name,
    phone: item.phone || initialValues.phone,
    postCode: item.postCode || initialValues.postCode,
    address: item.address || initialValues.address,
    addressDetail: item.addressDetail || initialValues.addressDetail,
    deliveryRequestMessage: item.deliveryRequestMessage || initialValues.deliveryRequestMessage,
    pcccNumber: item.pcccNumber || initialValues.pcccNumber,
  };
};
