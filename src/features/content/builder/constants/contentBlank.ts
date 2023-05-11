/**
 * 여백 컴포넌트 높이 타입
 */
export const BLANK_SPACING_TYPE = {
  SMALL: 'SMALL', // 작게
  MEDIUM: 'MEDIUM', // 보통
  LARGE: 'LARGE', // 넓게
  CUSTOM: 'CUSTOM', // 사용자 지정
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BLANK_SPACING_TYPE = typeof BLANK_SPACING_TYPE[keyof typeof BLANK_SPACING_TYPE];

export const BLANK_SPACING_TYPE_LABEL: {
  [k in BLANK_SPACING_TYPE]: string;
} = {
  SMALL: '작게',
  MEDIUM: '보통',
  LARGE: '넓게',
  CUSTOM: '사용자 지정',
};

/**
 * 여백 컴포넌트 높이 옵션
 */
export const BLANK_SPACING_TYPE_OPTIONS = Object.keys(BLANK_SPACING_TYPE).map((key) => {
  return {
    label: BLANK_SPACING_TYPE_LABEL[key],
    value: BLANK_SPACING_TYPE[key],
  };
});

/**
 * 여백 컴포넌트 높이 수치
 */
export const BLANK_SPACING_SIZE = {
  LARGE: 96,
  MEDIUM: 48,
  SMALL: 24,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BLANK_SPACING_SIZE = typeof BLANK_SPACING_SIZE[keyof typeof BLANK_SPACING_SIZE];

/**
 * 색상타입
 */
export const BLANK_COLOR_TYPE = {
  SINGLE: 'SINGLE', // 단일 색상
  GRADIENT: 'GRADIENT', // 그라디언트
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BLANK_COLOR_TYPE = typeof BLANK_COLOR_TYPE[keyof typeof BLANK_COLOR_TYPE];

export const BLANK_COLOR_TYPE_LABEL: {
  [k in BLANK_COLOR_TYPE]: string;
} = {
  SINGLE: '단일 컬러',
  GRADIENT: '그라데이션 컬러',
};

/**
 * 여백 컴포넌트 높이 옵션
 */
export const BLANK_COLOR_TYPE_OPTIONS = Object.keys(BLANK_COLOR_TYPE).map((key) => {
  return {
    label: BLANK_COLOR_TYPE_LABEL[key],
    value: BLANK_COLOR_TYPE[key],
  };
});
