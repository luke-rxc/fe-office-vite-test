/**
 * 권한 리스트 영역 제목
 */
export const PROVIDER_ROLE_LIST_LIST_TITLE = '권한 정보' as const;

/**
 * 관리 입점사 추가 버튼 라벨
 */
export const PROVIDER_ADD_BUTTON_LABEL = '관리 입점사 추가' as const;

/**
 * 부여된 권한 항목이 없는 경우 표시할 텍스트
 */
export const PROVIDER_ROLE_LIST_EMPTY_TEXT = '부여된 권한 리스트가 없습니다' as const;

/**
 * 관리 입점사별 권한 폼 네임
 */
export const PROVIDER_ROLE_LIST_FIELD_NAMES = {
  IS_ROOT: 'isRoot',
} as const;

/**
 * 관리 입점사별 권한 폼 라벨
 */
export const PROVIDER_ROLE_LIST_FIELD_LABELS = {
  IS_ROOT: '최고 관리자 권한',
} as const;

/**
 * 액션 버튼 라벨
 */
export const PROVIDER_ROLE_LIST_ACTION_BUTTON_LABELS = {
  EDIT: '수정',
  SAVE: '저장',
  CANCEL: '취소',
  DELETE: '삭제',
} as const;

/**
 * 관리 입점사 권한 변경 성공 메시지
 */
export const PROVIDER_ROLE_LIST_EDIT_SUCCEED_MESSAGE = '입점사 권한 수정이 완료되었습니다.' as const;

/**
 * 관리 입점사 수정 취소전 확인 메시지
 */
export const PROVIDER_ROLE_LIST_EDIT_CANCEL_CONFIRM_MESSAGE =
  '변경된 내용은 저장되지 않습니다.\n작업을 취소하시겠습니까?' as const;

/**
 * 관리 입점사 제거 성공 메시지
 */
export const PROVIDER_DELETE_SUCCEED_MESSAGE = '입점사가 제거 되었습니다.' as const;

/**
 * 관리 입점사 제거전 확인 메시지
 */
export const PROVIDER_DELETE_CONFIRM_MESSAGE = '입점사를 삭제하시겠습니까?' as const;
