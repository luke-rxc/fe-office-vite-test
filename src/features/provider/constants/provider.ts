import { SelectTypeModel } from '../models';

/*
 * 배송 비용 타입
 */
export enum ShippingCostType {
  FREE = 'FREE', // 무료
  PAY = 'PAY', // 유료
  IFPAY = 'IFPAY', // 조건부무료
}

/*
 * 배송 방법
 */
export enum ShippingType {
  COMPANY = 'COMPANY', // 택배
  DIRECT = 'DIRECT', // 직접배송
}

/**
 * 직접배송 코드값
 */
export const ShippingDirect: SelectTypeModel = {
  code: 'DIRECT',
  label: '직접배송',
};

/**
 * 정산방식 리스트
 */
export const CALCULATE_TYPE_LIST: SelectTypeModel[] = [
  { label: '월 1회 정산', code: 1 },
  { label: '월 2회 정산', code: 2 },
];

/**
 * 입점사 관련 담당자타입
 */
export const PROVIDER_PERSON_TYPE = {
  LOGISTICS: 'logistics', // 물류/배송담당자
  CS: 'cs', // CS담당자
  MD: 'md', // 상품담당자
  SETTLEMENT: 'settlement', // 정산담당자
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PROVIDER_PERSON_TYPE = typeof PROVIDER_PERSON_TYPE[keyof typeof PROVIDER_PERSON_TYPE];
