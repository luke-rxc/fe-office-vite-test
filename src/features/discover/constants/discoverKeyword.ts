export const KEYWORD_DEFAULT_PAGE = 1;
export const KEYWORD_DEFAULT_LIMIT = 10;

export const DiscoverKeywordQueryKeys = {
  all: [{ scope: 'discover-keyword' }] as const,
  lists: () => [{ ...DiscoverKeywordQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: any) => [{ ...DiscoverKeywordQueryKeys.lists()[0], params }] as const,
  detail: (keywordId: string) => [{ ...DiscoverKeywordQueryKeys.all[0], entity: 'detail', keywordId }] as const,
} as const;

/**
 * 디스커버 키워드 상태
 */
export const DiscoverKeywordStatus = {
  ALL: 'ALL',
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverKeywordStatus = typeof DiscoverKeywordStatus[keyof typeof DiscoverKeywordStatus];

export const DiscoverKeywordStatusLabel: {
  [k in DiscoverKeywordStatus]: string;
} = {
  [DiscoverKeywordStatus.ALL]: '전체',
  [DiscoverKeywordStatus.PUBLIC]: '공개중',
  [DiscoverKeywordStatus.PRIVATE]: '비공개',
};

/**
 * 디스커버 키워드 상태 옵션
 */
export const DiscoverKeywordStatusOptions = Object.keys(DiscoverKeywordStatus)
  .filter((key) => key !== DiscoverKeywordStatus.ALL)
  .map((key) => {
    return {
      label: DiscoverKeywordStatusLabel[key],
      value: DiscoverKeywordStatus[key],
    };
  });

/**
 * 디스커버 키워드 맵핑 타입
 */
export const DiscoverKeywordMappingType = {
  GOODS: 'GOODS',
  SHOWROOM: 'SHOWROOM',
  CONTENTS: 'CONTENTS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverKeywordMappingType = typeof DiscoverKeywordMappingType[keyof typeof DiscoverKeywordMappingType];

export const DiscoverKeywordMappingTypeLabel: {
  [k in DiscoverKeywordMappingType]: string;
} = {
  [DiscoverKeywordMappingType.GOODS]: '상품',
  [DiscoverKeywordMappingType.SHOWROOM]: '쇼룸',
  [DiscoverKeywordMappingType.CONTENTS]: '콘텐츠',
};

/**
 * 디스커버 키워드 일괄등록 엑셀 코드
 */
export const DiscoverKeywordRegistExcelCode = {
  [DiscoverKeywordMappingType.GOODS]: { id: '상품ID' },
  [DiscoverKeywordMappingType.SHOWROOM]: { id: '쇼룸ID' },
  [DiscoverKeywordMappingType.CONTENTS]: { id: '콘텐츠ID' },
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverKeywordRegistExcelCode =
  typeof DiscoverKeywordRegistExcelCode[keyof typeof DiscoverKeywordRegistExcelCode];
