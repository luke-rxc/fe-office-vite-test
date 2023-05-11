import { CodeInfo } from './OrderSchema';

/**
 * 주문 출고(티켓) item option
 */
export interface OrderExportTicketItemOption {
  title: string;
  value: string;
}

/**
 * 주문 출고(티켓) status
 */
export interface OrderExportTicketStatus {
  step: string;
  name: string;
}

/**
 * 주문 출고(티켓)리스트 item schema
 */
export interface OrderExportTicketItemSchema {
  // 출고아이디
  id: number;
  // 주문아이디
  orderId: number;
  // 상품명
  goodsName: string;
  // 수량
  quantity: string;
  // 옵션 리스트
  itemOptionList: Array<OrderExportTicketItemOption>;
  // 주문자명
  ordererName: string;
  // 받는사람 이름
  recipientName: string;
  // 받는사람 연락처
  recipientPhone: string;
  // 주문 결제완료일
  orderPaymentDate: number;
  // 티켓 사용 시작일
  usableStartDate: number;
  // 티켓 사용 종료일
  usableEndDate: number;
  // 티켓 상태
  exportTicketStatus: OrderExportTicketStatus;
  // 티켓 사용일
  usedDate: string;
  // 티켓 타입
  goodsKind: CodeInfo;
  // 티켓 만료여부
  isExpired: boolean;
  // 반품정보
  returnStatus: CodeInfo | null;
  // 투숙일
  bookingDate: number | null;
  // 입금가
  commissionPrice: number | null;
  // 입점사명
  providerName: string;
}
