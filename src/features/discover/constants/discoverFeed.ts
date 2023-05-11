export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_LIMIT = 10;

export const DiscoverFeedQueryKeys = {
  all: [{ scope: 'discover-feed' }] as const,
  lists: () => [{ ...DiscoverFeedQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: any) => [{ ...DiscoverFeedQueryKeys.lists()[0], subEntity: 'list', params }] as const,
  stopList: (params: any) => [{ ...DiscoverFeedQueryKeys.lists()[0], subEntity: 'stop-list', params }] as const,
  registeredList: () => [{ ...DiscoverFeedQueryKeys.lists()[0], subEntity: 'registered-list' }] as const,
  detail: (feedId: string) => [{ ...DiscoverFeedQueryKeys.all[0], entity: 'detail', feedId }] as const,
} as const;

/**
 * 디스커버 피드 전시그룹 타입
 */
export const DiscoverFeedDisplayGroupType = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverFeedDisplayGroupType =
  typeof DiscoverFeedDisplayGroupType[keyof typeof DiscoverFeedDisplayGroupType];

/**
 * 디스커버 피드 상태
 */
export const DiscoverFeedStatus = {
  OPEN: 'OPEN',
  BEFORE_OPEN: 'BEFORE_OPEN',
  STOP: 'STOP',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DiscoverFeedStatus = typeof DiscoverFeedStatus[keyof typeof DiscoverFeedStatus];

export const DiscoverFeedStatusLabel: {
  [k in DiscoverFeedStatus]: string;
} = {
  [DiscoverFeedStatus.OPEN]: '전시중',
  [DiscoverFeedStatus.BEFORE_OPEN]: '전시 예정',
  [DiscoverFeedStatus.STOP]: '전시 종료',
};

export const DiscoverFeedStatusColor: {
  [k in DiscoverFeedStatus]: string;
} = {
  [DiscoverFeedStatus.OPEN]: '#5991ff',
  [DiscoverFeedStatus.BEFORE_OPEN]: '#CFE2F3',
  [DiscoverFeedStatus.STOP]: '#D9D9D9',
};
