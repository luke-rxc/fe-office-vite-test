/**
 * 입력값에서 숫자,문자만 추출
 */
export const toConvertExceptSpecialCharacter = (value: string) => {
  const regex = /[^0-9a-zA-Z]/g;
  return value.replace(regex, '');
};
