/**
 * 매니저 초대시 공통 PROVIDER_ID
 */
export const MANAGER_INVITATION_APPROVAL_PROVIDER_ID = 1;

/**
 * 매니저 초대 승인 모달 제목
 */
export const MANAGER_INVITATION_APPROVAL_FILED_LEGEND = '매니저 계정 활성화' as const;

/**
 * 파트너 초대 승인 모달 제목
 */
export const PARTNER_INVITATION_APPROVAL_FILED_LEGEND = '파트너 계정 활성화' as const;

/**
 * 초대 승인 submit 버튼 라벨
 */
export const INVITATION_APPROVAL_BUTTON_LABEL = '활성화 하기' as const;

/**
 * 초대 승인 성공 메시지
 */
export const INVITATION_APPROVAL_REQUEST_SUCCESS_MESSAGE = '계정 활성화가 완료되었습니다.' as const;

/**
 * 초대 승인 모달 닫기 확인 메시지
 */
export const INVITATION_APPROVAL_MODAL_CLOSE_CONFIRM_MESSAGE =
  '팝업창을 닫으시겠습니까?\n작성된 내용은 저장되지 않습니다.' as const;

/**
 * 초대 승인 성공 메시지
 */
export const INVITATION_APPROVAL_SUCCESS_MASSAGE = '초대가 성공적으로 완료되었습니다.' as const;

/**
 * 에러 텍스트
 */
export const INVITATION_APPROVAL_FIELD_ERROR_MESSAGES = {
  REQUIRED_PROVIDER: '입점사명은 필수 항목입니다.',
} as const;

/**
 * 헬퍼 텍스트
 */
export const INVITATION_APPROVAL_FIELD_HELPER_TEXTS = {
  IS_ROOT: '* 최고 관리자는 아래 권한 선택과 상관없이 모든 권한을 가집니다.',
} as const;

/**
 * 초대 승인 폼 네임
 */
export const INVITATION_APPROVAL_FILED_NAMES = {
  /* ====== 공통 ====== */
  EMAIL: 'email',
  COMPANY_NAME: 'companyName',
  NAME: 'name',
  CELL_PHONE: 'cellPhone',
  PART_NAME: 'partName',
  IS_ROOT: 'isRoot',
  ROLE_IDS: 'roleIds',
  /* ===== 파트너 ===== */
  PROVIDER_ID: 'providerId',
} as const;

/**
 * 초대 폼 라벨
 */
export const INVITATION_APPROVAL_FILED_LABELS = {
  /* ====== 공통 ====== */
  EMAIL: '이메일',
  COMPANY_NAME: '회사/단체명',
  NAME: '이름',
  CELL_PHONE: '담당자 연락처',
  PART_NAME: '부서명',
  IS_ROOT: '최고 관리자 권한',
  ROLE_IDS: '권한 목록',
  SELECTED_ROLES: '선택한 권한',
  UNSELECTED_ROLES: '미선택 권한',
  /* ===== 파트너 ===== */
  PROVIDER_ID: '입점사',
} as const;
