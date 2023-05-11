import * as Yup from 'yup';
import { ShippingCostType, ShippingType } from '../constants';

/**
 * 배송지 등록 form validation
 */
export const validationShippingRegisterForm = Yup.object().shape({
  // 배송지명
  shippingName: Yup.string().required('배송주소명을 입력해 주세요.'),
  // 배송 방법
  shippingType: Yup.string(),
  // 택배사
  shippingCompany: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .nullable()
    .when('shippingType', {
      is: (value: string) => value === ShippingType.COMPANY,
      then: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      })
        .nullable()
        .required('택배사를 선택해 주세요.'),
    }),
  // 배송비 정책(유료,무료,조건부무료)
  shippingCostType: Yup.string().required('배송비 설정타입을 선택해 주세요.'),
  // 유료배송비
  payCost: Yup.number().when('shippingCostType', {
    is: (value: string) => value === ShippingCostType.PAY,
    then: Yup.number()
      .min(1, '금액을 입력해 주세요.')
      .typeError('금액을 입력해 주세요.')
      .required('금액을 입력해 주세요.'),
  }),
  // 조건부 무료 배송비
  ifpayCost: Yup.number().when('shippingCostType', {
    is: (value: string) => value === ShippingCostType.IFPAY,
    then: Yup.number()
      .min(1, '금액을 입력해 주세요.')
      .typeError('금액을 입력해 주세요.')
      .required('금액을 입력해 주세요.'),
  }),
  // 조건부 금액 조건
  ifpayFreePrice: Yup.number().when('shippingCostType', {
    is: (value: string) => value === ShippingCostType.IFPAY,
    then: Yup.number()
      .min(1, '금액을 입력해 주세요.')
      .typeError('금액을 입력해 주세요.')
      .required('금액을 입력해 주세요.'),
  }),
  // 추가 배송비 사용여부
  useExtraAddCosts: Yup.string().required('required'),
  // 제주 추가금액
  jejuAddCost: Yup.number().min(0, '금액을 입력해 주세요.').typeError('금액을 입력해 주세요.'),
  // 기타 추가금액
  etcAddCost: Yup.number().min(0, '금액을 입력해 주세요.').typeError('금액을 입력해 주세요.'),
  // 반품/교환 배송비
  returnCost: Yup.number()
    .min(0, '금액을 입력해 주세요.')
    .typeError('숫자만 입력해 주세요.')
    .required('금액을 입력해 주세요.'),
  // 출고지 주소
  sendingAddress: Yup.object({
    postCode: Yup.string().required(),
    address: Yup.string().required(),
    addressDetail: Yup.string().required(),
  }),
  // 반품교환주소
  returnAddress: Yup.object({
    postCode: Yup.string().required(),
    address: Yup.string().required(),
    addressDetail: Yup.string().required(),
  }),
  returnPhone: Yup.string()
    .required('반품/교환 연락처를 입력해 주세요.')
    .matches(/^\d{2,4}-\d{3,4}-\d{4}$|^\d{4}-\d{4}$/, '연락처는 숫자와 구분자(-)를 포함해서 입력해주세요.'),
});

/**
 * 입점사 기본정보 form validation
 */
export const validationProviderDefaultForm = Yup.object().shape({
  // 입점사명
  name: Yup.string(),
  // 브랜드 정보
  brands: Yup.array().of(
    Yup.object({
      id: Yup.number(),
      name: Yup.string(),
    }),
  ),
  // 사업자 유형
  businessType: Yup.string(),
  // 사업자 번호
  businessNumber: Yup.string(),
  // 업태
  businessCondition: Yup.string().required('업태를 입력해 주세요.'),
  // 종목
  businessCategory: Yup.string().required('종목을 입력해 주세요.'),
  // 사업자 소재지
  companyAddress: Yup.object({
    postCode: Yup.string().required(),
    address: Yup.string().required(),
    addressDetail: Yup.string().required(),
  }),
  companyEmail: Yup.string()
    .matches(
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])([\w-_\.]+)*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]+$/,
      'e-mail 주소를 확인 해 주세요.',
    )
    .required('대표 E-mail을 입력해 주세요.'),
  //통신판매업 신고번호
  mailOrderSalesNumber: Yup.string().required('통신판매업 신고번호를 입력해 주세요.'),
  // 대표자명
  presidentName: Yup.string().required('대표자명을 입력해 주세요.'),
  // 대표번호
  phoneNumber: Yup.string(),
  // 홈페이지url
  homepageUrl: Yup.string(),
  // 사업자 사본
  businessNumberImageId: Yup.number()
    .typeError('사업자 사본을 등록해 주세요.')
    .required('사업자 사본을 등록해 주세요.'),
});

/**
 * 입점사 정산정보 form validation
 */
export const validationProviderCalculateForm = Yup.object().shape({
  // 입점사 수수료
  commissionRate: Yup.number()
    .min(0, '수수료를 확인 해주세요.')
    .max(100, '수수료는 값이 100을 넘을수 없습니다.')
    .typeError('수수료를 확인 해주세요.')
    .test('commissionRate', '소수점 이하 최대 한자리까지 입력 가능합니다.', (value) =>
      /^\d+((.)|(.\d{0,1})?)$/.test(`${value}`),
    ),
  // 정산 방식
  calculateCount: Yup.string().required('정산 방식을 입력해 주세요.'),
  // 입금은행
  bank: Yup.object({
    code: Yup.string(),
    name: Yup.string(),
  })
    .nullable()
    .required('입금은행을 선택해 주세요.'),
  // 세금계산서수령 E-mail
  accountEmail: Yup.string()
    .matches(
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])([\w-_\.]+)*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]+$/,
      'e-mail 주소를 확인 해 주세요.',
    )
    .required('세금계산서수령 E-mail을 입력해 주세요.'),
  // 예금주명
  depositor: Yup.string().required('예금주명을 입력해 주세요.'),
  // 계좌번호
  accountNumber: Yup.string().required('계좌번호를 입력해 주세요.'),
  // 통장 사본
  accountImageId: Yup.number().typeError('통장 사본을 등록해 주세요.').required('통장 사본을 등록해 주세요.'),
});

export const validationProviderPersonForm = Yup.object().shape({
  person: Yup.array().of(
    Yup.object().shape({
      type: Yup.string(),
      name: Yup.string().required('담당자명을 입력해 주세요.'),
      phone: Yup.string().required('연락처를 입력해 주세요.'),
      email: Yup.string()
        .matches(
          /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])([\w-_\.]+)*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]+$/,
          'e-mail 주소를 확인 해 주세요.',
        )
        .required('e-mail을 입력해 주세요.'),
    }),
  ),
});
