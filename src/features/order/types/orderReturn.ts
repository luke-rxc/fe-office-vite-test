import { QueryState } from '@hooks/useQueryState';
import { OrderSearchFieldType, OrderSearchReturnType } from '../constants';
import { ProviderComboModel } from '../models';

/**
 * 반품 검색 form field
 */
export interface OrderReturnSearchFormField {
  // 반품일 검색범위(시작)
  fromDate: string;
  // 검색어
  keyword: string;
  // 반품상태
  returnStatusList: Array<boolean>;
  provider: ProviderComboModel;
  // 주문 검색어 타입
  searchType: string;
  // 반품/교환 타입
  returnType: string;
  // 반품일 검색범위(종료)
  toDate: string;
}

/**
 * 반품리스트 검색 params
 */
export interface OrderReturnListSearchParams {
  page: string;
  size: string;
  // 반품일 검색범위(시작)
  fromDate: number;
  // 검색어
  keyword: string;
  // 반품상태
  returnStatusList: Array<string>;
  // 반품 검색어 타입
  searchType: OrderSearchFieldType;
  // 반품/교환 타입
  returnType: OrderSearchReturnType;
  // 반품일 검색범위(종료)
  toDate: number;
  // 입점사 id
  providerId: string;
  time: string;
}

/**
 * 반품리스트 query state
 */
export interface OrderReturnListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  searchType: string;
  keyword: string;
  fromDate: string;
  toDate: string;
  returnStatusList: string;
  providerId: string;
  time: string;
  returnType: string;
}

/**
 * 주문 반품상세 회수정보 form field
 */
export interface OrderReturnDetailFormField {
  /**
   * 회수자명
   */
  name: string;
  /**
   * 연락처
   */
  phone: string;
  /**
   * 우편번호
   */
  postCode: string;
  /**
   * 주소
   */
  address: string;
  /**
   * 상세주소
   */
  addressDetail: string;
  /**
   * 회수방법
   */
  returnMethod: string;
  /**
   * 반품상세사유
   */
  // refundReason: string;
  /**
   * 반품상세사유 (추가메세지)
   */
  // refundReasonText: string;
}

/**
 * 주문 반품 요청 반품자 params
 */
export interface OrderReturnRequestSender {
  address: string;
  addressDetail: string;
  name: string;
  phone: string;
  postCode: string;
}

/**
 * 주문 반품 요청 item option params
 */
export interface OrderReturnRequestItemOption {
  id: number;
  itemId: number;
  returnEa: number;
}

/**
 * 주문 반품 요청 params
 */
export interface OrderReturnRequestParams {
  orderId: string;
  exportId: number;
  itemOptionList: Array<OrderReturnRequestItemOption>;
  reason: string;
  reasonCode: string;
  returnMethod: string;
  returnSender: OrderReturnRequestSender;
}

/**
 * 주문 반품요청 철회/거부 form field
 */
export interface OrderReturnActionFormField {
  reason: string;
  reasonItem: string;
}

/**
 * 주문 반품요청 철회/거부 params
 */
export interface OrderReturnActionRequestParams {
  returnId: string;
  reason: string;
  reasonItem: string;
}

/**
 * 주문 반품정보 변경 params
 */
export interface OrderReturnInfoRequestParams {
  returnId: string;
  returnMethod: string;
  returnSender: OrderReturnRequestSender;
}

/**
 * 주문 반품 상태변경 form field
 */
export interface OrderReturnStatusFormField {
  returnStatus: string;
  shippingCost: string;
}

/**
 * 주문 반품 상태변경 params
 */
export interface OrderReturnStatusRequestParams {
  returnId: string;
  returnStatus: string;
  shippingCost: number;
}

/**
 * 주문 반품 티켓 연동사 취소 params
 */
export interface OrderReturnExportTicketCancelRequestParams {
  returnId: string;
  exportId: string;
}

export interface OrderReturnExcelItem {
  index: number;
  id: string;
  exportId: string;
  orderId: string;
  providerName: string;
  goodsName: string;
  itemOptionList: string;
  returnEa: string;
  ordererName: string;
  recipientName: string;
  recipientPhone: string;
  orderPaymentDateText: string;
  type: string;
  status: string;
  createdDateText: string;
  completedDateText: string;
}
