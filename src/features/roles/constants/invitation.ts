/**
 * 매니저 초대 모달 제목
 */
export const MANAGER_INVITATION_FILED_LEGEND = '매니저 초대' as const;

/**
 * 파트너 초대 모달 제목
 */
export const PARTNER_INVITATION_FILED_LEGEND = '파트너 초대' as const;

/**
 * 계정 초대 모달 Submit 버튼 텍스트
 */
export const INVITATION_BUTTON_LABEL = '초대하기' as const;

/**
 * 계정 초대 성공 토스트 메시지
 */
export const INVITATION_REQUEST_SUCCESS_MESSAGE = '초대 신청이 완료되었습니다.' as const;

/**
 * 계정 초대 팝업 닫기 확인 메시지
 */
export const INVITATION_MODAL_CLOSE_CONFIRM_MESSAGE =
  '팝업창을 닫으시겠습니까?\n작성된 내용은 저장되지 않습니다.' as const;

/**
 * 매니저 초대시 고정된 회사명
 */
export const MANAGER_INVITATION_COMPANY_NAME = '(주)알엑스씨' as const;

/**
 * 계정 초대 폼 네임
 */
export const INVITATION_FILED_NAMES = {
  COMPANY_NAME: 'companyName',
  EMAIL: 'email',
  NAME: 'name',
  CELL_PHONE: 'cellPhone',
  PART_NAME: 'partName',
} as const;

/**
 * 매니저 초대 팝업 라벨
 */
export const INVITATION_FILED_LABELS = {
  COMPANY_NAME: '회사/단체명',
  EMAIL: '이메일 주소',
  NAME: '담당자 이름',
  CELL_PHONE: '담당자 연락처',
  PART_NAME: '부서명',
} as const;

/**
 * 에러 텍스트
 */
export const INVITATION_FIELD_ERROR_MESSAGES = {
  REQUIRED_EMAIL: '이메일 주소를 입력해주세요.',
  REQUIRED_NAME: '담당자 이름을 입력해주세요.',
  REQUIRED_CELL_PHONE: '담당자 연락처를 입력해주세요.',
  REQUIRED_COMPANY_NAME: '회사/단체명을 입력해주세요.',
  REQUIRED_PART_NAME: '부서명을 입력해주세요.',
  INVALID_EMAIL: '이메일 형식에 맞지 않습니다.',
  INVALID_CELL_PHONE: '연락처 형식에 맞지 않습니다. (하이픈(-)을 함께 입력해주세요)',
} as const;

/**
 * 헬퍼 텍스트
 */
export const INVITATION_FIELD_HELPER_TEXTS = {
  EMAIL: '공백과 "(),:;<>[\\] . 는 사용할 수 없습니다.',
  CELL_PHONE: '하이픈(-)을 함께 입력해주세요.',
} as const;
