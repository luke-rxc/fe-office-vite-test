/**
 * 계정 목록 검색 폼 필드 네임
 */
export const ACCOUNT_SEARCH_FIELD_NAMES = {
  KEYWORD: 'keyword',
  SEARCH_TYPE: 'searchType',
  IS_ACTIVE: 'isActive',
  FROM_CREATED_DATE: 'fromCreatedDate',
  TO_CREATED_DATE: 'toCreatedDate',
  /* ===== 파트너 ===== */
  PROVIDER_IDS: 'providerIds',
} as const;

/**
 * 계정 조회 필드 라벨
 */
export const ACCOUNT_SEARCH_FIELD_LABELS = {
  KEYWORD: '검색어',
  SEARCH_TYPE: '검색조건',
  STATUS_ALL: '모든 계정',
  STATUS_ACTIVE: '활성화 계정',
  STATUS_PAUSE: '비활성화 계정',
  FROM_CREATED_DATE: '생성일(시작)',
  TO_CREATED_DATE: '생성일(종료)',
  /* ===== 파트너 ===== */
  PROVIDER_IDS: '입점사',
} as const;

/**
 * 검색 폼 액션 버튼 라벨
 */
export const ACCOUNT_SEARCH_BUTTON_LABELS = {
  RESET: '초기화',
  SUBMIT: '검색',
} as const;

/**
 *  검색조건 옵션
 */
export const ACCOUNT_SEARCH_TYPES = {
  NONE: '',
  EMAIL: 'EMAIL',
  NAME: 'NAME',
  PART_NAME: 'PART_NAME',
  COMPANY_NAME: 'COMPANY_NAME',
} as const;

/**
 * 검색조건 옵션 라벨
 */
export const ACCOUNT_SEARCH_TYPE_LABELS = {
  NONE: '검색조건',
  EMAIL: '이메일',
  NAME: '이름',
  PART_NAME: '부서명',
  COMPANY_NAME: '회사명',
} as const;

/**
 * 계정 상태 라디오버튼 값
 */
export const ACCOUNT_SEARCH_STATUS_FIELD_VALUES = {
  ALL: '',
  ACTIVE: '1',
  PAUSE: '0',
} as const;
