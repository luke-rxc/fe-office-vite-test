import { DateRangeModel, DateRangeType } from '../services/useDateRangeService';

/**
 * 검색타입
 */
export const CONTENT_SEARCH_TYPE = {
  STORY_NAME: 'STORY_NAME', // 컨텐츠명
  SHOWROOM_NAME: 'SHOWROOM_NAME', // 쇼룸명
  PROVIDER_NAME: 'PROVIDER_NAME', // 입점사명
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_SEARCH_TYPE = typeof CONTENT_SEARCH_TYPE[keyof typeof CONTENT_SEARCH_TYPE];

export const CONTENT_SEARCH_TYPE_LABEL: {
  [k in CONTENT_SEARCH_TYPE]: string;
} = {
  STORY_NAME: '콘텐츠명',
  SHOWROOM_NAME: '쇼룸명',
  PROVIDER_NAME: '입점사명',
} as const;

/**
 * 검색타입 리스트 옵션
 */
export const CONTENT_SEARCH_TYPE_OPTIONS = Object.keys(CONTENT_SEARCH_TYPE).map((key) => {
  return {
    label: CONTENT_SEARCH_TYPE_LABEL[key],
    value: CONTENT_SEARCH_TYPE[key],
  };
});

/**
 * 컨텐츠 기간조회 타입
 */
export const CONTENT_SEARCH_DATE_TYPE = {
  ALL: 'ALL', // 전체 기간
  CREATED_DATE: 'CREATED_DATE', // 최초 생성일
  UPDATED_DATE: 'UPDATED_DATE', // 최종 편집일
  PUBLIC_DATE: 'PUBLIC_DATE', // 공개 기간
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_SEARCH_DATE_TYPE = typeof CONTENT_SEARCH_DATE_TYPE[keyof typeof CONTENT_SEARCH_DATE_TYPE];

export const CONTENT_SEARCH_DATE_TYPE_LABEL: {
  [k in CONTENT_SEARCH_DATE_TYPE]: string;
} = {
  ALL: '전체 기간',
  CREATED_DATE: '최초 생성일',
  UPDATED_DATE: '최종 편집일',
  PUBLIC_DATE: '공개 기간',
};

/**
 * 컨텐츠 기간조회타입 리스트 옵션
 */
export const CONTENT_SEARCH_DATE_TYPE_OPTIONS = Object.keys(CONTENT_SEARCH_DATE_TYPE).map((key) => {
  return {
    label: CONTENT_SEARCH_DATE_TYPE_LABEL[key],
    value: CONTENT_SEARCH_DATE_TYPE[key],
  };
});

/**
 * 컨텐츠 기간 리스트 옵션
 */
export const CONTENT_SEARCH_DATE_PERIOD_OPTIONS: {
  label: string;
  value: DateRangeModel;
}[] = [
  {
    label: '오늘',
    value: {
      type: DateRangeType.DAY,
      range: 0,
      isSub: true,
    },
  },
  {
    label: '어제',
    value: {
      type: DateRangeType.DAY,
      range: 1,
      isSub: true,
    },
  },
  {
    label: '지난 7일',
    value: {
      type: DateRangeType.DAY,
      range: 7,
      isSub: true,
    },
  },
  {
    label: '지난 30일',
    value: {
      type: DateRangeType.DAY,
      range: 30,
      isSub: true,
    },
  },
  {
    label: '이번달',
    value: {
      type: DateRangeType.MONTH,
      range: 0,
      isSub: true,
    },
  },
  {
    label: '지난달',
    value: {
      type: DateRangeType.MONTH,
      range: 1,
      isSub: true,
    },
  },
];
