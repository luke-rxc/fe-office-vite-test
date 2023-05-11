import { OrderExportTicketListSearchParams } from '../types';

/**
 *  출고(티켓) query keys
 */
export const OrderExportTicketQueryKeys = {
  all: [{ scope: 'order-export-ticket' }] as const,
  list: (params: OrderExportTicketListSearchParams) =>
    [{ ...OrderExportTicketQueryKeys.all[0], entity: 'list', params }] as const,
} as const;

/**
 * 출고(티켓) 상태
 */
export const OrderExportTicketStatus = {
  STANDBY: 'standby',
  ISSUED: 'issued',
  USED: 'used',
  CANCELED: 'canceled',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportTicketStatus = typeof OrderExportTicketStatus[keyof typeof OrderExportTicketStatus];

export const OrderExportTicketStatusLabel: {
  [k in OrderExportTicketStatus]: string;
} = {
  [OrderExportTicketStatus.STANDBY]: '결제완료',
  [OrderExportTicketStatus.ISSUED]: '미사용',
  [OrderExportTicketStatus.USED]: '사용완료',
  [OrderExportTicketStatus.CANCELED]: '취소완료',
};

/**
 * 출고(티켓) 타입
 */
export const OrderExportTicketGoodsKind = {
  TICKET_NORMAL: 'ticket_normal',
  TICKET_AGENT: 'ticket_agent',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportTicketGoodsKind = typeof OrderExportTicketGoodsKind[keyof typeof OrderExportTicketGoodsKind];

export const OrderExportTicketGoodsKindLabel: {
  [k in OrderExportTicketGoodsKind]: string;
} = {
  [OrderExportTicketGoodsKind.TICKET_NORMAL]: '일반',
  [OrderExportTicketGoodsKind.TICKET_AGENT]: '연동',
};

/**
 * 출고(티켓) 상태 옵션
 */
export const ExportTicketStatusOptions: Array<OrderExportTicketStatus> = [
  OrderExportTicketStatus.STANDBY,
  OrderExportTicketStatus.ISSUED,
  OrderExportTicketStatus.USED,
  OrderExportTicketStatus.CANCELED,
];
/**
 *  출고(티켓) 타입 옵션
 */
export const ExportTicketGoodsKindOptions: Array<OrderExportTicketGoodsKind> = [
  OrderExportTicketGoodsKind.TICKET_NORMAL,
  OrderExportTicketGoodsKind.TICKET_AGENT,
];

/**
 * 출고(티켓) action type
 */
export const ExportTicketActionType = {
  ENABLE_CHANGE_USED: 'ENABLE_CHANGE_USED',
  ENABLE_CHANGE_UNUSED: 'ENABLE_CHANGE_UNUSED',
  ENABLE_CHANGE_ALL_USED: 'ENABLE_CHANGE_ALL_USED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ExportTicketActionType = typeof ExportTicketActionType[keyof typeof ExportTicketActionType];

/**
 * 주문 출고(티켓) 엑셀 코드
 */
export const OrderExportTicketExcelCode = {
  index: 'No',
  id: '출고번호',
  orderId: '주문번호',
  providerName: '입점사명',
  goodsName: '상품명',
  quantity: '수량',
  itemOptionList: '옵션',
  price: '판매가격',
  commissionPrice: '입금가',
  goodsCouponSale: '쿠폰할인금액(상품)',
  cartCouponSale: '쿠폰할인금액(장바구니)',
  priceExcludeCouponSale: '결제금액',
  ordererName: '주문자명',
  recipientName: '받는사람 이름',
  recipientPhone: '받는사람 연락처',
  orderPaymentDateText: '주문 결제완료일',
  usableStartDateText: '티켓 사용 시작일',
  usableEndDateText: '티켓 사용 종료일',
  exportTicketStatus: '티켓 상태',
  returnStatusName: '반품 상태',
  usedDateText: '티켓 사용일',
  goodsKind: '티켓 타입',
  bookingDateText: '투숙일',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportTicketExcelCode = typeof OrderExportTicketExcelCode[keyof typeof OrderExportTicketExcelCode];

/**
 * 주문 출고 상태변경 엑셀 코드
 */
export const OrderExportTicketStatusChangeExcelCode = {
  exportId: '출고번호',
  orderId: '주문번호',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportTicketStatusChangeExcelCode =
  typeof OrderExportTicketStatusChangeExcelCode[keyof typeof OrderExportTicketStatusChangeExcelCode];

/**
 * 주문 출고 투숙일지정 엑셀 코드
 */
export const OrderExportTicketBookingDateChangeExcelCode = {
  exportId: '출고번호',
  orderId: '주문번호',
  bookingDate: '투숙일',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportTicketBookingDateChangeExcelCode =
  typeof OrderExportTicketBookingDateChangeExcelCode[keyof typeof OrderExportTicketBookingDateChangeExcelCode];
