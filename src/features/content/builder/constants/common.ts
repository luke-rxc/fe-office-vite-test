/**
 * 쿼리 키
 */
export const QUERY_KEY = {
  CONTENT: 'content',
  LIVE_LIST: 'liveList',
  GOODS_LIST: 'goodsList',
  SHOWROOM_COMBO: 'ShowroomCombo',
  PROVIDER_COMBO: 'ProviderCombo',
  BRAND_COMBO: 'BrandCombo',
};

/**
 * 컨텐츠  타입
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
};

/**
 * 컨텐츠 상태
 */
export const CONTENT_STATUS = {
  PUBLIC: 'PUBLIC', // 공개
  ADMIN_PUBLIC: 'ADMIN_PUBLIC', // 관리자 공개
  PRIVATE: 'PRIVATE', // 비공개
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_STATUS = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];

export const CONTENT_STATUS_LABEL: {
  [k in CONTENT_STATUS]: string;
} = {
  PUBLIC: '공개',
  ADMIN_PUBLIC: '관리자 공개',
  PRIVATE: '비공개',
};

/**
 * 컨텐츠 고정 포지션
 */
export const COMPONENT_POSITION = {
  TOP: 'TOP', // 상단 고정위치
  BOTTOM: 'BOTTOM', // 하단 고정위치
  NONE: '',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type COMPONENT_POSITION = typeof COMPONENT_POSITION[keyof typeof COMPONENT_POSITION];

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

/**
 * 컨텐츠 저장 타입
 */
export const CONTENT_SUBMIT_TYPE = {
  PREVIEW: 'PREVIEW', // 미리보기
  SAVE: 'SAVE', // 저장
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_SUBMIT_TYPE = typeof CONTENT_SUBMIT_TYPE[keyof typeof CONTENT_SUBMIT_TYPE];

/**
 * 컨텐츠 폼 키
 */
export const FORM_KEY = {
  MEDIA_UPLOADER: 'mediaUploader', // 파일 업로드(미디어-비디오,이미지) 관련 관리 폼 키
  CONTENTS: 'contents', // 컨텐츠(디스플레이) 폼 키
  LIVE_LIST: 'liveList', // 라이브 id 관리 리스트 폼 키
  GOODS_LIST: 'goodsList', // 상품 id 관리 리스트 폼 키
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FORM_KEY = typeof FORM_KEY[keyof typeof FORM_KEY];
