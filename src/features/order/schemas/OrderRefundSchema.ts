import {
  CodeInfo,
  ComboBankSchema,
  OrderGoodsOptionSchema,
  OrderGoodsSchema,
  OrderItemOptionShippingSchema,
  OrderProviderSchema,
  StatusSchema,
} from '.';
import { OrderPaymentType } from '../constants';

/**
 * 주문 취소요청 가능 item option schema
 */
export interface OrderRequestRefundableItemOptionSchema {
  id: number;
  itemId: number;
  provider: OrderProviderSchema;
  goods: OrderGoodsSchema;
  ea: number;
  refundableEa: number;
  status: StatusSchema;
  packageOption: OrderGoodsOptionSchema;
  shipping: OrderItemOptionShippingSchema;
  /**
   * 신청 수량이 짝수여부
   */
  isRequiredEvenEa: boolean;
}

/**
 * 주문 취소요청 옵션 schema
 */
export interface OrderRequestRefundOptionSchema {
  orderId: number;
  isFullRefundable: boolean;
  refundableItemOptionList: Array<OrderRequestRefundableItemOptionSchema>;
}

/**
 * 주문 취소사유 item schema
 */
export interface OrderRefundReasonItemSchema {
  code: string;
  text: string;
}

/**
 * 주문 취소사유 item list schema
 */
export type OrderRefundReasonItemListSchema = Array<OrderRefundReasonItemSchema>;

/**
 * 주문 환불리스트 item schema
 */
export interface OrderRefundListItemSchema {
  id: number;
  orderId: number;
  createdDate: number;
  completedDate: number;
  type: CodeInfo;
  status: CodeInfo;
  refundMethod: {
    type: string;
    name: string;
  };
  refundPrice: number;
  ordererName: string;
  paymentType: {
    type: string;
    name: string;
    description: string;
  };
  goodsName: string;
  quantity: string;
  providerId: number;
  providerName: string;
  refundReasonCodeText: string;
  refundReason: string;
}

/**
 * 주문 환불 상세 item option schema
 */
export interface OrderRefundItemOptionSchema {
  id: number;
  orderItemId: number;
  orderItemOptionId: number;
  packageGroupId: number;
  isPackageOption: boolean;
  refundEa: number;
  orderEa: number;
  goods: OrderGoodsSchema;
  provider: OrderProviderSchema;
}

export interface OrderRefundAccountInfoSchema {
  account: string;
  bank: ComboBankSchema;
  depositor: string;
}

/**
 * 주문 환불 상세 item schema
 */
export interface OrderRefundDetailItemSchema {
  id: number;
  orderId: number;
  type: CodeInfo;
  status: CodeInfo;
  returnInfo: {
    returnId: number;
    returnStatus: CodeInfo;
  };
  createdDate: number;
  completedDate: number;
  actorName: string;
  refundReason: {
    reason: CodeInfo;
    reasonText: string;
  };
  isChangeRefundBankInfo: boolean;
  itemOptionList: Array<OrderRefundItemOptionSchema>;
  userRefundAccount: OrderRefundAccountInfoSchema;
  refundBankInfo: OrderRefundAccountInfoSchema;
}

/**
 * 주문 환불 은행정보 schema
 */
export interface OrderRefundBankInfoSchema {
  userRefundAccount: OrderRefundAccountInfoSchema;
  refundBankInfo: OrderRefundAccountInfoSchema;
}

export interface RefundStatusInfoSchema {
  refundStatus: string;
  refundStatusText: string;
}

export interface RefundMethodInfoSchema {
  refundMethod: string;
  refundMethodText: string;
}

/**
 * 주문 환불처리 정보 item option schema
 */
export interface OrderRefundPriceInfoItemOptionSchema {
  // 환불 옵션 아이디
  id: number;
  // 주문 상품 item 아이디
  orderItemId: number;
  // 주문상품 옵션 아이디
  orderItemOptionId: number;
  // 배송그룹 아이디
  shippingId: number;
  // 상품 정보
  goods: OrderGoodsSchema;
  // 환불 요청 수량
  refundEa: number;
  // 환불 상품 가격
  refundGoodsPrice: number;
  // 사용한 쿠폰 할인 금액
  usedCouponPrice: number;
  // 주문시 사용한 쿠폰 할인 금액
  totalUsedCouponPrice: number;
  // 환불 배송비
  shippingCost: number;
  // 입점사 정보
  provider: OrderProviderSchema;
  // 주문 배송비 정책
  orderShippingInfoText: string;
  // 주문 배송 방법
  orderShippingMethod: string;
  // 주문시 결제한 배송비
  orderShippingCost: number;
  // 주문시 결제한 도서산간 추가 배송비
  orderAddShippingCost: number;
  // 반품 배송비
  returnShippingCost: number;
  // 반품 추가 배송비
  returnAddShippingCost: number;
  // 예상 반품배송비(입점사)
  tempShippingCost: number;
}

/**
 * 주문 환불처리 금액정보 schema
 */
export interface OrderRefundPriceInfoSchema {
  refundItemOptionList: Array<OrderRefundPriceInfoItemOptionSchema>;
  // 변경 가능한 환불 상태
  changeableStatusList: Array<RefundStatusInfoSchema>;
  // 환불 상태
  refundStatusInfo: RefundStatusInfoSchema;
  // 환불 가능한 수단
  refundableMethods: Array<RefundMethodInfoSchema>;
  // 환불 수단
  refundMethod: OrderPaymentType;
  // 최종 환불 금액
  refundPrice: number;
  // 최종 환불 포인트
  refundPoint: number;
  // 총 환불상품 금액
  totalRefundGoodsPrice: number;
  // 총 사용쿠폰 금액
  totalUsedCouponPrice: number;
  // 총 배송비
  totalRefundShippingCost: number;
  // 장바구니 쿠폰
  usedCartCouponPrice: number;
}

/**
 * 주문 환불 금액 계산 schema
 */
export interface OrderRefundPriceSchema {
  // 환불 수단
  refundMethod: OrderPaymentType;
  // 최종 환불 금액
  refundPrice: number;
  // 최종 환불 포인트
  refundPoint: number;
  // 환불 가능한 수단
  refundableMethods: Array<RefundMethodInfoSchema>;
  // 총 환불상품 금액
  totalRefundGoodsPrice: number;
  // 총 배송비
  totalRefundShippingCost: number;
  // 총 사용쿠폰 금액
  totalUsedCouponPrice: number;
}

/**
 * 주문 환불 상태변경 schema
 */
export interface OrderRefundStatusSchema {
  resultMessage: string;
}
