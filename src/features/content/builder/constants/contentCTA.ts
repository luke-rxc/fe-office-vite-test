/**
 * 버튼 스타일 타입
 */
export const CTA_BUTTON_STYLE_TYPE = {
  OUTLINE: 'OUTLINE',
  FILL: 'FILL',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTA_BUTTON_STYLE_TYPE = typeof CTA_BUTTON_STYLE_TYPE[keyof typeof CTA_BUTTON_STYLE_TYPE];

/**
 * 버튼 타입
 */
export const CTA_BUTTON_TYPE = {
  OUTLINE_LEFT: 'OUTLINE_LEFT',
  OUTLINE_CENTER: 'OUTLINE_CENTER',
  FILL_LEFT: 'FILL_LEFT',
  FILL_CENTER: 'FILL_CENTER',
  NONE: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTA_BUTTON_TYPE = typeof CTA_BUTTON_TYPE[keyof typeof CTA_BUTTON_TYPE];

/**
 * 버튼 최대 개수
 */
export const BUTTON_MAX_NUM = {
  VERTICAL: 4,
  HORIZONTAL: 2,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BUTTON_MAX_NUM = typeof BUTTON_MAX_NUM[keyof typeof BUTTON_MAX_NUM];

/**
 * 버튼 상단 간격
 */
export const CTA_BUTTON_TOP_SPACING = {
  NORMAL: 'NORMAL',
  SMALL: 'SMALL',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTA_BUTTON_TOP_SPACING = typeof CTA_BUTTON_TOP_SPACING[keyof typeof CTA_BUTTON_TOP_SPACING];

/**
 * 버튼 액션
 */
export const CTA_BUTTON_ACTION_TYPE = {
  EXTERNAL_WEB: 'EXTERNAL_WEB',
  COUPON: 'COUPON',
  SHOWROOM: 'SHOWROOM',
  CONTENT_STORY: 'CONTENT_STORY',
  CONTENT_TEASER: 'CONTENT_TEASER',
  DEEP_LINK: 'DEEP_LINK',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CTA_BUTTON_ACTION_TYPE = typeof CTA_BUTTON_ACTION_TYPE[keyof typeof CTA_BUTTON_ACTION_TYPE];

export const CTA_BUTTON_ACTION_TYPE_LABEL: {
  [k in CTA_BUTTON_ACTION_TYPE]: string;
} = {
  EXTERNAL_WEB: '외부 링크',
  COUPON: '쿠폰다운로드',
  SHOWROOM: '내부 링크(쇼룸)',
  CONTENT_STORY: '내부 링크(콘텐츠 스토리)',
  CONTENT_TEASER: '내부 링크(콘텐츠 라이브 티저)',
  DEEP_LINK: '내부 인앱 딥링크',
} as const;

/**
 * 버튼 옵션
 */
export const CTA_BUTTON_ACTION_TYPE_OPTIONS = Object.keys(CTA_BUTTON_ACTION_TYPE).map((key) => {
  return {
    label: CTA_BUTTON_ACTION_TYPE_LABEL[key],
    value: CTA_BUTTON_ACTION_TYPE[key],
  };
});

/**
 * 타이틀 최대 길이
 */
export const CTA_LABEL_MAX_NUM = 2000; // 12;

/**
 * 타이틀 최대 길이
 */
export const CTA_TITLE_MAX_NUM = 2000; // 16;

/**
 * 서브 타이틀 최대 길이
 */
export const CTA_SUBTITLE_MAX_NUM = 2000; // 30;

/**
 * 디스크립션 최대 길이
 */
export const CTA_DESC_MAX_NUM = 2000; // 95;
