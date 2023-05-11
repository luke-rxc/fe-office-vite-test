/**
 * 오버레이 컬러타입
 */
export const MEDIA_VIEWER_A_OVERLAY_TYPE = {
  NONE: 'NONE',
  BLACK: 'BLACK', // 다크 오버레이
  WHITE: 'WHITE', // 화이트 오버레이
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MEDIA_VIEWER_A_OVERLAY_TYPE = typeof MEDIA_VIEWER_A_OVERLAY_TYPE[keyof typeof MEDIA_VIEWER_A_OVERLAY_TYPE];

export const MEDIA_VIEWER_A_OVERLAY_TYPE_LABEL: {
  [k in MEDIA_VIEWER_A_OVERLAY_TYPE]: string;
} = {
  NONE: '사용하지않음',
  BLACK: '다크 오버레이',
  WHITE: '화이트 오버레이',
};

/**
 * 오버레이 옵션
 */
export const MEDIA_VIEWER_A_OVERLAY_TYPE_OPTIONS = Object.keys(MEDIA_VIEWER_A_OVERLAY_TYPE).map((key) => {
  return {
    label: MEDIA_VIEWER_A_OVERLAY_TYPE_LABEL[key],
    value: MEDIA_VIEWER_A_OVERLAY_TYPE[key],
  };
});

/**
 * 상단 인디케이터 타입
 */
export const MEDIA_VIEWER_A_INDICATOR_TYPE = {
  NONE: 'NONE',
  GREY: 'GREY', // 그레이
  WHITE: 'WHITE', // 화이트
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MEDIA_VIEWER_A_INDICATOR_TYPE =
  typeof MEDIA_VIEWER_A_INDICATOR_TYPE[keyof typeof MEDIA_VIEWER_A_INDICATOR_TYPE];

export const MEDIA_VIEWER_A_INDICATOR_TYPE_LABEL: {
  [k in MEDIA_VIEWER_A_INDICATOR_TYPE]: string;
} = {
  NONE: '사용하지않음',
  GREY: '그레이',
  WHITE: '화이트',
};

/**
 * 상단 인디케이터 옵션
 */
export const MEDIA_VIEWER_A_INDICATOR_TYPE_OPTIONS = Object.keys(MEDIA_VIEWER_A_INDICATOR_TYPE).map((key) => {
  return {
    label: MEDIA_VIEWER_A_INDICATOR_TYPE_LABEL[key],
    value: MEDIA_VIEWER_A_INDICATOR_TYPE[key],
  };
});

/**
 * 등록 가능 개수
 */
export const MEDIA_VIEWER_A_MAX_NUM = 10;
