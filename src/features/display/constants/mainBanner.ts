import { MainBannerLandingType, MainBannerStatus } from '../schemas';
import { MainBannerDetailFormFields } from '../types';

export const BANNER_DEFAULT_PAGE = 1;
export const BANNER_DEFAULT_LIMIT = 25;

export const MainBannerQueryKeys = {
  all: ['banner'],
  publishedList: () => [...MainBannerQueryKeys.all, 'published'],
  unpublishedList: (params) => [...MainBannerQueryKeys.all, 'unpublished', params],
  detail: (params) => [...MainBannerQueryKeys.all, 'detail', params],
  landingInfo: (params) => [...MainBannerQueryKeys.all, 'landingInfo', params],
} as const;

export const MainBannerStatusLabel: Record<MainBannerStatus, string> = {
  BEFORE_OPEN: '공개 예정',
  OPEN: '공개중',
  FINISHED: '편성 종료',
  STOP: '공개 중지',
  PUBLISH_ABLE: '편성 가능',
  PUBLISH_UNABLE: '편성 불가',
} as const;
export type MainBannerStatusLabels = typeof MainBannerStatusLabel[keyof typeof MainBannerStatusLabel];

/**
 * 랜딩 타입 라벨(전체)
 */
export const MainBannerLandingTypeLabel: Record<MainBannerLandingType, string> = {
  CONTENTS_STORY: '콘텐츠(스토리)',
  CONTENTS_TEASER: '콘텐츠(티저)',
  EVENT: '이벤트(Web)',
  GOODS: '상품',
  LIVE: '라이브',
  NOTICE: '공지사항',
  SHOWROOM: '쇼룸',
  DISCOVER_KEYWORD: '키워드',
} as const;
export type MainBannerLandingTypeLabels = typeof MainBannerLandingTypeLabel[keyof typeof MainBannerLandingTypeLabel];

/**
 * 랜딩 타입 라벨(대분류만)
 */
export const MainBannerLandingTypeFirstCategoryLabel: Record<MainBannerLandingType, string> = {
  CONTENTS_STORY: '콘텐츠',
  CONTENTS_TEASER: '콘텐츠',
  EVENT: '이벤트',
  GOODS: '상품',
  LIVE: '라이브',
  NOTICE: '공지사항',
  SHOWROOM: '쇼룸',
  DISCOVER_KEYWORD: '키워드',
} as const;
export type MainBannerLandingTypeFirstCategoryLabels =
  typeof MainBannerLandingTypeFirstCategoryLabel[keyof typeof MainBannerLandingTypeFirstCategoryLabel];

/**
 * (form) 랜딩 타입
 */
interface BaseLandingTypeOption {
  label: string;
  value: string;
}
export interface BannerMainLandingTypeOption extends BaseLandingTypeOption {
  label: MainBannerLandingTypeFirstCategoryLabels;
  value: string;
}
export interface BannerSubLandingTypeOption extends BaseLandingTypeOption {
  mainIndex?: number;
}
export type BannerLandingTypeOption = BannerMainLandingTypeOption | BannerSubLandingTypeOption;

export const FormMainBannerLadingTypeOptions = {
  main: [
    { label: '콘텐츠', value: 'CONTENTS' },
    { label: '쇼룸', value: 'SHOWROOM' },
    { label: '라이브', value: 'LIVE' },
    { label: '상품', value: 'GOODS' },
    { label: '키워드', value: 'DISCOVER_KEYWORD' },
    { label: '공지사항', value: 'NOTICE' },
    { label: '이벤트', value: 'EVENT' },
  ] as BannerMainLandingTypeOption[],
  sub: [
    { label: '스토리', value: 'STORY', mainIndex: 0 },
    { label: '티저', value: 'TEASER', mainIndex: 0 },
  ] as BannerSubLandingTypeOption[],
};

export const MainBannerDetailFormDefaultValues: MainBannerDetailFormFields = {
  landingType: { main: FormMainBannerLadingTypeOptions.main[0], sub: FormMainBannerLadingTypeOptions.sub[0] },
  landingId: '',
  title: '',
  description: '',
  publishStartDate: '',
  publishEndDate: '',
  sortNum: '',
  mediaId: '',
  videoRepeatPoint: null,
};
