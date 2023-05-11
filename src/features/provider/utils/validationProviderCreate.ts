import * as Yup from 'yup';

/**
 * 입점사 등록
 */
export const validationProviderCreate = Yup.object().shape({
  businessType: Yup.string().required('사업자 유형을 선택해 주세요.'),
  name: Yup.string().required('입점사명을 입력해 주세요.'),
  businessNumber: Yup.string().length(12, '12자리를 입력해 주세요.').required('사업자번호를 입력해 주세요.'),
});
