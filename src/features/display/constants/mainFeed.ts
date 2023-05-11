import { MainFeedLandingType, MainFeedStatus } from '../schemas';
import { MainFeedDetailFormFields } from '../types';

export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_LIMIT = 25;

export const MainFeedQueryKeys = {
  all: ['feed'],
  publishedList: () => [...MainFeedQueryKeys.all, 'published'],
  unpublishedList: (params) => [...MainFeedQueryKeys.all, 'unpublished', params],
  detail: (params) => [...MainFeedQueryKeys.all, 'detail', params],
  landingInfo: (params) => [...MainFeedQueryKeys.all, 'landingInfo', params],
} as const;

export const MainFeedStatusLabel: Record<MainFeedStatus, string> = {
  BEFORE_OPEN: '공개 예정',
  OPEN: '공개중',
  FINISHED: '편성 종료',
  STOP: '공개 중지',
  PUBLISH_ABLE: '편성 가능',
  PUBLISH_UNABLE: '편성 불가',
} as const;
export type MainFeedStatusLabels = typeof MainFeedStatusLabel[keyof typeof MainFeedStatusLabel];

/**
 * 랜딩 타입 라벨(전체)
 */
export const MainFeedLandingTypeLabel: Record<MainFeedLandingType, string> = {
  CONTENTS_STORY: '콘텐츠(스토리)',
  CONTENTS_TEASER: '콘텐츠(티저)',
  EVENT: '이벤트(Web)',
  GOODS: '상품',
  LIVE: '라이브',
  NOTICE: '공지사항',
  SHOWROOM: '쇼룸',
  DISCOVER_KEYWORD: '키워드',
} as const;
export type MainFeedLandingTypeLabels = typeof MainFeedLandingTypeLabel[keyof typeof MainFeedLandingTypeLabel];

/**
 * 랜딩 타입 라벨(대분류만)
 */
export const MainFeedLandingTypeFirstCategoryLabel: Record<MainFeedLandingType, string> = {
  CONTENTS_STORY: '콘텐츠',
  CONTENTS_TEASER: '콘텐츠',
  EVENT: '이벤트',
  GOODS: '상품',
  LIVE: '라이브',
  NOTICE: '공지사항',
  SHOWROOM: '쇼룸',
  DISCOVER_KEYWORD: '키워드',
} as const;
export type MainFeedLandingTypeFirstCategoryLabels =
  typeof MainFeedLandingTypeFirstCategoryLabel[keyof typeof MainFeedLandingTypeFirstCategoryLabel];

/**
 * (form) 랜딩 타입
 */
interface BaseLandingTypeOption {
  label: string;
  value: string;
}
export interface FeedMainLandingTypeOption extends BaseLandingTypeOption {
  label: MainFeedLandingTypeFirstCategoryLabels;
  value: string;
}
export interface FeedSubLandingTypeOption extends BaseLandingTypeOption {
  mainIndex?: number;
}
export type FeedLandingTypeOption = FeedMainLandingTypeOption | FeedSubLandingTypeOption;

export const FormMainFeedLadingTypeOptions = {
  main: [
    { label: '콘텐츠', value: 'CONTENTS' },
    { label: '쇼룸', value: 'SHOWROOM' },
    { label: '라이브', value: 'LIVE' },
    { label: '상품', value: 'GOODS' },
    { label: '키워드', value: 'DISCOVER_KEYWORD' },
    { label: '공지사항', value: 'NOTICE' },
    { label: '이벤트', value: 'EVENT' },
  ] as FeedMainLandingTypeOption[],
  sub: [
    { label: '스토리', value: 'STORY', mainIndex: 0 },
    { label: '티저', value: 'TEASER', mainIndex: 0 },
  ] as FeedSubLandingTypeOption[],
};

export const MainFeedDetailFormDefaultValues: MainFeedDetailFormFields = {
  landingType: { main: FormMainFeedLadingTypeOptions.main[0], sub: FormMainFeedLadingTypeOptions.sub[0] },
  landingId: '',
  title: '',
  description: '',
  publishStartDate: '',
  publishEndDate: '',
  sortNum: '',
  mediaId: '',
  videoRepeatPoint: '',
};
