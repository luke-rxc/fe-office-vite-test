import { OrderListSearchParams, OrderLogParams } from '../types';

// 기본 page number
export const OrderDefaultSearchPage = '1';
// 기본 page size
export const OrderDefaultSearchSize = '10';

/**
 * 주문 query keys
 */
export const OrderQueryKeys = {
  all: [{ scope: 'order' }] as const,
  lists: () => [{ ...OrderQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: OrderListSearchParams) => [{ ...OrderQueryKeys.lists()[0], params }] as const,
  details: (orderId: string) => [{ ...OrderQueryKeys.all[0], entity: 'details', orderId }] as const,
  detail: (orderId: string) => [{ ...OrderQueryKeys.details(orderId)[0], subEntry: 'detail' }] as const,
  detailCommon: (orderId: string) => [{ ...OrderQueryKeys.details(orderId)[0], subEntry: 'detail-common' }] as const,
  log: ({ orderId, ...params }: OrderLogParams) =>
    [{ ...OrderQueryKeys.details(orderId)[0], subEntry: 'log', params }] as const,
} as const;

/**
 * 주문 목록 검색 타입
 */
export const OrderSearchFieldType = {
  ORDER: 'ORDER',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderSearchFieldType = typeof OrderSearchFieldType[keyof typeof OrderSearchFieldType];

export const OrderSearchFieldTypeLabel: {
  [k in OrderSearchFieldType]: string;
} = {
  ORDER: '주문정보',
  GOODS: '상품정보',
};

export const OrderSearchFieldTypePlaceholder: {
  [k in OrderSearchFieldType]: string;
} = {
  ORDER: '주문번호, 주문자명, 주문자 연락처, 아이디',
  GOODS: '상품명, 상품코드',
};

/**
 * 주문상태
 */
export const OrderStatus = {
  TRIED: '0',
  PAY_WAITING: '10',
  PAID: '20',
  PREPARING_GOODS: '30',
  PARTIALLY_READY_FOR_EXPORT: '35',
  READY_FOR_EXPORT: '40',
  PARTIALLY_EXPORTED: '45',
  EXPORTED: '50',
  PARTIALLY_IN_SHIPPING: '55',
  IN_SHIPPING: '60',
  PARTIALLY_SHIPPING_COMPLETED: '65',
  SHIPPING_COMPLETED: '70',
  PAYMENT_CANCELED: '80',
  ORDER_INVALIDATED: '90',
  ORDER_FAILED: '99',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusLabel: {
  [k in OrderStatus]: string;
} = {
  [OrderStatus.TRIED]: '주문중',
  [OrderStatus.PAY_WAITING]: '입금대기',
  [OrderStatus.PAID]: '결제완료',
  [OrderStatus.PREPARING_GOODS]: '상품준비',
  [OrderStatus.PARTIALLY_READY_FOR_EXPORT]: '부분출고준비',
  [OrderStatus.READY_FOR_EXPORT]: '출고준비',
  [OrderStatus.PARTIALLY_EXPORTED]: '부분출고완료',
  [OrderStatus.EXPORTED]: '출고완료',
  [OrderStatus.PARTIALLY_IN_SHIPPING]: '부분배송중',
  [OrderStatus.IN_SHIPPING]: '배송중',
  [OrderStatus.PARTIALLY_SHIPPING_COMPLETED]: '부분배송완료',
  [OrderStatus.SHIPPING_COMPLETED]: '배송완료',
  [OrderStatus.PAYMENT_CANCELED]: '결제취소',
  [OrderStatus.ORDER_INVALIDATED]: '주문무효',
  [OrderStatus.ORDER_FAILED]: '결제실패',
};

/**
 * 주문상태 옵션 (출고전)
 */
export const OrderStatusBeforeExportOptions: Array<OrderStatus> = [
  OrderStatus.PAID,
  OrderStatus.PREPARING_GOODS,
  OrderStatus.PARTIALLY_READY_FOR_EXPORT,
  OrderStatus.READY_FOR_EXPORT,
];

/**
 * 주문상태 옵션 (출고후)
 */
export const OrderStatusAfterExportOptions: Array<OrderStatus> = [
  OrderStatus.PARTIALLY_IN_SHIPPING,
  OrderStatus.IN_SHIPPING,
  OrderStatus.PARTIALLY_SHIPPING_COMPLETED,
  OrderStatus.SHIPPING_COMPLETED,
];

/**
 * 주문상태 옵션 (출고가능)
 */
export const OrderStatusExportableOptions: Array<OrderStatus> = [
  OrderStatus.PREPARING_GOODS,
  OrderStatus.PARTIALLY_READY_FOR_EXPORT,
  OrderStatus.PARTIALLY_IN_SHIPPING,
  OrderStatus.PARTIALLY_SHIPPING_COMPLETED,
];

/**
 * 상품타입
 */
export const GoodsType = {
  NORMAL: 'NORMAL',
  AUCTION: 'AUCTION',
  PREORDER: 'PREORDER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsType = typeof GoodsType[keyof typeof GoodsType];

export const GoodsTypeLabel: {
  [k in GoodsType]: string;
} = {
  NORMAL: '일반',
  AUCTION: '경매',
  PREORDER: '프리오더',
};

/**
 * 배송방법
 */
export const ShippingMethodType = {
  DIRECT: 'DIRECT',
  PARCEL: 'PARCEL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShippingMethodType = typeof ShippingMethodType[keyof typeof ShippingMethodType];

export const ShippingMethodTypeLabel: {
  [k in ShippingMethodType]: string;
} = {
  DIRECT: '직접배송',
  PARCEL: '택배배송',
};

/**
 * 결제방법
 */
export const OrderPaymentType = {
  CREDIT_CARD: 'CREDIT_CARD',
  PRIZM_PAY: 'PRIZM_PAY',
  POINT: 'POINT',
  KAKAO_PAY: 'KAKAO_PAY',
  NAVER_PAY: 'NAVER_PAY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderPaymentType = typeof OrderPaymentType[keyof typeof OrderPaymentType];

export const OrderPaymentTypeLabel: {
  [k in OrderPaymentType]: string;
} = {
  CREDIT_CARD: '카드',
  PRIZM_PAY: 'prizm 페이',
  POINT: '포인트',
  KAKAO_PAY: '카카오페이',
  NAVER_PAY: '네이버페이',
};

/**
 * 주문 action type
 */
export const OrderActionType = {
  PREPARING_GOODS: 'PREPARING_GOODS',
  PAID: 'PAID',
  DOWNLOAD: 'DOWNLOAD',
  UPLOAD: 'UPLOAD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderActionType = typeof OrderActionType[keyof typeof OrderActionType];

/**
 * 주문 요청 타입
 */
export const OrderRequestType = {
  REFUND: 'REFUND',
  RETURN: 'RETURN',
  EXCHANGE: 'EXCHANGE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderRequestType = typeof OrderRequestType[keyof typeof OrderRequestType];

export const OrderRequestTypeLabel: {
  [k in OrderRequestType]: string;
} = {
  [OrderRequestType.REFUND]: '취소 요청',
  [OrderRequestType.RETURN]: '반품 요청',
  [OrderRequestType.EXCHANGE]: '교환 요청',
};

/**
 * Section Type
 */
export const SectionType = {
  MAIN: 'MAIN',
  SUB: 'SUB',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SectionType = typeof SectionType[keyof typeof SectionType];

/**
 * 주문 메모 도메인 타입
 */
export const OrderMemoDomainType = {
  ORDER: 'ORDER',
  EXPORT: 'EXPORT',
  REFUND: 'REFUND',
  RETURN: 'RETURN',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderMemoDomainType = typeof OrderMemoDomainType[keyof typeof OrderMemoDomainType];

/**
 * 주문 출고가능 엑셀 코드
 */
export const OrderExportPrepareExcelCode = {
  index: 'No',
  orderId: '주문번호',
  orderItemOptionId: '주문옵션 번호',
  shippingId: '출고지 번호',
  paymentDate: '주문일',
  email: '주문자이메일',
  userName: '주문자명',
  phone: '주문자연락처',
  pcccNumber: '개인통관고유부호',
  deliveryRequestMessage: '사용자메모',
  recipientUserName: '수령인',
  recipientPhone: '수령인연락처',
  recipientPostCode: '배송지우편번호',
  recipientAddress: '배송지주소',
  recipientAddressDetail: '배송지 주소 상세',
  goodsId: '상품번호',
  goodsName: '상품명',
  goodsOptionName: '옵션명',
  goodsOptionId: '관리코드',
  consumerPrice: '소비자가격',
  price: '판매가격',
  amount: '결제금액',
  shippingCost: '배송비',
  shippingMethod: '배송방법',
  partnerExportCode: '출고명',
  ea: '출고예정수량',
  exportEa: '출고수량',
  deliveryCompanyName: '택배사',
  deliveryNumber: '운송장번호',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExportPrepareExcelCode = typeof OrderExportPrepareExcelCode[keyof typeof OrderExportPrepareExcelCode];

/**
 * 주문공통 사용 서비스 타입
 */
export const UsedServiceType = {
  ORDER: 'ORDER',
  EXPORT: 'EXPORT',
  RETURN: 'RETURN',
  REFUND: 'REFUND',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UsedServiceType = typeof UsedServiceType[keyof typeof UsedServiceType];

/**
 * 주문 엑셀 코드
 */
export const OrderExcelCode = {
  index: 'No',
  paymentDateText: '주문일',
  orderId: '주문번호',
  goodsName: '주문상품',
  quantity: '수량',
  recipientName: '받는분',
  ordererName: '주문자',
  paymentTypeName: '결제',
  orderStatus: '처리상태',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderExcelCode = typeof OrderExcelCode[keyof typeof OrderExcelCode];
