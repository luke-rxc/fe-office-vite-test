/**
 * 정산 목록 아이템
 */
export interface SettlementItemSchema {
  /** 정산 완료건수 */
  completeCount: number;
  /** 정산 회차 */
  count: number;
  /** 정산 완료 여부 */
  isComplete: boolean;
  /** 정산 가능 여부 */
  isRunnable: boolean;
  /** 지급 완료 건수 */
  paidCount: number;
  /** 정산 기간 */
  range: string;
  /** 정산 주기 */
  round: number;
  /** 세금계산서 발행 건수 */
  taxBillCount: number;
  /** 정산 대상 수 */
  totalCount: number;
  /** 정산 년월 "2022.4(1)" */
  yearMonth: string;
  /** 정산 년월 "202204" */
  yyyyMm: string;
}
