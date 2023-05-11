import { TOption } from '@components/Select';

/** 입점사명 리스트 */
export type ProviderNamesForComboBox = string[];

/** 입점사별정산 정산 리스트 검색폼 */
export interface ProviderSettlementSearchForm {
  yyyyMm: number; // timestamp
  providerName: string;
  isPaid: 'null' | 'false' | 'true';
  isTaxBillPublished: 'null' | 'false' | 'true';
  round: 0 | 1 | 2;
  count: 0 | 1 | 2;
  page: number;
  size: number;
}

/**  입점사별 정산 폼요소에 사용될 옵션리스트들 */
export interface ProviderSettlementSearchFormOptions {
  tax: readonly TOption[];
  paid: readonly TOption[];
  count: readonly TOption[];
  round: readonly TOption[];
  providerName: ProviderNamesForComboBox;
}

/** 입점사별정산 리스트 아이템 데이터 */
export interface ProviderSettlementListItem {
  /** 정산 id */
  id: number;
  /** 정산 년월 "2022.01 (1/1)" */
  yyyyMm: string;
  /** 입점사 정보 */
  providerName: string;
  /** 상태 */
  status: '준비' | '진행중' | '완료';
  /** 판매금액 */
  price: number;
  /** 판매금액 - 입점사 수수료 */
  commissionPrice: number;
  /** 프리즘(본사) 부담 쿠폰금액 */
  salesCostManagerCoupon: number;
  /** 입점사 부담 쿠폰금액 */
  salesCostProviderCoupon: number;
  /** 프리즘(본사) 부담 적립금 */
  point: number;
  /** 배송비 */
  shippingCost: number;
  /** 반품/교환 배송비 */
  returnShippingCost: number;
  /** 환불금액 */
  returnPrice: number;
  /** 정산금액 */
  settlementPrice: number;
  /** 정산금 지급 여부 */
  isPaid: boolean;
  /** 세금계산서 발행 여부 */
  isTaxBillPublished: boolean;
  /** 재정산 가능 여부 */
  reExecutable: boolean;
  /** 정산상세조회 다운로드 가능여부 */
  downloadable: boolean;
  /** 정산 생성일시 */
  createdDate: number;
  /** 정산 대상 기간 */
  range: string;
}
