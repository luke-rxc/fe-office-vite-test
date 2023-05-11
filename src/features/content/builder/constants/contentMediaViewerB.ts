/**
 * 오버레이 컬러타입
 */
export const MEDIA_VIEWER_B_OVERLAY_TYPE = {
  NONE: 'NONE',
  BLACK: 'BLACK', // 다크 오버레이
  WHITE: 'WHITE', // 화이트 오버레이
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MEDIA_VIEWER_B_OVERLAY_TYPE = typeof MEDIA_VIEWER_B_OVERLAY_TYPE[keyof typeof MEDIA_VIEWER_B_OVERLAY_TYPE];

export const MEDIA_VIEWER_B_OVERLAY_TYPE_LABEL: {
  [k in MEDIA_VIEWER_B_OVERLAY_TYPE]: string;
} = {
  NONE: '사용하지않음',
  BLACK: '다크 오버레이',
  WHITE: '화이트 오버레이',
};

/**
 * 여백 컴포넌트 높이 옵션
 */
export const MEDIA_VIEWER_B_OVERLAY_TYPE_OPTIONS = Object.keys(MEDIA_VIEWER_B_OVERLAY_TYPE).map((key) => {
  return {
    label: MEDIA_VIEWER_B_OVERLAY_TYPE_LABEL[key],
    value: MEDIA_VIEWER_B_OVERLAY_TYPE[key],
  };
});

/**
 * 등록 가능 개수
 */
export const MEDIA_VIEWER_B_MAX_NUM = 10;

/**
 * 타이틀 최대 길이
 */
export const MEDIA_VIEWER_B_TITLE_MAX_NUM = 2000; // 16;

/**
 * 서브 타이틀 최대 길이
 */
export const MEDIA_VIEWER_B_SUBTITLE_MAX_NUM = 2000; // 30;

/**
 * 디스크립션 최대 길이
 */
export const MEDIA_VIEWER_B_DESC_MAX_NUM = 2000; // 95;

/**
 * 미디어(이미지) 타이틀 최대 길이
 */
export const MEDIA_VIEWER_B_MEDIA_TITLE_MAX_NUM = 2000; // 13;

/**
 * 미디어(이미지) 서브 타이틀 최대 길이
 */
export const MEDIA_VIEWER_B_MEDIA_SUBTITLE_MAX_NUM = 2000; // 18;
