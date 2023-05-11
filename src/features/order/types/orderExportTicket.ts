import { QueryState } from '@hooks/useQueryState';
import { OrderSearchFieldType } from '../constants';
import { ComboMDModel, ProviderComboModel, TicketComboModel } from '../models';

/**
 * 출고리스트 검색 form field
 */
export interface OrderExportTicketSearchFormField {
  // 출고일 검색범위(시작)
  fromDate: string;
  // 검색어
  keyword: string;
  // 티켓 타입
  goodsKindList: Array<boolean>;
  // 티켓 상태
  ticketStatusList: Array<boolean>;
  provider: ProviderComboModel;
  md: ComboMDModel;
  // 주문 검색어 타입
  searchType: string;
  // 출고일 검색범위(종료)
  toDate: string;
  // 반품요청 포함여부
  returnedYN: boolean;
  // 티켓
  ticket: TicketComboModel;
}

/**
 * 출고리스트 검색 params
 */
export interface OrderExportTicketListSearchParams {
  page: string;
  size: string;
  // 주문일 검색범위(시작)
  fromDate: number;
  // 검색어
  keyword: string;
  // 티켓 타입
  goodsKindList: Array<string>;
  // 티켓 상태
  ticketStatusList: Array<string>;
  // 주문 검색어 타입
  searchType: OrderSearchFieldType;
  // 주문일 검색범위(종료)
  toDate: number;
  // 입점사 id
  providerId: string;
  // md id
  mdId: string;
  time: string;
  // 반품요청 포함여부
  returnedYN: string;
  // ticket id
  ticketId: string;
}

/**
 * 출고리스트 query state
 */
export interface OrderExportTicketListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  searchType: string;
  keyword: string;
  fromDate: string;
  toDate: string;
  goodsKindList: string;
  ticketStatusList: string;
  providerId: string;
  mdId: string;
  time: string;
  purchaseConfirmYN: string;
  returnedYN: string;
  ticketId: string;
}

/**
 * 출고(티켓) excel item schema
 */
export interface OrderExportTicketExcelItem {
  index: number;
  // 주문아이디
  orderId: string;
  // 상품명
  goodsName: string;
  // 수량
  quantity: string;
  // 옵션 리스트
  itemOptionList: string;
  // 주문자명
  ordererName: string;
  // 받는사람 이름
  recipientName: string;
  // 받는사람 연락처
  recipientPhone: string;
  // 주문 결제완료일
  orderPaymentDateText: string;
  // 티켓 사용 시작일
  usableStartDateText: string;
  // 티켓 사용 종료일
  usableEndDateText: string;
  // 티켓 상태
  exportTicketStatus: string;
  // 티켓 사용일
  usedDateText: string;
  // 티켓 타입
  goodsKind: string;
  // 입금가
  commissionPrice: string;
}

/**
 * 티켓 일괄 사용처리 params
 */
export interface OrderExportTicketBulkUsedParams {
  // 주문일 검색범위(시작)
  fromDate: number;
  // 주문일 검색범위(종료)
  toDate: number;
  // 티켓 타입
  goodsKind: string;
  // 티켓 상태
  ticketStatus: string;
  // 검색어
  keyword: string;
  // ticket id
  ticketId: string;
}

/**
 * 주문 출고 상태변경 excel item schema
 */
export interface OrderExportStatusChangeExcelItem {
  exportId: string;
  orderId: string;
}

/**
 * 주문 출고 상태변경 response
 */
export type OrderExportStatusChangeResponse =
  | {
      success: true;
      exportId: string;
      orderId: string;
    }
  | {
      success: false;
      message: string;
      exportId: string;
      orderId: string;
    };

/**
 * 주문 출고 상태변경 excel item schema
 */
export interface OrderExportBookingDateChangeExcelItem {
  exportId: string;
  orderId: string;
  bookingDate: number | string;
  errorMessage?: string;
}

/**
 * 주문 출고 투숙일지정 response
 */
export type OrderExportBookingDateChangeResponse =
  | {
      success: true;
      exportId: string;
      orderId: string;
      bookingDate: string;
    }
  | {
      success: false;
      message: string;
      exportId: string;
      bookingDate: string;
      orderId: string;
    };
