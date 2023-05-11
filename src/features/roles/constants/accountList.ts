/**
 * 매니저 계정 관리 리스트 제목
 */
export const MANAGER_LIST_TITLE = '매니저 계정 목록' as const;

/**
 * 파트너 계정 관리 리스트 제목
 */
export const PARTNER_LIST_TITLE = '파트너 계정 목록' as const;

/**
 * 매니저 계정관리 리스트의 초대버튼 텍스트
 */
export const MANAGER_INVITE_BUTTON_LABEL = '매니저 초대' as const;

/**
 * 파트너 계정관리 리스트의 초대버튼 텍스트
 */
export const PARTNER_INVITE_BUTTON_LABEL = '파트너 초대' as const;

/**
 * 계정 상세보기 텍스트
 */
export const DETAIL_PAGE_ANCHOR_LABEL = '상세 보기' as const;

/**
 * 계정 생성일 표기 포멧
 */
export const ACCOUNT_CREATED_DATE_FORMAT = 'yyyy-MM-dd' as const;

/**
 * 테이블 디플트 페이지  사이즈
 */
export const ACCOUNT_TABLE_DEFAULT_SIZE = 5 as const;

/**
 * 테이블 디폴트 페이지 인덱스
 */
export const ACCOUNT_TABLE_DEFAULT_PAGE = 1 as const;

/**
 * 최고 권한 YN 텍스트
 */
export const ACCOUNT_ROOT_YN_TEXT = {
  Y: 'Y',
  N: 'N',
} as const;

/**
 * 계정 상태 텍스트
 */
export const ACCOUNT_STATE_TEXT = {
  ACTIVE: '활성화',
  PAUSE: '비활성화',
} as const;

/**
 * 계정 목록 테이블 데이터 키
 */
export const ACCOUNT_TABLE_DATA_KEYS = {
  ID: 'id',
  EMAIL: 'email',
  NAME: 'name',
  ROOT_YN: 'rootYn',
  PART_NAME: 'partName',
  ACTIVE_STATE: 'activeState',
  CREATED_DATE: 'createdDate',
  COMPANY_NAME: 'companyName',
  PROVIDER_NAMES: 'providerNames',
} as const;

/**
 * 계정 목록 테이블 제목
 */
export const ACCOUNT_TABLE_HEADER_LABELS = {
  /* ====== 공통 ====== */
  EMAIL: '이메일',
  NAME: '이름',
  /* ===== 매니저 ===== */
  PART_NAME: '부서명',
  CREATED_DATE: '생성일',
  IS_ROOT: '최고 권한',
  ACTIVE_STATE: '계정 상태',
  /* ===== 파트너 ===== */
  COMPANY_NAME: '회사/단체명',
  PROVIDER_NAMES: '관리 입점사',
  PARTNER_CREATED_DATE: '파트너 생성일',
  PARTNER_ACTIVE_STATE: '파트너 계정 상태',
} as const;
