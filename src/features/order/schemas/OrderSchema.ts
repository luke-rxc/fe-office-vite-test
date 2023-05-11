import { OrderPaymentType, OrderStatus } from '../constants';
import { OrderImage } from '../types';

export interface CodeInfo {
  code: string;
  name: string;
}

export interface StatusSchema {
  step: string;
  name: string;
}

/**
 * Order schema
 */
export interface OrderSchema {
  orderId: number;
  createdDate: number;
  paymentDate: number;
  ordererName: string;
  recipientName: string;
  itemId: string;
  paymentType: {
    type: OrderPaymentType;
    name: string;
    description: string;
  };
  amount: number;
  orderStatus: StatusSchema;
  goodsName: string;
  quantity: string;
}

/**
 * 주문 상태변경 schema
 */
export interface OrderStatusSchema {
  name: string;
  step: OrderStatus;
}

/**
 * 주문 상품 option schema
 */
export interface OrderGoodsOptionSchema {
  id: number;
  itemList: Array<{
    title: string;
    value: string;
  }>;
  price: number;
  stock: number;
  purchasableStock: number;
}

/**
 * 주문 상품 schema
 */
export interface OrderGoodsSchema {
  id: number;
  name: string;
  primaryImage: OrderImage;
  option: OrderGoodsOptionSchema;
  type: CodeInfo;
  kind: CodeInfo;
  isCancelable: boolean;
}

/**
 * 주문 item option shipping schema
 */
export interface OrderItemOptionShippingSchema {
  id: number;
  cost: number;
  addCost: number;
  text: string;
}

/**
 * 주문 입점사 schema
 */
export interface OrderProviderSchema {
  id: number;
  name: string;
}

/**
 * 주문 item option schema
 */
export interface OrderItemOptionSchema {
  id: number;
  itemId: number;
  provider: OrderProviderSchema;
  brand: {
    id: number;
    name: string;
  };
  goods: OrderGoodsSchema;
  ea: number;
  returnEa: number;
  step30Ea: number;
  step40Ea: number;
  step50Ea: number;
  step60Ea: number;
  step70Ea: number;
  refundEa: number;
  couponSale: number;
  status: StatusSchema;
  shipping: OrderItemOptionShippingSchema;
  isChangeShippingMethod: boolean;
  isPackageOption: boolean;
  shippingMethodText: string;
}

/**
 * 주문 상세 공통 order item schema
 */
export interface OrderDetailCommonOrderItemSchema {
  orderId: number;
  originalOrderId: number | null;
  userId: number;
  createdDate: number;
  paymentDate: number | null;
  ordererName: string;
  recipientName: string;
  paymentType: {
    type: OrderPaymentType;
    name: string;
    description: string;
  };
  orderStatus: OrderStatusSchema;
  amount: number;
  totalShippingCost: number;
  totalUsedCouponSale: number;
  usedPoint: number;
  /**
   * 1:1 문의하기 등록여부
   */
  hasZendeskTicket: boolean;
  /**
   * 블랙리스트 여부
   */
  isBlack: boolean;
}

/**
 * 주문 상세 공통 item option schema
 */
export interface OrderDetailCommonItemOptionSchema {
  itemOptionList: Array<OrderItemOptionSchema>;
  totalPrice: number;
  totalShippingCost: number;
  totalUsedCouponSale: number;
  usedPoint: number;
  amount: number;
}

/**
 * 주문 상세 공통 출고 item ticket schema
 */
export interface ExportItemTicketSchema {
  endDate: number;
  isExpired: boolean;
  resendCount: number;
  startDate: number;
  status: CodeInfo;
  usedDate: number;
}

/**
 * 주문 상세 공통 출고 item schema
 */
export interface OrderDetailCommonExportItemSchema {
  id: number;
  exportedDate: number;
  confirmDate: number;
  status: StatusSchema;
  ea: number;
  goods: OrderGoodsSchema;
  inShippingDate: number | null;
  shippingIngDate: number | null;
  completeDate: number;
  delivery: {
    company: string;
    number: string;
    trackingUrl: string;
  };
  ticket: ExportItemTicketSchema;
}

/**
 * 주문 상세 공통 반품 item schema
 */
export interface OrderDetailCommonReturnItemSchema {
  id: number;
  type: CodeInfo;
  ea: number;
  status: CodeInfo;
  refundId: number | null;
  refundStatus: CodeInfo;
  returnAutomationStatus: CodeInfo;
  returnDeliveryCompanyText: string;
  returnDeliveryNumber: string;
  goods: OrderGoodsSchema;
  createdDate: number;
  completedDate: number | null;
  actorName: string;
  isPackageOption: boolean;
  packageGroupId: number;
}

/**
 * 주문 상세 공통 환불 item schema
 */
export interface OrderDetailCommonRefundItemSchema {
  id: number;
  type: CodeInfo;
  ea: number;
  status: CodeInfo;
  goods: OrderGoodsSchema;
  createdDate: number;
  refundPrice: number;
  refundPoint: number;
  refundMethod: CodeInfo;
  completedDate: number;
  actorName: string;
  isPackageOption: boolean;
  packageGroupId: number;
}

/**
 * 주문 상세 공통 schema
 */
export interface OrderDetailCommonSchema {
  order: OrderDetailCommonOrderItemSchema;
  itemOption: OrderDetailCommonItemOptionSchema;
  exportList: Array<OrderDetailCommonExportItemSchema>;
  returnList: Array<OrderDetailCommonReturnItemSchema>;
  refundList: Array<OrderDetailCommonRefundItemSchema>;
}

/**
 * 주문 반품신청 회수자정보 schema
 */
export interface OrderRequestReturnSenderSchema {
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
}
