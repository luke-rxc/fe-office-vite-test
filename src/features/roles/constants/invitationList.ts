/**
 * 초대 현황 리스트 제목
 */
export const INVITATION_LIST_TITLE = '초대 현황' as const;

/**
 * 초대 일시
 */
export const INVITATION_CREATED_DATE_FORMAT = 'yyyy-MM-dd HH:mm' as const;

/**
 * 초대 승인 모달 OPEN 버튼 텍스트
 */
export const INVITATION_APPROVAL_MODAL_BUTTON_LABEL = '계정 활성화' as const;

/**
 * 초대 취소 버튼 텍스트
 */
export const INVITATION_CANCEL_BUTTON_LABEL = '초대 취소' as const;

/**
 * 초대 취소전 확인 메시지
 */
export const INVITATION_CANCEL_CONFIRM_MASSAGE = '님을 초대를 취소하시겠습니까?' as const;

/**
 * 초대 취소 성공 메시지
 */
export const INVITATION_DELETE_SUCCESS_MASSAGE = '초대가 취소되었습니다.' as const;

/**
 * 초대 목록 테이블 데이터 키
 */
export const INVITATION_TABLE_DATA_KEYS = {
  /* ====== 공통 ====== */
  ID: 'id',
  INVITATION_USER_EMAIL: 'invitationUserEmail',
  EMAIL: 'email',
  NAME: 'name',
  STATUS: 'status',
  CREATED_DATE: 'createdDate',
  /* ===== 매니저 ===== */
  PART_NAME: 'partName',
  /* ===== 파트너 ===== */
  COMPANY_NAME: 'companyName',
} as const;

/**
 * 계정 목록 테이블 제목
 */
export const INVITATION_TABLE_HEADER_LABELS = {
  /* ====== 공통 ====== */
  ID: '',
  CREATED_DATE: '초대 일시',
  INVITATION_USER_EMAIL: '초대한 계정',
  EMAIL: '이메일',
  NAME: '이름',
  STATUS: '초대 상태',
  /* ===== 매니저 ===== */
  PART_NAME: '부서명',
  /* ===== 파트너 ===== */
  COMPANY_NAME: '회사/단체명',
} as const;
