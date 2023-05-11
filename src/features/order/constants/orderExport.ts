import { OrderStatus } from '.';
import { OrderExportListSearchParams } from '../types';

/**
 *  출고 query keys
 */
export const OrderExportQueryKeys = {
  all: [{ scope: 'order-export' }] as const,
  list: (params: OrderExportListSearchParams) => [{ ...OrderExportQueryKeys.all[0], entity: 'list', params }] as const,
  detail: (exportId: string) => [{ ...OrderExportQueryKeys.all[0], entity: 'detail', exportId }] as const,
} as const;

/**
 * 주문상태 옵션 (출고)
 */
export const OrderStatusExportOptions: Array<OrderStatus> = [
  OrderStatus.READY_FOR_EXPORT,
  OrderStatus.IN_SHIPPING,
  OrderStatus.SHIPPING_COMPLETED,
];

/**
 * 주문 출고 목록 검색 타입
 */
export const OrderExportSearchFieldType = {
  ORDER: 'ORDER',
  EXPORT: 'EXPORT',
  GOODS: 'GOODS',
  PARTNER_EXPORT_CODE: 'PARTNER_EXPORT_CODE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportSearchFieldType = typeof OrderExportSearchFieldType[keyof typeof OrderExportSearchFieldType];

export const OrderExportSearchFieldTypeLabel: {
  [k in OrderExportSearchFieldType]: string;
} = {
  ORDER: '주문정보',
  EXPORT: '출고번호',
  GOODS: '상품정보',
  PARTNER_EXPORT_CODE: '출고명',
};

export const OrderExportSearchFieldTypePlaceholder: {
  [k in OrderExportSearchFieldType]: string;
} = {
  ORDER: '주문번호, 주문자명, 주문자 연락처, 아이디',
  EXPORT: '',
  GOODS: '상품명, 상품코드',
  PARTNER_EXPORT_CODE: '',
};

/**
 * 주문 출고 엑셀 코드
 */
export const OrderExportExcelCode = {
  index: 'No',
  id: '출고번호',
  orderId: '주문번호',
  goodsName: '상품명',
  quantity: '수량/종',
  recipientName: '받는분',
  deliveryCompany: '배송',
  deliveryNumber: '운송장번호',
  exportedDate: '출고일',
  inShippingDate: '배송시작일',
  completeDate: '배송종료일',
  confirmDate: '구매확정일',
  exportStatus: '출고상태',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportExcelCode = typeof OrderExportExcelCode[keyof typeof OrderExportExcelCode];
