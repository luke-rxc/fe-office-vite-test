export const QUERY_KEYS = {
  PROVIDER_DETAIL: 'providerDetail',
  PROVIDER_LIST: 'providerList',
  PROVIDER_SHIPPING_LIST: 'providerShippingList',
  SHIPPING_COUNTRY: 'shippingCountry',
  DELIVERY_COMPANY_LIST: 'deliveryCompanyList',
  BANK_LIST: 'bankList',
};

/**
 * 사업자 유형 타입
 */
export const BUSINESS_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL', // 개인
  CORPORATE: 'CORPORATE', // 법인
  // PRIVATE: 'PRIVATE', // 일반 개인회원(사업자없음)
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BUSINESS_TYPE = typeof BUSINESS_TYPE[keyof typeof BUSINESS_TYPE];

export const BUSINESS_TYPE_LABEL: {
  [k in BUSINESS_TYPE]: string;
} = {
  INDIVIDUAL: '개인',
  CORPORATE: '법인',
  // PRIVATE: '일반 개인회원(사업자없음)',
};

/**
 * 사업자 유형 옵션
 */
export const BUSINESS_TYPE_OPTIONS = Object.keys(BUSINESS_TYPE).map((key) => {
  return {
    label: BUSINESS_TYPE_LABEL[key],
    value: BUSINESS_TYPE[key],
  };
});
