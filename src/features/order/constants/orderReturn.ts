import { OrderReturnListSearchParams } from '../types';

/**
 * 반품 query keys
 */
export const OrderReturnQueryKeys = {
  all: [{ scope: 'order-return' }] as const,
  list: (params: OrderReturnListSearchParams) => [{ ...OrderReturnQueryKeys.all[0], entity: 'list', params }] as const,
  detail: (returnId: string) => [{ ...OrderReturnQueryKeys.all[0], entity: 'detail', returnId }] as const,
  returnOption: (orderId: string) => [{ ...OrderReturnQueryKeys.all[0], entity: 'return-option', orderId }] as const,
  returnReasons: () => [{ ...OrderReturnQueryKeys.all[0], entity: 'return-reasons' }] as const,
} as const;

/**
 * 반품상태
 */
export const ReturnStatus = {
  REQUEST: 'REQUEST',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVE: 'APPROVE',
  DENY: 'DENY',
  COMPLETE: 'COMPLETE',
  REJECT: 'REJECT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReturnStatus = typeof ReturnStatus[keyof typeof ReturnStatus];

export const ReturnStatusLabel: {
  [k in ReturnStatus]: string;
} = {
  REQUEST: '반품/교환 요청',
  IN_PROGRESS: '반품/교환 접수',
  APPROVE: '검수 후 반품/교환 승인(파트너)',
  DENY: '검수 후 반품/교환 거절(파트너)',
  COMPLETE: '반품/교환 완료',
  REJECT: '반품/교환 거부',
};

/**
 * 반품상태 옵션
 */
export const ReturnStatusOptions: Array<ReturnStatus> = [
  ReturnStatus.REQUEST,
  ReturnStatus.IN_PROGRESS,
  ReturnStatus.APPROVE,
  ReturnStatus.DENY,
  ReturnStatus.COMPLETE,
  ReturnStatus.REJECT,
];

/**
 * 반품회수방법 type
 */
export const ReturnMethodType = {
  USER: 'USER',
  SHOP: 'SHOP',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReturnMethodType = typeof ReturnMethodType[keyof typeof ReturnMethodType];

export const ReturnMethodTypeLabel: {
  [k in ReturnMethodType]: string;
} = {
  [ReturnMethodType.USER]: '고객 직접 발송',
  [ReturnMethodType.SHOP]: '자동 반품 요청',
};

/**
 * 반품요청 타입
 */
export const ReturnRequestType = {
  REJECT: 'REJECT',
  WITHDRAW: 'WITHDRAW',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReturnRequestType = typeof ReturnRequestType[keyof typeof ReturnRequestType];

export const ReturnRequestTypeLabel: {
  [k in ReturnRequestType]: string;
} = {
  [ReturnRequestType.REJECT]: '요청 거부',
  [ReturnRequestType.WITHDRAW]: '요청 철회',
};

/**
 * 반품거부 사유 목록
 */
export const ReturnRejectReasonItems = [
  '구매자의 사유로 제품이 훼손됨',
  '구매자의 사용 또는 소비로 제품의 가치가 현저히 감소됨',
  '시간이 지나 다시 판매하기 곤란할 정도로 제품 가치가 감소함 ',
  '복제가 가능한 제품의 포장을 훼손함 ',
  '디지털 콘텐츠 제품이 이미 게시되었거나 포장이 훼손됨',
  '기타',
];

/**
 * 반품철회 사유 목록
 */
export const ReturnWithdrawReasonItems = ['고객 철회 요청', '기타'];

/**
 * 반품/교환 타입
 */
export const OrderSearchReturnType = {
  RETURN: 'RETURN',
  EXCHANGE: 'EXCHANGE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderSearchReturnType = typeof OrderSearchReturnType[keyof typeof OrderSearchReturnType];

export const OrderSearchReturnTypeLabel: {
  [k in OrderSearchReturnType]: string;
} = {
  RETURN: '반품',
  EXCHANGE: '교환',
};

/**
 * 주문 반품 엑셀 코드
 */
export const OrderReturnExcelCode = {
  index: 'No',
  id: '반품번호',
  exportId: '출고번호',
  orderId: '주문번호',
  providerName: '입점사명',
  goodsName: '상품명',
  itemOptionList: '옵션',
  returnEa: '반품수량',
  ordererName: '주문자명',
  recipientName: '받는사람이름',
  recipientPhone: '받는사람연락처',
  orderPaymentDateText: '주문결제 완료일',
  type: '반품종류',
  status: '반품종류',
  createdDateText: '반품접수일',
  completedDateText: '반품완료일',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderReturnExcelCode = typeof OrderReturnExcelCode[keyof typeof OrderReturnExcelCode];
