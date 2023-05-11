/**
 * 쿼리 키
 */
export const QUERY_KEY = {
  CONTENT_LIST: 'ContentList',
  PROVIDER_COMBO: 'ProviderCombo',
  SHOWROOM_COMBO: 'ShowroomCombo',
  KEYWORD_COMBO: 'KeywordCombo',
  CONTENT_VALIDATE: 'getContentValidate',
  CONTENT_DEFAULT: 'contentDefault', // 기본정보 관리
};

/**
 * 콘텐츠 타입
 */
export const CONTENT_TYPE = {
  STORY: 'STORY', // 스토리
  TEASER: 'TEASER', // 라이브 티저
  // EXCLUSIVE: 'EXCLUSIVE', // prizm id
  // COLLABORATION: 'COLLABORATION', // prizm xx
  // EVENT: 'EVENT', // asap
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_TYPE = typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE];

export const CONTENT_TYPE_LABEL: {
  [k in CONTENT_TYPE]: string;
} = {
  STORY: '스토리',
  TEASER: '라이브 티저',
  // EXCLUSIVE: 'PRIZM ID', // prizm id
  // COLLABORATION: 'PRIZM XX', // prizm xx
  // EVENT: 'PRIZM ASAP', // asap
} as const;

/**
 * 컨텐츠 타입 리스트 옵션
 */
export const CONTENT_TYPE_OPTIONS = Object.keys(CONTENT_TYPE).map((key) => {
  return {
    label: CONTENT_TYPE_LABEL[key],
    value: CONTENT_TYPE[key],
  };
});

/**
 * 컨텐츠 공개상태 조회 타입
 */
export const CONTENT_STATUS_TYPE = {
  PUBLIC: 'PUBLIC', // 공개
  ADMIN_PUBLIC: 'ADMIN_PUBLIC', // 관리자 공개
  PRIVATE: 'PRIVATE', // 비공개
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_STATUS_TYPE = typeof CONTENT_STATUS_TYPE[keyof typeof CONTENT_STATUS_TYPE];

export const CONTENT_STATUS_TYPE_LABEL: {
  [k in CONTENT_STATUS_TYPE]: string;
} = {
  PUBLIC: '공개',
  ADMIN_PUBLIC: '관리자 공개',
  PRIVATE: '비공개',
};

/**
 * 공개타입 리스트 옵션
 */
export const CONTENT_STATUS_OPTIONS = Object.keys(CONTENT_STATUS_TYPE).map((key) => {
  return {
    label: CONTENT_STATUS_TYPE_LABEL[key],
    value: CONTENT_STATUS_TYPE[key],
  };
});

/**
 * 정렬 타입
 */
export const SORT_TYPE = {
  TOP: 'TOP', //  최상단 이동
  BOTTOM: 'BOTTOM', // 최하단 이동
  UP: 'UP', //위로 이동
  DOWN: 'DOWN', // 아래로 이동
  LEFT: 'LEFT', // 왼쪽 이동
  RIGHT: 'RIGHT', // 오른쪽 이동
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SORT_TYPE = typeof SORT_TYPE[keyof typeof SORT_TYPE];
