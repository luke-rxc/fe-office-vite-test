export const BANNER_DEFAULT_PAGE = 1;
export const BANNER_DEFAULT_LIMIT = 25;

export const DiscoverBannerQueryKeys = {
  all: [{ scope: 'discover-banner' }] as const,
  lists: () => [{ ...DiscoverBannerQueryKeys.all[0], entity: 'list' }] as const,
  bannerPublishedList: () => [{ ...DiscoverBannerQueryKeys.lists()[0], entity: 'list', publish: true }] as const,
  bannerList: (params: any) =>
    [{ ...DiscoverBannerQueryKeys.lists()[0], entity: 'list', publish: false, params }] as const,
  detail: (bannerId: string) => [{ ...DiscoverBannerQueryKeys.all[0], entity: 'detail', bannerId }] as const,
} as const;

/**
 * 편성 상태
 */
export const PublishStatus = {
  OPEN: 'OPEN',
  BEFORE_OPEN: 'BEFORE_OPEN',
  STOP: 'STOP',
  PUBLISH_ABLE: 'PUBLISH_ABLE',
  FINISHED: 'FINISHED',
  PUBLISH_UNABLE: 'PUBLISH_UNABLE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PublishStatus = typeof PublishStatus[keyof typeof PublishStatus];

export const PublishStatusLabel: {
  [k in PublishStatus]: string;
} = {
  [PublishStatus.OPEN]: '공개중',
  [PublishStatus.BEFORE_OPEN]: '공개 예정',
  [PublishStatus.STOP]: '공개 불가',
  [PublishStatus.PUBLISH_ABLE]: '편성 가능',
  [PublishStatus.FINISHED]: '편성 종료',
  [PublishStatus.PUBLISH_UNABLE]: '편성 불가',
};

/**
 * 디스커버 랜딩 타입
 */
export const DiscoverLandingType = {
  CONTENTS: 'CONTENTS',
  SHOWROOM: 'SHOWROOM',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverLandingType = typeof DiscoverLandingType[keyof typeof DiscoverLandingType];

export const DiscoverLandingTypeLabel: {
  [k in DiscoverLandingType]: string;
} = {
  [DiscoverLandingType.CONTENTS]: '콘텐츠',
  [DiscoverLandingType.SHOWROOM]: '쇼룸',
  [DiscoverLandingType.GOODS]: '상품',
};

/**
 * 디스커버 랜딩 서브 타입
 */
export const DiscoverLandingSubType = {
  STORY: 'STORY',
  TEASER: 'TEASER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverLandingSubType = typeof DiscoverLandingSubType[keyof typeof DiscoverLandingSubType];

export const DiscoverLandingSubTypeLabel: {
  [k in DiscoverLandingSubType]: string;
} = {
  [DiscoverLandingSubType.STORY]: '스토리',
  [DiscoverLandingSubType.TEASER]: '티저',
};

/**
 * 디스커버 랜딩 타입 options
 */
export const DiscoverLandingTypeOptions = [
  DiscoverLandingType.CONTENTS,
  DiscoverLandingType.SHOWROOM,
  DiscoverLandingType.GOODS,
];

/**
 * 디스커버 랜딩 서브 타입 options
 */
export const DiscoverLandingSubTypeOptions = [
  { value: DiscoverLandingSubType.STORY, parent: DiscoverLandingType.CONTENTS },
  { value: DiscoverLandingSubType.TEASER, parent: DiscoverLandingType.CONTENTS },
];
