// *****************************************************************
// 계정 정보 공통
// *****************************************************************

/** 계정 정보 수정 취소 확인 메시지 */
export const ACCOUNT_INFO_EDIT_CANCEL_CONFIRM_MESSAGE =
  '변경된 내용은 저장되지 않습니다.\n작업을 취소하시겠습니까?' as const;

/** 계정 정보 수정/취소/저장 액션 버튼 라벨 */
export const ACCOUNT_INFO_ACTION_LABELS = {
  EDIT: '수정',
  CANCEL: '취소',
  SAVE: '저장',
} as const;

// *****************************************************************
// 기본 정보
// *****************************************************************

/** 기본 정보 영역 타이틀 */
export const ACCOUNT_PRIMARY_INFO_TITLE = '기본정보';

/** 기본 정보 변경 성공 메시지 */
export const ACCOUNT_CHANGED_PRIMARY_INFO_MESSAGE = '기본 정보가 변경되었습니다.' as const;

/** 기본 정보 영역 날짜 포멧 */
export const ACCOUNT_PRIMARY_INFO_DATE_FORMAT = 'yyyy-MM-dd HH:mm';

/** 기본 정보 항목 라벨 */
export const ACCOUNT_PRIMARY_INFO_LABELS = {
  EMAIL: '이메일',
  LAST_LOGIN_DATE: '마지막 로그인 시간',
  RESET_PASSWORD: '비밀번호 초기화',
  MANAGER_CREATED_DATE: '매니저 계정 생성일',
  MANAGER_STATUS: '매니저 계정 상태',
  PARTNER_CREATED_DATE: '파트너 계정 생성일',
  PARTNER_STATUS: '파트너 계정 상태',
} as const;

/** 기본 정보 필드 네임 */
export const ACCOUNT_PRIMARY_INFO_FIELD_NAMES = {
  STATUS: 'enabled',
} as const;

/** 기본 정보의 상태 필드 옵션 라벨 */
export const ACCOUNT_PRIMARY_INFO_STATUS_OPTION_LABELS = {
  ACTIVE: '활성화',
  PAUSE: '비활성화',
} as const;

/** 기본 정보의 상태 필드 옵션 값 */
export const ACCOUNT_PRIMARY_INFO_STATUS_OPTION_VALUES = {
  ACTIVE: '1',
  PAUSE: '0',
} as const;

/** 임시 비밀 번호 발송 전 확인 메시지 */
export const ACCOUNT_RESET_PASSWORD_CONFIRM_MESSAGE =
  '비밀번호를 초기화하고 임시 비밀번호 안내 메일을 보냅니다.' as const;

/** 임시 비밀 번호 발송 성공 안내 메시지 */
export const ACCOUNT_RESET_PASSWORD_SUCCESS_MESSAGE = '임시 비밀번호가 메일로 발송되었습니다.' as const;

// *****************************************************************
// 소속 정보
// *****************************************************************

/** 소속 정보 영역 타이틀 */
export const ACCOUNT_AFFILIATION_INFO_TITLE = '소속정보' as const;

/** 소속 정보 변경 성공 메시지 */
export const ACCOUNT_CHANGED_AFFILIATION_INFO_MESSAGE = '소속 정보가 변경되었습니다.' as const;

/** 소속 정보 필드 이름 */
export const ACCOUNT_AFFILIATION_INFO_FIELD_NAMES = {
  COMPANY_NAME: 'companyName',
  CELL_PHONE: 'cellPhone',
  NAME: 'name',
  PART_NAME: 'partName',
} as const;

/** 소속 정보 필드 라벨 */
export const ACCOUNT_AFFILIATION_INFO_LABELS = {
  COMPANY_NAME: '회사/단체명',
  CELL_PHONE: '담당자 연락처',
  NAME: '담당자 이름',
  PART_NAME: '부서명',
} as const;

/** 소속 정보 필드 에러 텍스트 */
export const ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES = {
  REQUIRED_COMPANY_NAME: '회사/단체명을 입력해주세요.',
  REQUIRED_CELL_PHONE: '담당자 연락처를 입력해주세요.',
  REQUIRED_NAME: '담당자 이름을 입력해주세요.',
  REQUIRED_PART_NAME: '부서명을 입력해주세요.',
} as const;

/** 소속 정보 헬퍼 텍스트 */
export const ACCOUNT_AFFILIATION_FIELD_HELPER_TEXTS = {
  CELL_PHONE: '하이픈(-)을 함께 입력해주세요.',
} as const;
