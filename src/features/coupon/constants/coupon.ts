/**
 * 쿠폰 리스트 조회 query key
 */
export const couponListQueryKey = 'coupon/list';

/**
 * 쿠폰 조회 query key
 */
export const couponItemQueryKey = 'coupon/item';

export const defaultSearchPage = '1';
export const defaultSearchSize = '10';
export const defaultSearchSort = 'id,DESC';

/**
 * 쿠폰 사용 타입
 */
export const CouponUseType = {
  GOODS: 'GOODS',
  CART: 'CART',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponUseType = typeof CouponUseType[keyof typeof CouponUseType];

export const CouponUseTypeLabel: {
  [k in CouponUseType]: string;
} = {
  GOODS: '상품',
  CART: '장바구니',
};

/**
 * 쿠폰 발급 타입
 */
export const CouponIssueType = {
  DOWNLOAD: 'DOWNLOAD',
  DOWNLOAD_FIRST_PURCHASE: 'DOWNLOAD_FIRST_PURCHASE',
  WELCOME: 'WELCOME',
  KEYWORD: 'KEYWORD',
  EVENT: 'EVENT',
  SHOWROOM: 'SHOWROOM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponIssueType = typeof CouponIssueType[keyof typeof CouponIssueType];

export const CouponIssueTypeLabel: {
  [k in CouponIssueType]: string;
} = {
  DOWNLOAD: '다운로드',
  DOWNLOAD_FIRST_PURCHASE: '다운로드(첫구매)',
  WELCOME: '웰컴(회원가입)',
  KEYWORD: '키워드입력',
  EVENT: '대상지정쿠폰',
  SHOWROOM: '쇼룸 팔로우',
};

/**
 * 쿠폰 할인 타입
 */
export const CouponCostType = {
  PERCENT: 'PERCENT',
  WON: 'WON',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponCostType = typeof CouponCostType[keyof typeof CouponCostType];

export const CouponCostTypeLabel: {
  [k in CouponCostType]: string;
} = {
  PERCENT: '%',
  WON: '원',
};

/**
 * 쿠폰 적용기간 타입
 */
export const CouponIssuePeriodType = {
  DAY: 'DAY',
  PERIOD: 'PERIOD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponIssuePeriodType = typeof CouponIssuePeriodType[keyof typeof CouponIssuePeriodType];

export const CouponIssuePeriodTypeLabel: {
  [k in CouponIssuePeriodType]: string;
} = {
  DAY: '발급일 기준',
  PERIOD: '기간',
};

/**
 * 정책 탭
 */
export const PolicyTab = {
  /** 쿠폰적용 */
  INCLUSION: 'INCLUSION',
  /** 쿠폰제외 */
  EXCLUSION: 'EXCLUSION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PolicyTab = typeof PolicyTab[keyof typeof PolicyTab];

/**
 * 정책 탭
 */
export const CouponInclusionTargetTab = {
  /** 카테고리 */
  CATEGORY: 'CATEGORY',
  /** 입점사 */
  PROVIDER: 'PROVIDER',
  /** 상품 */
  GOODS: 'GOODS',
  /** 브랜드 */
  BRAND: 'BRAND',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponInclusionTargetTab = typeof CouponInclusionTargetTab[keyof typeof CouponInclusionTargetTab];

/**
 * Tab orientation
 */
export const TabOrientation = {
  /** 가로 */
  HORIZONTAL: 'horizontal',
  /** 세로 */
  VERTICAL: 'vertical',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TabOrientation = typeof TabOrientation[keyof typeof TabOrientation];

/**
 * 쿠폰 전체적용 여부
 */
export const AllowType = {
  /** 전체적용 */
  ALL: 'ALL',
  /** 조건별적용 */
  CASE: 'CASE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AllowType = typeof AllowType[keyof typeof AllowType];

export const AllowTypeLabel: {
  [k in AllowType]: string;
} = {
  ALL: '전체적용',
  CASE: '조건별적용',
};

/**
 * 쿠폰 허용 item type
 */
export const AllowItemType = {
  /** 허용 카테고리 */
  ALLOW_CATEGORY: 'ALLOW_CATEGORY',
  /** 허용 입점사 */
  ALLOW_PROVIDER: 'ALLOW_PROVIDER',
  /** 허용 상품 */
  ALLOW_GOODS: 'ALLOW_GOODS',
  /** 허용 브랜드 */
  ALLOW_BRAND: 'ALLOW_BRAND',
  /** 미허용 상품 */
  DENY_GOODS: 'DENY_GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AllowItemType = typeof AllowItemType[keyof typeof AllowItemType];

/**
 * 쿠폰 발급갯수 제한 type
 */
export const DownloadLimitType = {
  LIMIT: 'LIMIT',
  UNLIMIT: 'UNLIMIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DownloadLimitType = typeof DownloadLimitType[keyof typeof DownloadLimitType];

export const DownloadLimitTypeLabel: {
  [k in DownloadLimitType]: string;
} = {
  LIMIT: '제한있음',
  UNLIMIT: '제한없음',
};

/**
 * 최소 주문금액 제한여부
 */
export const MinPurchasePriceLimit = {
  LIMIT: 'LIMIT',
  UNLIMIT: 'UNLIMIT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MinPurchasePriceLimit = typeof MinPurchasePriceLimit[keyof typeof MinPurchasePriceLimit];

export const MinPurchasePriceLimitLabel: {
  [k in MinPurchasePriceLimit]: string;
} = {
  LIMIT: '있음',
  UNLIMIT: '없음',
};

/**
 * Coupon page type
 */
export const CouponPageType = {
  CREATE: 'CREATE',
  MODIFY: 'MODIFY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponPageType = typeof CouponPageType[keyof typeof CouponPageType];

export const CouponPageTypeLabel: {
  [k in CouponPageType]: string;
} = {
  CREATE: '등록',
  MODIFY: '수정',
};

/**
 * Date Type
 */
export const DateType = {
  START: 'START',
  END: 'END',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DateType = typeof DateType[keyof typeof DateType];

export const CouponTimesArray: {
  [k in DateType]: Array<number>;
} = {
  START: [10, 0, 0],
  END: [23, 59, 59],
};

export const eventCouponExcelHeader = ['사용자 ID'];

/**
 * 이벤트 쿠폰 엑셀 코드
 */
export const EventCouponExcelCode = {
  userId: '사용자 ID',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EventCouponExcelCode = typeof EventCouponExcelCode[keyof typeof EventCouponExcelCode];

/**
 * 쿠폰 상품검색 type
 */
export const CouponGoodsSearchType = {
  NAME: 'NAME',
  ID: 'ID',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponGoodsSearchType = typeof CouponGoodsSearchType[keyof typeof CouponGoodsSearchType];

export const CouponGoodsSearchTypeLabel: {
  [k in CouponGoodsSearchType]: string;
} = {
  NAME: '상품명',
  ID: 'ID',
};

/**
 * 쿠폰 발급 타입 옵션
 */
export const CouponIssueTypeOptions = [
  {
    label: CouponIssueTypeLabel[CouponIssueType.DOWNLOAD],
    value: CouponIssueType.DOWNLOAD,
  },
  {
    label: CouponIssueTypeLabel[CouponIssueType.DOWNLOAD_FIRST_PURCHASE],
    value: CouponIssueType.DOWNLOAD_FIRST_PURCHASE,
  },
  { label: CouponIssueTypeLabel[CouponIssueType.WELCOME], value: CouponIssueType.WELCOME },
  { label: CouponIssueTypeLabel[CouponIssueType.EVENT], value: CouponIssueType.EVENT },
  {
    label: CouponIssueTypeLabel[CouponIssueType.SHOWROOM],
    value: CouponIssueType.SHOWROOM,
  },
  {
    label: CouponIssueTypeLabel[CouponIssueType.KEYWORD],
    value: CouponIssueType.KEYWORD,
  },
];
