/**
 * 상품 검색 타입
 */
export const GoodsSearchType = {
  ALL: 'ALL',
  ID: 'ID',
  NAME: 'NAME',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsSearchType = typeof GoodsSearchType[keyof typeof GoodsSearchType];

export const GoodsSearchTypeLabel: {
  [k in GoodsSearchType]: string;
} = {
  [GoodsSearchType.ALL]: '전체',
  [GoodsSearchType.ID]: '상품ID',
  [GoodsSearchType.NAME]: '상품명',
};

/**
 * 상품상태
 */
export const GoodsStatus = {
  ALL: 'ALL',
  NORMAL: 'NORMAL',
  RUNOUT: 'RUNOUT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsStatus = typeof GoodsStatus[keyof typeof GoodsStatus];

export const GoodsStatusLabel: {
  [k in GoodsStatus]: string;
} = {
  [GoodsStatus.ALL]: '전체',
  [GoodsStatus.NORMAL]: '판매중',
  [GoodsStatus.RUNOUT]: '품절',
};

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
  [GoodsType.NORMAL]: '일반',
  [GoodsType.AUCTION]: '경매',
  [GoodsType.PREORDER]: '프리오더',
};

/**
 * 서비스 노출 상태
 */
export const DisplayStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DisplayStatus = typeof DisplayStatus[keyof typeof DisplayStatus];

export const DisplayStatusLabel: {
  [k in DisplayStatus]: string;
} = {
  [DisplayStatus.OPEN]: '노출중',
  [DisplayStatus.CLOSE]: '비노출',
};
