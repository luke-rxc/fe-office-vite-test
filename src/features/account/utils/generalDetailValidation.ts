import * as yup from 'yup';
import { isValid } from '.';

/**
 * 소속 정보 필드 유효성 검사
 * @todo 정책 정해지면 수정 예정
 */
export const generalDetailValidation = yup.object().shape({
  // partName: yup.string().required('부서명을 입력해주세요.'),
  name: yup.string().required('이름을 입력해주세요.'),
  cellPhone: yup.string().test('', '하이픈(-)을 함께 입력해주세요.', (value) => {
    if (value === '') {
      return true;
    }
    return isValid({ type: 'phone', value });
  }),
});
