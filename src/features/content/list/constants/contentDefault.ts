/**
 * 컨텐츠 중복체크 타입
 */
export const CONTENT_VALID_TYPE = {
  NAME: 'name', // 컨텐츠명
  CODE: 'code', // 컨텐츠 코드
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CONTENT_VALID_TYPE = typeof CONTENT_VALID_TYPE[keyof typeof CONTENT_VALID_TYPE];

/**
 * 컨텐츠명 입력제한
 */
export const CONTENT_NAME_REGEX = {
  REGEX: /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]*$/,
  MESSAGE: '한글, 영문(대소문자), 숫자, 공백만 입력 가능합니다.',
} as const;

/**
 * 컨텐츠명 최대 길이
 */
export const CONTENT_NAME_LENGTH = 17;

/**
 * 컨텐츠코드 입력제한
 */
export const CONTENT_CODE_REGEX = {
  REGEX: /^[a-z0-9]*$/,
  MESSAGE: '영문(소문자), 숫자만 입력 가능합니다.',
} as const;

/**
 * 컨텐츠코드 최대 길이
 */
export const CONTENT_CODE_LENGTH = 15;
