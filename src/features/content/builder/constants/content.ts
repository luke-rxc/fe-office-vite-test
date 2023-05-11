/**
 *  텍스트 사이즈 타입
 */
export const TEXT_ITEM_SIZE_TYPE = {
  LARGE: 'LARGE', // 크게
  MEDIUM: 'MEDIUM', // 보통
  // ETC: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TEXT_ITEM_SIZE_TYPE = typeof TEXT_ITEM_SIZE_TYPE[keyof typeof TEXT_ITEM_SIZE_TYPE];

export const TEXT_ITEM_SIZE_TYPE_LABEL: {
  [k in TEXT_ITEM_SIZE_TYPE]: string;
} = {
  LARGE: '크게',
  MEDIUM: '보통',
  // ETC: '',
};

/**
 * 텍스트 사이즈 콤보 옵션
 */
export const TEXT_ITEM_SIZE_TYPE_OPTIONS = Object.keys(TEXT_ITEM_SIZE_TYPE).map((key) => {
  return {
    label: TEXT_ITEM_SIZE_TYPE_LABEL[key],
    value: TEXT_ITEM_SIZE_TYPE[key],
  };
});

/**
 * 레이아웃방향
 */
export const LAYOUT_DIRECTION_TYPE = {
  VERTICAL: 'VERTICAL', // 수직
  HORIZONTAL: 'HORIZONTAL', // 수평
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LAYOUT_DIRECTION_TYPE = typeof LAYOUT_DIRECTION_TYPE[keyof typeof LAYOUT_DIRECTION_TYPE];

/**
 * 가로 정렬
 */
export const ALIGN_TYPE = {
  LEFT: 'LEFT', // 왼쪽
  CENTER: 'CENTER', // 가운데
  RIGHT: 'RIGHT', // 오른쪽
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ALIGN_TYPE = typeof ALIGN_TYPE[keyof typeof ALIGN_TYPE];

/**
 * 세로 정렬
 */
export const VERTICAL_ALIGN_TYPE = {
  TOP: 'TOP', // 상단 정렬
  CENTER: 'CENTER', // 중앙  정렬
  BOTTOM: 'BOTTOM', // 하단  정렬
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VERTICAL_ALIGN_TYPE = typeof VERTICAL_ALIGN_TYPE[keyof typeof VERTICAL_ALIGN_TYPE];

/**
 * boolean string type
 * - 라디오 value
 */
export const BOOLEAN_VALUE_TYPE = {
  T: 'T', // true
  F: 'F', // false
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BOOLEAN_VALUE_TYPE = typeof BOOLEAN_VALUE_TYPE[keyof typeof BOOLEAN_VALUE_TYPE];

/**
 * 미디어 노출 비율 타입
 */
export const MEDIA_VIEW_RATIO_TYPE = {
  SQUARE: 'SQUARE', // 1:1 비율
  RECTANGLE_VERTICAL: 'RECTANGLE_VERTICAL', // 4:3 직사각형 가로
  RECTANGLE_HORIZONTAL: 'RECTANGLE_HORIZONTAL', // 3:4 직사각형 세로
  RECTANGLE_16BY9: 'RECTANGLE_16BY9', // 16:9 직사각형 가로
  ETC: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MEDIA_VIEW_RATIO_TYPE = typeof MEDIA_VIEW_RATIO_TYPE[keyof typeof MEDIA_VIEW_RATIO_TYPE];

/**
 * 미디어 노출 비율
 */
export const MEDIA_VIEW_RATIO = {
  SQUARE: {
    width: 1,
    height: 1,
  }, // 1:1 비율
  RECTANGLE_VERTICAL: {
    width: 4,
    height: 3,
  }, // 4:3 직사각형 가로
  RECTANGLE_HORIZONTAL: {
    width: 3,
    height: 4,
  }, // 3:4 직사각형 세로
  RECTANGLE_16BY9: {
    width: 16,
    height: 9,
  }, // 16:9
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MEDIA_VIEW_RATIO = typeof MEDIA_VIEW_RATIO[keyof typeof MEDIA_VIEW_RATIO];

/**
 * 컨텐츠 내 백그라운드 타입
 */
export const CONTENT_BACKGROUND_TYPE = {
  MEDIA: 'MEDIA', // 백그라운드 미디어 타입(이미지/비디오)
  COLOR: 'COLOR', // 백그라운드 컬러 타입
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_BACKGROUND_TYPE = typeof CONTENT_BACKGROUND_TYPE[keyof typeof CONTENT_BACKGROUND_TYPE];
