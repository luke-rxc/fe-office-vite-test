/**
 *
 */
export const ADD_PROVIDER_TITLE = '관리 입점사 추가' as const;

/**
 *
 */
export const ADD_PROVIDER_BUTTON_LABEL = '입점사 추가' as const;

/**
 * 초대 승인 모달 닫기 확인 메시지
 */
export const ADD_PROVIDER_MODAL_CLOSE_CONFIRM_MESSAGE =
  '팝업창을 닫으시겠습니까?\n작성된 내용은 저장되지 않습니다.' as const;

/**
 *
 */
export const ADD_PROVIDER_FIELD_HELPER_TEXTS = {
  IS_ROOT: '* 최고 관리자는 아래 권한 선택과 상관없이 모든 권한을 가집니다.',
} as const;

/**
 *
 */
export const ADD_PROVIDER_SUCCESS_MESSAGE = '관리 입점사가 추가되었습니다.' as const;

/**
 *
 */
export const ADD_PROVIDER_FILED_NAMES = {
  PROVIDER_ID: 'providerId',
  IS_ROOT: 'isRoot',
  ROLE_IDS: 'roleIds',
} as const;

/**
 *
 */
export const ADD_PROVIDER_FILED_LABELS = {
  PROVIDER_ID: '입점사',
  IS_ROOT: '최고 관리자 권한',
  UNSELECTED_ROLES: '미선택 권한',
  SELECTED_ROLES: '선택한 권한',
} as const;

/**
 *
 */
export const ADD_PROVIDER_FIELD_ERROR_MESSAGES = {
  REQUIRED_PROVIDER: '입점사명은 필수 항목입니다.',
} as const;
