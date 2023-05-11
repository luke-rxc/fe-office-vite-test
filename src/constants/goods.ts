/**
 * 상품배송정책
 */
export const LimitType = {
  IFPAY: 'IFPAY',
  LIMIT: 'LIMIT',
  UNLIMIT: 'UNLIMIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LimitType = typeof LimitType[keyof typeof LimitType];

export const LimitTypeLabel: {
  [k in LimitType]: string;
} = {
  IFPAY: '조건부 무료 정책',
  LIMIT: '상품수량별 유료 (배송비 반복부과) 정책',
  UNLIMIT: '유료 (상품수량 제한없는) 정책',
};

/**
 * 상품상태
 */
export const GoodsStatus = {
  NORMAL: 'NORMAL',
  RUNOUT: 'RUNOUT',
  UNSOLD: 'UNSOLD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsStatus = typeof GoodsStatus[keyof typeof GoodsStatus];

export const GoodsStatusLabel: {
  [k in GoodsStatus]: string;
} = {
  NORMAL: '판매중',
  RUNOUT: '품절',
  UNSOLD: '판매중지',
};

/**
 * 배송정책
 */
export const GoodsShippingPolicy = {
  GOODS: 'GOODS',
  SHOP: 'SHOP',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsShippingPolicy = typeof GoodsShippingPolicy[keyof typeof GoodsShippingPolicy];

export const GoodsShippingPolicyLabel: {
  [k in GoodsShippingPolicy]: string;
} = {
  GOODS: '개별배송',
  SHOP: '묶음배송',
};

/**
 * 배송방법
 */
export const GoodsShippingMethod = {
  PARCEL: 'PARCEL',
  DIRECT: 'DIRECT',
  MOBILE: 'MOBILE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsShippingMethod = typeof GoodsShippingMethod[keyof typeof GoodsShippingMethod];

export const GoodsShippingMethodLabel: {
  [k in GoodsShippingMethod]: string;
} = {
  PARCEL: '택배',
  DIRECT: '직접배송',
  MOBILE: '모바일',
};

/**
 * 상품분류
 */
export const GoodsKind = {
  REAL: 'REAL',
  TICKET_NORMAL: 'TICKET_NORMAL',
  TICKET_AGENT: 'TICKET_AGENT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsKind = typeof GoodsKind[keyof typeof GoodsKind];

export const GoodsKindLabel: {
  [k in GoodsKind]: string;
} = {
  REAL: '실물',
  TICKET_NORMAL: '티켓_일반',
  TICKET_AGENT: '티켓_연동',
};

/**
 * 한정 수향
 */
export const PurchaseLimitedType = {
  NONE: 'NONE',
  GOODS: 'GOODS',
  OPTION: 'OPTION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PurchaseLimitedType = ValueOf<typeof PurchaseLimitedType>;

export const PurchaseLimitedTypeLabel: {
  [k in PurchaseLimitedType]: string;
} = {
  NONE: '기본값(가용재고)',
  GOODS: '상품단위',
  OPTION: '옵션(초기수량)',
};

/**
 * 티켓 타입
 */
export const TicketType = {
  MONEY: 'MONEY',
  BOOKING_DATED: 'BOOKING_DATED',
  EXCHANGE: 'EXCHANGE',
  BOOKING_UNDATED: 'BOOKING_UNDATED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TicketType = ValueOf<typeof TicketType>;

export const TicketTypeLabel: {
  [k in TicketType]: string;
} = {
  MONEY: '금액권',
  BOOKING_DATED: '숙박권_날짜지정',
  EXCHANGE: '교환권',
  BOOKING_UNDATED: '숙박권_날짜미지정',
};

// 정산방식 타입
export const SettlementKindType = {
  /** 수수료 */
  COMMISSION: 'COMMISSION',
  /** 사입 */
  BUYING: 'BUYING',
  /** 입금가 */
  DEPOSIT: 'DEPOSIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SettlementKindType = ValueOf<typeof SettlementKindType>;

export const SettlementKindTypeLabel: {
  [k in SettlementKindType]: string;
} = {
  COMMISSION: '수수료',
  BUYING: '사입',
  DEPOSIT: '입금가',
};

// 부가세 코드 타입
export const VatCodeType = {
  /** 과세 */
  TAXATION: 'TAXATION',
  /** 면세 */
  TAX_EXEMPTION: 'TAX_EXEMPTION',
  /** 영세 */
  ZERO_TAX: 'ZERO_TAX',
  /** 비과세 */
  TAX_FREE: 'TAX_FREE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VatCodeType = ValueOf<typeof VatCodeType>;

export const VatCodeTypeLabel: {
  [k in VatCodeType]: string;
} = {
  TAXATION: '과세',
  TAX_EXEMPTION: '면세',
  ZERO_TAX: '영세',
  TAX_FREE: '비과세',
};
