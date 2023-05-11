/**
 * 백앤드에서 동일하게 사용하는 정규표현식
 * @todo roles 내의 util 과 동일 (통합 필요)
 */
const rxg = {
  email: new RegExp(
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ),
  phone: new RegExp(/\d{2,3}-\d{3,4}-\d{4}/),
};

/**
 * 문자열의 유효성 체크
 */
export const isValid = ({ type, value }: { type: keyof typeof rxg; value: string }): boolean => {
  return rxg[type].test(value);
};

/**
 * 비밀 번호 유효성
 */
export const isPasswordValid = (password: string): boolean => {
  return /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password);
};
