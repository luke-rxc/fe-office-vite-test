/**
 * 쿼리 키
 */
export const QUERY_KEY = {
  REPLY_LIST: 'REPLY_LIST',
};

/**
 * 검색타입
 */
export const REPLY_SEARCH_TYPE = {
  USER_NICKNAME: 'USER_NICKNAME', // 사용자 닉네임
  USER_EMAIL: 'USER_EMAIL', // 사용자 이메일
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type REPLY_SEARCH_TYPE = typeof REPLY_SEARCH_TYPE[keyof typeof REPLY_SEARCH_TYPE];

export const REPLY_SEARCH_TYPE_LABEL: {
  [k in REPLY_SEARCH_TYPE]: string;
} = {
  USER_NICKNAME: '사용자 닉네임',
  USER_EMAIL: '사용자 이메일',
} as const;

/**
 * 검색타입 리스트 옵션
 */
export const REPLY_SEARCH_TYPE_OPTIONS = Object.keys(REPLY_SEARCH_TYPE).map((key) => {
  return {
    label: REPLY_SEARCH_TYPE_LABEL[key],
    value: REPLY_SEARCH_TYPE[key],
  };
});

/**
 * 댓글 상태 조회 타입
 */
export const REPLY_STATUS_TYPE = {
  NORMAL: 'NORMAL', // 일반
  ADMIN_DELETE: 'ADMIN_DELETE', // 관리자 삭제
  USER_DELETE: 'USER_DELETE', // 사용자 삭제
  DROP_OUT_DELETE: 'DROP_OUT_DELETE', // 탈퇴 삭제
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type REPLY_STATUS_TYPE = typeof REPLY_STATUS_TYPE[keyof typeof REPLY_STATUS_TYPE];

export const REPLY_STATUS_TYPE_LABEL: {
  [k in REPLY_STATUS_TYPE]: string;
} = {
  NORMAL: '일반',
  ADMIN_DELETE: '관리자 삭제',
  USER_DELETE: '사용자 삭제',
  DROP_OUT_DELETE: '탈퇴 삭제',
};

/**
 * 유저 상태 타입
 */
export const REPLY_USER_STATUS_TYPE = {
  ACTIVE: 'ACTIVE', // 정상, ,
  DROP_OUT: 'DROP_OUT', // 탈퇴
  INACTIVE: 'INACTIVE', // 휴면
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type REPLY_USER_STATUS_TYPE = typeof REPLY_USER_STATUS_TYPE[keyof typeof REPLY_USER_STATUS_TYPE];

export const REPLY_USER_STATUS_TYPE_LABEL: {
  [k in REPLY_USER_STATUS_TYPE]: string;
} = {
  ACTIVE: '정상',
  DROP_OUT: '탈퇴',
  INACTIVE: '휴면',
};

/**
 * 댓글 상태 리스트 옵션
 */
export const REPLY_STATUS_OPTIONS = Object.keys(REPLY_STATUS_TYPE).map((key) => {
  return {
    label: REPLY_STATUS_TYPE_LABEL[key],
    value: REPLY_STATUS_TYPE[key],
  };
});

/**
 * 댓글 기간조회 타입
 */
export const REPLY_SEARCH_DATE_TYPE = {
  ALL: 'ALL', // 전체 기간
  CREATE: 'CREATE', // 댓글 작성일
  DELETE_DATE: 'DELETE_DATE', // 댓글 삭제일
  ADMIN_DATE: 'ADMIN_DATE', // 관리자 처리일
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type REPLY_SEARCH_DATE_TYPE = typeof REPLY_SEARCH_DATE_TYPE[keyof typeof REPLY_SEARCH_DATE_TYPE];

export const REPLY_SEARCH_DATE_TYPE_LABEL: {
  [k in REPLY_SEARCH_DATE_TYPE]: string;
} = {
  ALL: '전체 기간',
  CREATE: '댓글 작성일',
  DELETE_DATE: '댓글 삭제일',
  ADMIN_DATE: '관리자 처리일',
};

/**
 * 댓글 기간조회타입 리스트 옵션
 */
export const REPLY_SEARCH_DATE_TYPE_OPTIONS = Object.keys(REPLY_SEARCH_DATE_TYPE).map((key) => {
  return {
    label: REPLY_SEARCH_DATE_TYPE_LABEL[key],
    value: REPLY_SEARCH_DATE_TYPE[key],
  };
});

// Excel Export Header
export const ExcelExportListHeader = [
  'ID',
  '댓글 작성일',
  '댓글 삭제일',
  '댓글 내용',
  '사용자 id',
  '사용자 닉네임',
  '사용자 이메일',
  '사용자 상태',
  '댓글 신고수',
  '댓글 신고상세',
  '댓글 상태',
  '관리자 처리일',
];
