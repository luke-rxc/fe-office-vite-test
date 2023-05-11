/**
 * 상품 판매상태
 */
export const DEAL_SALE_STATUS = {
  NORMAL: 'NORMAL', // 판매중
  RUNOUT: 'RUNOUT', // 품절
  //UNSOLD: 'UNSOLD', // 판매중지
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DEAL_SALE_STATUS = typeof DEAL_SALE_STATUS[keyof typeof DEAL_SALE_STATUS];

export const DEAL_SALE_STATUS_LABEL: {
  [k in DEAL_SALE_STATUS]: string;
} = {
  NORMAL: '판매중',
  RUNOUT: '품절',
  //UNSOLD: '판매중지',
};

/**
 * 상품 타입 옵션
 */
export const DEAL_SALE_STATUS_OPTIONS = Object.keys(DEAL_SALE_STATUS).map((key) => {
  return {
    label: DEAL_SALE_STATUS_LABEL[key],
    value: DEAL_SALE_STATUS[key],
  };
});

/**
 * 상품 타입
 */
export const DEAL_GOODS_TYPE = {
  NORMAL: 'NORMAL', // 일반상품
  AUCTION: 'AUCTION', // 경매상품
  PREORDER: 'PREORDER', // 프리오더
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DEAL_GOODS_TYPE = typeof DEAL_GOODS_TYPE[keyof typeof DEAL_GOODS_TYPE];

export const DEAL_GOODS_TYPE_LABEL: {
  [k in DEAL_GOODS_TYPE]: string;
} = {
  NORMAL: '일반', // 일반상품
  AUCTION: '경매', // 경매상품
  PREORDER: '프리오더', // 프리오더
};

/**
 * 상품 검색 유형
 */
export const GOODS_SEARCH_TYPE = {
  NAME: 'NAME',
  ID: 'ID',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GOODS_SEARCH_TYPE = typeof GOODS_SEARCH_TYPE[keyof typeof GOODS_SEARCH_TYPE];

export const GOODS_SEARCH_TYPE_LABEL: {
  [k in GOODS_SEARCH_TYPE]: string;
} = {
  NAME: '상품명',
  ID: '상품 ID',
};

/**
 * 검색어 타입 옵션
 */
export const GOODS_SEARCH_TYPE_OPTIONS = Object.keys(GOODS_SEARCH_TYPE).map((key) => {
  return {
    label: GOODS_SEARCH_TYPE_LABEL[key],
    value: GOODS_SEARCH_TYPE[key],
  };
});

/**
 * 상품 등록 가능 개수
 */
export const DEAL_GOODS_MAX_NUM = 20;

/**
 * 상품 조회 리스트 타입
 */
export const DEAL_GOODS_LIST_TYPE = {
  SEARCH_LIST: 'SEARCH_LIST', // 검색 조회에서 사용되는 상품 리스트 타입
  NORMAL: '', // 일반 상품 리스트 타입
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DEAL_GOODS_LIST_TYPE = typeof DEAL_GOODS_LIST_TYPE[keyof typeof DEAL_GOODS_LIST_TYPE];

/**
 * 상품 딜 컬럼타입
 */
export const DEAL_A_COLUMN_TYPE = {
  ONE_COLUMN: 'ONE_COLUMN', // 1단
  TWO_COLUMN: 'TWO_COLUMN', // 2단
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DEAL_A_COLUMN_TYPE = typeof DEAL_A_COLUMN_TYPE[keyof typeof DEAL_A_COLUMN_TYPE];

/**
 * 상품 A 타이틀 최대 길이
 */
export const DEAL_A_TITLE_MAX_NUM = 2000; // 16;

/**
 * 상품 A 서브 타이틀 최대 길이
 */
export const DEAL_A_SUBTITLE_MAX_NUM = 2000; // 30;

/**
 * 상품 A 디스크립션 최대 길이
 */
export const DEAL_A_DESC_MAX_NUM = 2000; // 95;

/**
 * 상품 B 타이틀 최대 길이
 */
export const DEAL_B_TITLE_MAX_NUM = 2000; // 16;

/**
 * 상품 B 서브 타이틀 최대 길이
 */
export const DEAL_B_SUBTITLE_MAX_NUM = 2000; // 30;

/**
 * 상품 B 디스크립션 최대 길이
 */
export const DEAL_B_DESC_MAX_NUM = 2000; // 95;
