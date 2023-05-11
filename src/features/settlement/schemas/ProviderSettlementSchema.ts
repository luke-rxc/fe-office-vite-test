/**
 * 입점사별(상세) 정산 목록 아이템
 */
export interface ProviderSettlementItemSchema {
  /** 정산 id */
  id: number;
  /** 정산 년월 "2022.01 (1/1)" */
  yyyyMm: string;
  /** 입점사 정보 */
  provider: { id: number; name: string };
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

/**
 * 엑셀 다운로드를 위한 테이블 데이터 포멧 스키마
 */
export interface ExportExcelSchema {
  headers: {
    /** items 참조키 */
    key: string;
    /** 테이블 헤더 텍스트 */
    label: string;
    sortNum: number;
  }[];
  /** 테이블 데이터 */
  items: { [key: string]: string | number }[];
}
