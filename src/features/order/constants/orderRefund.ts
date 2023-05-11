import { OrderRefundListSearchParams } from '../types';

/**
 * 환불 query keys
 */
export const OrderRefundQueryKeys = {
  all: [{ scope: 'order-refund' }] as const,
  list: (params: OrderRefundListSearchParams) => [{ ...OrderRefundQueryKeys.all[0], entity: 'list', params }] as const,
  detail: (refundId: string) => [{ ...OrderRefundQueryKeys.all[0], entity: 'detail', refundId }] as const,
  priceInfo: (refundId: string) => [{ ...OrderRefundQueryKeys.all[0], entity: 'price-info', refundId }] as const,
  refundOption: (orderId: string) => [{ ...OrderRefundQueryKeys.all[0], entity: 'refund-option', orderId }] as const,
  refundReasons: () => [{ ...OrderRefundQueryKeys.all[0], entity: 'refund-reasons' }] as const,
} as const;

/**
 * 환불상태
 */
export const RefundStatus = {
  REQUEST: 'REQUEST',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RefundStatus = typeof RefundStatus[keyof typeof RefundStatus];

export const RefundStatusLabel: {
  [k in RefundStatus]: string;
} = {
  REQUEST: '환불요청',
  IN_PROGRESS: '환불접수',
  COMPLETE: '환불완료',
};

/**
 * 환불상태 옵션
 */
export const RefundStatusOptions: Array<RefundStatus> = [
  RefundStatus.REQUEST,
  RefundStatus.IN_PROGRESS,
  RefundStatus.COMPLETE,
];

/**
 * 주문 취소 타입
 */
export const OrderCancelType = {
  ALL: 'ALL',
  CASE: 'CASE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderCancelType = typeof OrderCancelType[keyof typeof OrderCancelType];

export const OrderCancelTypeConfirmLabel: {
  [k in OrderCancelType]: string;
} = {
  ALL: '해당 주문을 전체취소 하시겠습니까?\r\n(결제 취소(환불)가 즉시 처리됩니다)',
  CASE: '선택한 주문을 취소 하시겠습니까?',
};

/**
 * 반품 타입
 */
export const OrderSearchRefundType = {
  RETURN: 'RETURN',
  CANCEL_PAYMENT: 'CANCEL_PAYMENT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderSearchRefundType = typeof OrderSearchRefundType[keyof typeof OrderSearchRefundType];

export const OrderSearchRefundTypeLabel: {
  [k in OrderSearchRefundType]: string;
} = {
  RETURN: '반품',
  CANCEL_PAYMENT: '취소',
};

/**
 * 환불 엑셀 코드
 */
export const OrderRefundExcelCode = {
  index: 'No',
  createdDate: '환불접수일시',
  orderId: '주문번호',
  goodsName: '환불상품',
  paymentType: '결제',
  quantity: '수량',
  type: '환불종류',
  refundMethod: '환불방법',
  refundPrice: '환불금액',
  ordererName: '주문자',
  status: '환불상태',
  completedDate: '처리일시',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderRefundExcelCode = typeof OrderRefundExcelCode[keyof typeof OrderRefundExcelCode];
