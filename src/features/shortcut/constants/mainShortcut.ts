export const SHORTCUT_DEFAULT_PAGE = 1;
export const SHORTCUT_DEFAULT_LIMIT = 25;

export const MainShortcutQueryKeys = {
  all: [{ scope: 'main-banner' }] as const,
  lists: () => [{ ...MainShortcutQueryKeys.all[0], entity: 'list' }] as const,
  bannerPublishedList: () => [{ ...MainShortcutQueryKeys.lists()[0], entity: 'list', publish: true }] as const,
  bannerList: (params: any) =>
    [{ ...MainShortcutQueryKeys.lists()[0], entity: 'list', publish: false, params }] as const,
  detail: (shortcutId: string) => [{ ...MainShortcutQueryKeys.all[0], entity: 'detail', shortcutId }] as const,
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
 * 숏컷 배너 랜딩 타입
 */
export const MainShortcutLandingType = {
  CONTENTS_STORY: 'CONTENTS_STORY',
  CONTENTS_TEASER: 'CONTENTS_TEASER',
  EVENT: 'EVENT',
  GOODS: 'GOODS',
  LIVE: 'LIVE',
  NOTICE: 'NOTICE',
  SHOWROOM: 'SHOWROOM',
  DISCOVER_KEYWORD: 'DISCOVER_KEYWORD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutLandingType = typeof MainShortcutLandingType[keyof typeof MainShortcutLandingType];

export const MainShortcutLandingTypeLabel: {
  [k in MainShortcutLandingType]: string;
} = {
  CONTENTS_STORY: '콘텐츠(스토리)',
  CONTENTS_TEASER: '콘텐츠(티저)',
  EVENT: '이벤트(Web)',
  GOODS: '상품',
  LIVE: '라이브',
  NOTICE: '공지사항',
  SHOWROOM: '쇼룸',
  DISCOVER_KEYWORD: '키워드',
};

/**
 * 숏컷 배너 랜딩 메인 타입
 */
export const MainShortcutLandingMainType = {
  CONTENTS: 'CONTENTS',
  SHOWROOM: 'SHOWROOM',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutLandingMainType = typeof MainShortcutLandingMainType[keyof typeof MainShortcutLandingMainType];

export const MainShortcutLandingMainTypeLabel: {
  [k in MainShortcutLandingMainType]: string;
} = {
  [MainShortcutLandingMainType.CONTENTS]: '콘텐츠',
  [MainShortcutLandingMainType.SHOWROOM]: '쇼룸',
  [MainShortcutLandingMainType.GOODS]: '상품',
};

/**
 * 숏컷 배너 랜딩 서브 타입
 */
export const MainShortcutLandingSubType = {
  STORY: 'STORY',
  TEASER: 'TEASER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutLandingSubType = typeof MainShortcutLandingSubType[keyof typeof MainShortcutLandingSubType];

export const MainShortcutLandingSubTypeLabel: {
  [k in MainShortcutLandingSubType]: string;
} = {
  [MainShortcutLandingSubType.STORY]: '스토리',
  [MainShortcutLandingSubType.TEASER]: '티저',
};

/**
 * 숏컷 배너 랜딩 타입 options
 */
export const MainShortcutLandingMainTypeOptions = [
  MainShortcutLandingMainType.CONTENTS,
  MainShortcutLandingMainType.SHOWROOM,
  MainShortcutLandingMainType.GOODS,
].map((option) => {
  return {
    label: MainShortcutLandingMainTypeLabel[option],
    value: option,
  };
});

/**
 * 숏컷 배너 랜딩 서브 타입 options
 */
export const MainShortcutLandingSubTypeOptions = [
  { value: MainShortcutLandingSubType.STORY, parent: MainShortcutLandingMainType.CONTENTS },
  { value: MainShortcutLandingSubType.TEASER, parent: MainShortcutLandingMainType.CONTENTS },
];

/**
 * 숏컷 배너 타이틀 타입
 */
export const MainShortcutTitleType = {
  TEXT: 'text',
  SVG: 'svg',
  LOTTIE: 'lottie',
  NONE: 'none',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutTitleType = typeof MainShortcutTitleType[keyof typeof MainShortcutTitleType];

export const MainShortcutTitleTypeLabel: {
  [k in MainShortcutTitleType]: string;
} = {
  [MainShortcutTitleType.TEXT]: '타이틀 텍스트 사용',
  [MainShortcutTitleType.SVG]: '이미지 업로드 (svg)',
  [MainShortcutTitleType.LOTTIE]: '이미지 업로드 (lottie)',
  [MainShortcutTitleType.NONE]: '타이틀 미노출',
};

/**
 * 숏컷 배너 서브 타이틀 타입
 */
export const MainShortcutDescriptionType = {
  TEXT: 'text',
  NONE: 'none',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutDescriptionType = typeof MainShortcutDescriptionType[keyof typeof MainShortcutDescriptionType];

export const MainShortcutDescriptionTypeLabel: {
  [k in MainShortcutDescriptionType]: string;
} = {
  [MainShortcutDescriptionType.TEXT]: '타이틀 텍스트 사용',
  [MainShortcutDescriptionType.NONE]: '타이틀 미노출',
};

/**
 * 숏컷 배너 동영상 재생 타입
 */
export const MainShortcutVideoPlayType = {
  ONCE: 'once',
  LOOP: 'loop',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainShortcutVideoPlayType = typeof MainShortcutVideoPlayType[keyof typeof MainShortcutVideoPlayType];

export const MainShortcutVideoPlayTypeLabel: {
  [k in MainShortcutVideoPlayType]: string;
} = {
  [MainShortcutVideoPlayType.ONCE]: '1회 재생',
  [MainShortcutVideoPlayType.LOOP]: '반복 재생',
};

/**
 * 숏컷 배너 타이틀 타입 options
 */
export const MainShortcutTitleTypeOptions = [
  MainShortcutTitleType.NONE,
  MainShortcutTitleType.TEXT,
  MainShortcutTitleType.SVG,
  MainShortcutTitleType.LOTTIE,
].map((option) => {
  return {
    label: MainShortcutTitleTypeLabel[option],
    value: option,
  };
});

/**
 * 숏컷 배너 서브 타이틀 타입 options
 */
export const MainShortcutDescriptionTypeOptions = [
  MainShortcutDescriptionType.NONE,
  MainShortcutDescriptionType.TEXT,
].map((option) => {
  return {
    label: MainShortcutDescriptionTypeLabel[option],
    value: option,
  };
});

/**
 * 숏컷 배너 동영상 재생 타입 options
 */
export const MainShortcutVideoPlayTypeOptions = [MainShortcutVideoPlayType.ONCE, MainShortcutVideoPlayType.LOOP].map(
  (option) => {
    return {
      label: MainShortcutVideoPlayTypeLabel[option],
      value: option,
    };
  },
);
