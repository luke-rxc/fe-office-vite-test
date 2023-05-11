import {
  CodeInfo,
  OrderGoodsOptionSchema,
  OrderGoodsSchema,
  OrderProviderSchema,
  OrderRequestReturnSenderSchema,
  StatusSchema,
} from '.';

/**
 * 주문 반품사유 item schema
 */
export interface OrderReturnReasonItemSchema {
  code: string;
  text: string;
}

/**
 * 주문 반품사유 item list schema
 */
export type OrderReturnReasonItemListSchema = Array<OrderReturnReasonItemSchema>;

/**
 * 주문 반품신청 가능 item option ticket schema
 */
export interface OrderRequestReturnableItemOptionTicketSchema {
  endDate: number;
  isExpired: boolean;
  resendCount: number;
  startDate: number;
  status: {
    code: string;
    name: string;
  };
  usedDate: number;
  bookingDate: number;
  cancelableMessage: string;
  numberOfDateChanges: number;
  numberOfGuestChanges: number;
}

/**
 * 주문 반품신청 가능 item option schema
 */
export interface OrderRequestReturnableItemOptionSchema {
  id: number;
  itemId: number;
  provider: OrderProviderSchema;
  goods: OrderGoodsSchema;
  ea: number;
  returnableEa: number;
  status: StatusSchema;
  packageOption: OrderGoodsOptionSchema;
  exportEa: number;
  exportId: number;
  exportStatus: StatusSchema;
  /**
   * 자동회수접수 가능여부
   */
  isAutoReturnable: boolean;
  /**
   * 신청 수량이 짝수여부
   */
  isRequiredEvenEa: boolean;
  ticket: OrderRequestReturnableItemOptionTicketSchema | null;
}

/**
 * 주문 반품신청 옵션 schema
 */
export interface OrderRequestReturnOptionSchema {
  orderId: number;
  returnableItemOptionList: Array<OrderRequestReturnableItemOptionSchema>;
  returnSender: OrderRequestReturnSenderSchema;
  isCancelExportTicket: boolean;
  paymentDate: number;
}

/**
 * 주문 반품리스트 item schema
 */
export interface OrderReturnListItemSchema {
  id: number;
  orderId: number;
  createdDate: number;
  completedDate: number;
  type: CodeInfo;
  status: CodeInfo;
  refundStatus: CodeInfo;
  returnAutomationStatus: CodeInfo;
  ordererName: string;
  paymentType: {
    type: string;
    name: string;
    description: null;
  };
  goodsName: string;
  quantity: string;
  providerId: number;
  providerName: string;
  returnReasonCodeText: string;
  returnReason: string;
}

/**
 * 주문 반품 엑셀리스트 item schema
 */
export interface OrderReturnExcelListItemSchema {
  completedDate: number;
  createdDate: number;
  exportId: number;
  goodsId: number;
  goodsName: string;
  id: number;
  itemOptionList: Array<{ title: string; value: string }>;
  orderId: number;
  orderPaymentDate: number;
  ordererName: string;
  providerId: number;
  providerName: string;
  recipientName: string;
  recipientPhone: string;
  returnEa: number;
  type: CodeInfo;
  status: CodeInfo;
}

/**
 * 주문 반품 item option exchange schema
 */
export interface OrderReturnItemOptionExchangeSchema {
  goods: OrderGoodsSchema;
  exchangeEa: number;
  exchangeOrderId: number;
}

/**
 * 주문 반품 item option schema
 */
export interface OrderReturnItemOptionSchema {
  id: number;
  orderItemId: number;
  orderItemOptionId: number;
  packageGroupId: number;
  isPackageOption: false;
  returnEa: number;
  orderEa: number;
  goods: OrderGoodsSchema;
  exchange: OrderReturnItemOptionExchangeSchema;
  provider: OrderProviderSchema;
}

/**
 * 주문 반품상세 출고티켓 정보 schema
 */
export interface OrderReturnDetailExportTicketInfoSchema {
  exportId: number;
  isPossibleCancelRequest: boolean;
  message: string | null;
}

/**
 * 주문 반품상세 item schema
 */
export interface OrderReturnDetailItemSchema {
  id: number;
  orderId: number;
  type: CodeInfo;
  status: CodeInfo;
  refund: {
    refundId: string;
    refundStatus: string;
  };
  returnAutomationStatus: CodeInfo;
  returnDeliveryCompanyText: string;
  returnDeliveryNumber: string;
  createdDate: number;
  completedDate: number;
  actorName: string;
  returnMethod: CodeInfo;
  returnReason: {
    reason: CodeInfo;
    reasonText: string;
  };
  returnSender: OrderRequestReturnSenderSchema;
  itemOptionList: Array<OrderReturnItemOptionSchema>;
  isChangeableReturnInfo: boolean;
  isRejectable: boolean;
  isWithdrawable: boolean;
  isAutoReturnable: boolean;
  changeableStatusList: Array<CodeInfo>;
  tempReturnShippingCost: number;
  returnShippingCost: number;
  isCancelExportTicket: boolean;
  exportTicketInfo: OrderReturnDetailExportTicketInfoSchema | null;
}

/**
 * 반품 변경정보 schema
 */
export interface OrderReturnChangeInfoSchema {
  action: string;
  exchangeOrderId: number;
  orderId: number;
  refundId: number;
}
