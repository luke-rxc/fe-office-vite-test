/**
 * 액션 타입
 */
export const IMAGE_VIEWER_ACTION_TYPE = {
  GOODS: 'GOODS',
  SHOWROOM: 'SHOWROOM',
  CONTENT_STORY: 'CONTENT_STORY',
  CONTENT_TEASER: 'CONTENT_TEASER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type IMAGE_VIEWER_ACTION_TYPE = typeof IMAGE_VIEWER_ACTION_TYPE[keyof typeof IMAGE_VIEWER_ACTION_TYPE];

export const IMAGE_VIEWER_ACTION_TYPE_LABEL: {
  [k in IMAGE_VIEWER_ACTION_TYPE]: string;
} = {
  GOODS: '상품상세',
  SHOWROOM: '쇼룸',
  CONTENT_STORY: '콘텐츠 스토리',
  CONTENT_TEASER: '콘텐츠 라이브 티저',
} as const;

/**
 * 액션 타입 옵션
 */
export const IMAGE_VIEWER_ACTION_TYPE_OPTIONS = Object.keys(IMAGE_VIEWER_ACTION_TYPE).map((key) => {
  return {
    label: IMAGE_VIEWER_ACTION_TYPE_LABEL[key],
    value: IMAGE_VIEWER_ACTION_TYPE[key],
  };
});
