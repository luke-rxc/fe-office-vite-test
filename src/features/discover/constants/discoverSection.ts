import { TOption } from '@components/Select';

export const SECTION_DEFAULT_PAGE = 1;
export const SECTION_DEFAULT_LIMIT = 10;

export const DiscoverSectionQueryKeys = {
  all: [{ scope: 'discover-section' }] as const,
  lists: () => [{ ...DiscoverSectionQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: any) => [{ ...DiscoverSectionQueryKeys.lists()[0], params }] as const,
  registeredList: () => [{ ...DiscoverSectionQueryKeys.lists()[0], subEntity: 'registered-list' }] as const,
  detail: (sectionId: string) => [{ ...DiscoverSectionQueryKeys.all[0], entity: 'detail', sectionId }] as const,
  creatableType: () => [{ ...DiscoverSectionQueryKeys.all[0], entity: 'creatable-type' }] as const,
} as const;

/**
 * 디스커버 섹션 타입
 */
export const DiscoverSectionType = {
  GOODS: 'GOODS',
  SHOWROOM: 'SHOWROOM',
  STORY: 'STORY',
  LIVE: 'LIVE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverSectionType = typeof DiscoverSectionType[keyof typeof DiscoverSectionType];

export const DiscoverSectionTypeLabel: {
  [k in DiscoverSectionType]: string;
} = {
  [DiscoverSectionType.GOODS]: '상품 섹션',
  [DiscoverSectionType.SHOWROOM]: '브랜드 섹션',
  [DiscoverSectionType.STORY]: '콘텐츠 섹션',
  [DiscoverSectionType.LIVE]: '라이브 섹션',
};

/**
 * 디스커버 섹션 노출 타입
 */
export const DiscoverSectionDisplayType = {
  NEW: 'NEW',
  SOON: 'SOON',
  POPULAR: 'POPULAR',
  PRIZM_ONLY: 'PRIZM_ONLY',
  CURATION: 'CURATION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverSectionDisplayType = typeof DiscoverSectionDisplayType[keyof typeof DiscoverSectionDisplayType];

export const DiscoverSectionDisplayTypeModeLabel: {
  [k in DiscoverSectionDisplayType]: string;
} = {
  [DiscoverSectionDisplayType.NEW]: '자동',
  [DiscoverSectionDisplayType.SOON]: '자동',
  [DiscoverSectionDisplayType.POPULAR]: '자동',
  [DiscoverSectionDisplayType.PRIZM_ONLY]: '자동',
  [DiscoverSectionDisplayType.CURATION]: '수동',
};

/**
 * 공개 상태
 */
export const DiscoverSectionOpenStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverSectionOpenStatus = typeof DiscoverSectionOpenStatus[keyof typeof DiscoverSectionOpenStatus];

export const DiscoverSectionOpenStatusLabel: {
  [k in DiscoverSectionOpenStatus]: string;
} = {
  [DiscoverSectionOpenStatus.OPEN]: '공개',
  [DiscoverSectionOpenStatus.CLOSE]: '비공개',
};

/**
 * 디스커버 섹션 타입 옵션
 */
export const DiscoverSectionTypeOptions = Object.keys(DiscoverSectionType).map((key) => {
  return {
    label: DiscoverSectionTypeLabel[key],
    value: DiscoverSectionType[key],
  };
});

export interface DiscoverSectionDisplayOption extends TOption {
  defaultValue?: string;
}

/**
 * 디스커버 섹션 노출 타입 상품옵션
 */
export const DiscoverSectionDisplayTypeGoodsOptions: Array<DiscoverSectionDisplayOption> = [
  {
    label: '신규 등록 상품',
    value: DiscoverSectionDisplayType.NEW,
    defaultValue: 'NEW IN',
  },
  {
    label: '판매 예정 상품',
    value: DiscoverSectionDisplayType.SOON,
    defaultValue: 'COMING SOON',
  },
  {
    label: 'PRIZM ONLY 상품',
    value: DiscoverSectionDisplayType.PRIZM_ONLY,
    defaultValue: 'PRIZM ONLY',
  },
  {
    label: '큐레이션 키워드 편성',
    value: DiscoverSectionDisplayType.CURATION,
    defaultValue: '',
  },
];

/**
 * 디스커버 섹션 노출 타입 쇼룸옵션
 */
export const DiscoverSectionDisplayTypeShowroomOptions: Array<DiscoverSectionDisplayOption> = [
  {
    label: '지금 인기 Brand',
    value: DiscoverSectionDisplayType.POPULAR,
    defaultValue: '지금 인기 Brand',
  },
  {
    label: '신규 입점 Brand',
    value: DiscoverSectionDisplayType.NEW,
    defaultValue: '신규 입점 브랜드',
  },
  {
    label: '큐레이션 키워드 편성 ',
    value: DiscoverSectionDisplayType.CURATION,
    defaultValue: '',
  },
];

/**
 * 디스커버 섹션 노출 타입 컨텐츠옵션
 */
export const DiscoverSectionDisplayTypeStoryOptions: Array<DiscoverSectionDisplayOption> = [
  {
    label: '최근 공개 콘텐츠',
    value: DiscoverSectionDisplayType.NEW,
    defaultValue: '최근 공개 콘텐츠 ',
  },
  {
    label: '큐레이션 키워드 편성',
    value: DiscoverSectionDisplayType.CURATION,
    defaultValue: '',
  },
];

/**
 * 디스커버 섹션 노출 타입 라이브옵션
 */
export const DiscoverSectionDisplayTypeLiveOptions: Array<DiscoverSectionDisplayOption> = [
  {
    label: '예정된 라이브',
    value: DiscoverSectionDisplayType.SOON,
    defaultValue: 'Upcoming Live',
  },
];

/**
 * 디스커버 섹션 공개 옵션
 */
export const DiscoverSectionOpenOptions = Object.keys(DiscoverSectionOpenStatus).map((key) => {
  return {
    label: DiscoverSectionOpenStatusLabel[key],
    value: DiscoverSectionOpenStatus[key],
  };
});
