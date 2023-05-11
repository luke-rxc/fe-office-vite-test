export const SHOWROOM_DEFAULT_PAGE = 1;
export const SHOWROOM_DEFAULT_LIMIT = 10;

/**
 * 쇼룸 검색 타입
 */
export const ShowroomSearchType = {
  ALL: 'ALL',
  NAME: 'NAME',
  ID: 'ID',
  CODE: 'CODE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowroomSearchType = typeof ShowroomSearchType[keyof typeof ShowroomSearchType];

export const ShowroomSearchTypeLabel: {
  [k in ShowroomSearchType]: string;
} = {
  [ShowroomSearchType.ALL]: '전체',
  [ShowroomSearchType.NAME]: '쇼룸명',
  [ShowroomSearchType.ID]: '쇼룸ID',
  [ShowroomSearchType.CODE]: '쇼룸코드',
};

/**
 * 쇼룸 상태
 */
export const ShowroomStatus = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  ADMIN_PUBLIC: 'ADMIN_PUBLIC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowroomStatus = typeof ShowroomStatus[keyof typeof ShowroomStatus];

export const ShowroomStatusLabel: {
  [k in ShowroomStatus]: string;
} = {
  [ShowroomStatus.PUBLIC]: '공개',
  [ShowroomStatus.PRIVATE]: '비공개',
  [ShowroomStatus.ADMIN_PUBLIC]: '관리자 공개',
};

/**
 * 쇼룸 타입
 */
export const ShowroomType = {
  NORMAL: 'NORMAL',
  PGM: 'PGM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowroomType = typeof ShowroomType[keyof typeof ShowroomType];

export const ShowroomTypeLabel: {
  [k in ShowroomType]: string;
} = {
  [ShowroomType.NORMAL]: '일반',
  [ShowroomType.PGM]: 'PGM',
};
