import { TOption } from '@components/Select';

/** 정산 리스트 검색폼 */
export interface SettlementSearchForm {
  year: number; // timestamp
  round: 0 | 1 | 2;
  count: 0 | 1 | 2;
  page: number;
  size: number;
}

/** 정산 폼요소에 사용될 옵션리스트들 */
export interface SettlementSearchFormOptions {
  round: readonly TOption[];
  count: readonly TOption[];
}

/** 정산 리스트 아이템 데이터 */
export interface SettlementListItem {
  /** 정산 년월 "202204" */
  yyyyMm: string;
  /** 정산주기 */
  round: number;
  /** 정산회차 */
  count: number;
  /** 정산완료 건수 */
  completeCount: number;
  /** 정산완료 여부 */
  isComplete: boolean;
  /** 정산 가능 여부 */
  isRunnable: boolean;
  /** 지급 완료 건수 */
  paidCount: number;
  /** 정산 기간 */
  range: string;
  /** 세금계산서 발행 건수 */
  taxBillCount: number;
  /** 정산 대상 수 */
  totalCount: number;
  /** 정산 년월 "2022.4(1)" */
  yearMonth: string;
  /** 상세 URL (입점사별 리스트 페이지) */
  url: string;
}
