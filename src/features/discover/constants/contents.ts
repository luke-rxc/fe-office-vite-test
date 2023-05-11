export const CONTENTS_DEFAULT_PAGE = 1;
export const CONTENTS_DEFAULT_LIMIT = 10;

/**
 * 콘텐츠 검색 타입
 */
export const ContentsSearchType = {
  ALL: 'ALL',
  ID: 'ID',
  STORY_NAME: 'STORY_NAME',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentsSearchType = typeof ContentsSearchType[keyof typeof ContentsSearchType];

export const ContentsSearchTypeLabel: {
  [k in ContentsSearchType]: string;
} = {
  [ContentsSearchType.ALL]: '전체',
  [ContentsSearchType.ID]: '콘텐츠ID',
  [ContentsSearchType.STORY_NAME]: '콘텐츠명',
};

/**
 * 콘텐츠 상태
 */
export const ContentsStatus = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  ADMIN_PUBLIC: 'ADMIN_PUBLIC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentsStatus = typeof ContentsStatus[keyof typeof ContentsStatus];

export const ContentsStatusLabel: {
  [k in ContentsStatus]: string;
} = {
  [ContentsStatus.PUBLIC]: '공개',
  [ContentsStatus.PRIVATE]: '비공개',
  [ContentsStatus.ADMIN_PUBLIC]: '관리자 공개',
};

/**
 * 컨텐츠 타입
 */
export const ContentsType = {
  STORY: 'STORY',
  TEASER: 'TEASER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentsType = typeof ContentsType[keyof typeof ContentsType];

export const ContentsTypeLabel: {
  [k in ContentsType]: string;
} = {
  [ContentsType.STORY]: '스토리',
  [ContentsType.TEASER]: '라이브 티저',
};
