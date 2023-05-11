/**
 * 라이브 콘텐츠 타입
 */
export const LIVE_CONTENT_TYPE = {
  STANDARD: 'STANDARD',
  AUCTION: 'AUCTION',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_CONTENT_TYPE = typeof LIVE_CONTENT_TYPE[keyof typeof LIVE_CONTENT_TYPE];

export const LIVE_CONTENT_TYPE_LABEL: {
  [k in LIVE_CONTENT_TYPE]: string;
} = {
  STANDARD: '일반',
  AUCTION: '경매',
};

/**
 * 라이브 오픈 상태
 */
export const LIVE_OPEN_STATUS = {
  PUBLIC: 'PUBLIC', // 공개
  PRIVATE: 'PRIVATE', // 비공개
  DRAFT: 'DRAFT', // 대기
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_OPEN_STATUS = typeof LIVE_OPEN_STATUS[keyof typeof LIVE_OPEN_STATUS];

export const LIVE_OPEN_STATUS_LABEL: {
  [k in LIVE_OPEN_STATUS]: string;
} = {
  PUBLIC: '공개',
  PRIVATE: '관리자 공개',
  DRAFT: '비공개',
};

/**
 * 라이브 오픈 상태 옵션
 */
export const LIVE_OPEN_STATUS_OPTIONS = Object.keys(LIVE_OPEN_STATUS).map((key) => {
  return {
    label: LIVE_OPEN_STATUS_LABEL[key],
    value: LIVE_OPEN_STATUS[key],
  };
});

/**
 * 라이브 상태
 */
export const LIVE_STATUS = {
  CREATING: 'CREATING',
  END: 'END',
  LIVE: 'LIVE',
  NONE: 'NONE',
  READY: 'READY',
  REPLAY: 'REPLAY',
  STANDBY: 'STANDBY',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_STATUS = typeof LIVE_STATUS[keyof typeof LIVE_STATUS];

/**
 * 라이브 검색 유형
 */
export const LIVE_SEARCH_FIELD = {
  TITLE: 'TITLE',
  CONTENTS_ID: 'CONTENTS_ID',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_SEARCH_FIELD = typeof LIVE_SEARCH_FIELD[keyof typeof LIVE_SEARCH_FIELD];

export const LIVE_SEARCH_FIELD_LABEL: {
  [k in LIVE_SEARCH_FIELD]: string;
} = {
  TITLE: '콘텐츠명',
  CONTENTS_ID: '콘텐츠 번호',
};
export const LIVE_SEARCH_FIELD_OPTIONS = Object.keys(LIVE_SEARCH_FIELD).map((key) => {
  return {
    label: LIVE_SEARCH_FIELD_LABEL[key],
    value: LIVE_SEARCH_FIELD[key],
  };
});

/**
 * 오버레이 딤드 컬러타입
 */
export const LIVE_OVERLAY_TYPE = {
  NONE: 'NONE',
  BLACK: 'BLACK', // 다크 오버레이
  WHITE: 'WHITE', // 화이트 오버레이
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_OVERLAY_TYPE = typeof LIVE_OVERLAY_TYPE[keyof typeof LIVE_OVERLAY_TYPE];

export const LIVE_OVERLAY_TYPE_LABEL: {
  [k in LIVE_OVERLAY_TYPE]: string;
} = {
  NONE: '사용하지않음',
  BLACK: '다크 오버레이',
  WHITE: '화이트 오버레이',
};

/**
 * 오버레이 옵션
 */
export const LIVE_OVERLAY_TYPE_OPTIONS = Object.keys(LIVE_OVERLAY_TYPE).map((key) => {
  return {
    label: LIVE_OVERLAY_TYPE_LABEL[key],
    value: LIVE_OVERLAY_TYPE[key],
  };
});

/**
 * 시간(카운트다운) 텍스트 컬러타입
 */
export const LIVE_TIME_COLOR_TYPE = {
  BLACK: 'BLACK', // 다크 오버레이
  WHITE: 'WHITE', // 화이트 오버레이
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LIVE_TIME_COLOR_TYPE = typeof LIVE_TIME_COLOR_TYPE[keyof typeof LIVE_TIME_COLOR_TYPE];

export const LIVE_TIME_COLOR_TYPE_LABEL: {
  [k in LIVE_TIME_COLOR_TYPE]: string;
} = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
};

/**
 * 카운트다운 텍스트 옵션
 */
export const LIVE_TIME_COLOR_TYPE_OPTIONS = Object.keys(LIVE_TIME_COLOR_TYPE).map((key) => {
  return {
    label: LIVE_TIME_COLOR_TYPE_LABEL[key],
    value: LIVE_TIME_COLOR_TYPE[key],
  };
});

/**
 * 라이브 등록 가능 개수
 */
export const LIVE_MAX_NUM = 1;
/**
 * 타이틀 최대 길이
 */
export const LIVE_TITLE_MAX_NUM = 2000; // 22;

/**
 * 서브 타이틀 최대 길이
 */
export const LIVE_SUBTITLE_MAX_NUM = 2000; // 69;
