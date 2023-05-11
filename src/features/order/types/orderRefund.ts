import { QueryState } from '@hooks/useQueryState';
import { OrderSearchFieldType } from '../constants';
import { ProviderComboModel } from '../models';

/**
 * 환불 검색 form field
 */
export interface OrderRefundSearchFormField {
  // 환불일 검색범위(시작)
  fromDate: string;
  // 검색어
  keyword: string;
  // 환불상태
  refundStatusList: Array<boolean>;
  provider: ProviderComboModel;
  // 주문 검색어 타입
  searchType: string;
  // 환불 타입
  refundType: string;
  // 환불일 검색범위(종료)
  toDate: string;
}

/**
 * 환불리스트 검색 params
 */
export interface OrderRefundListSearchParams {
  page: string;
  size: string;
  // 환불일 검색범위(시작)
  fromDate: number;
  // 검색어
  keyword: string;
  // 환불상태
  refundStatusList: Array<string>;
  // 환불 검색어 타입
  searchType: OrderSearchFieldType;
  // 환불 타입
  refundType: string;
  // 환불일 검색범위(종료)
  toDate: number;
  // 입점사 id
  providerId: string;
  time: string;
}

/**
 * 환불리스트 query state
 */
export interface OrderRefundListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  searchType: string;
  refundType: string;
  keyword: string;
  fromDate: string;
  toDate: string;
  refundStatusList: string;
  providerId: string;
  time: string;
}

/**
 * 주문 전체 취소(환불) 요청 params
 */
export type OrderRefundAllRequestParams = {
  orderId: string;
  reason: string;
  reasonCode: string;
};

/**
 * 주문 부분 취소(환불) 요청 item option params
 */
export interface OrderRefundCaseRequestItemOption {
  id: number;
  itemId: number;
  refundEa: number;
}

/**
 * 주문 부분 취소(환불) 요청 params
 */
export type OrderRefundCaseRequestParams = {
  orderId: string;
  shippingId: number;
  itemOptionList: Array<OrderRefundCaseRequestItemOption>;
  reason: string;
  reasonCode: string;
};

/**
 * 주문 환불계좌 form field
 */
export interface OrderRefundAccountFormField {
  // 계좌번호
  account: string;
  // 은행코드
  bankCode: string;
  // 계좌주명
  depositor: string;
}

/**
 * 주문 환불처리 금액정보 요청 params
 */
export interface OrderRefundBankInfoRequestParams {
  refundId: string;
  // 계좌번호
  account: string;
  // 은행코드
  bankCode: string;
  // 계좌주명
  depositor: string;
}

/**
 * 주문 환불처리 금액정보 form field
 */
export interface OrderRefundPriceFormField {
  // 환불 배송비 리스트
  shippingCostList: Array<string>;
  // 환불 방법
  refundMethod: string;
  // 환불 상태
  refundStatus: string;
}

/**
 * 주문 환불 계산 조회 요청 params
 */
export interface OrderRefundPriceRequestParams {
  refundId: string;
  refundMethod: string;
  refundShippingCostList: Array<{
    providerId: number;
    refundShippingCost: number;
    shippingId: number;
  }>;
}

/**
 * 환불 배송비 item
 */
export interface OrderRefundShippingCostItem {
  providerId: number;
  refundShippingCost: number;
  shippingId: number;
}

/**
 * 주문 환불 상태변경 요청 params
 */
export interface OrderRefundStatusRequestParams {
  refundId: string;
  refundStatus: string;
  refundMethod: string;
  refundPrice: string;
  refundPoint: string;
  refundShippingCostList: Array<OrderRefundShippingCostItem>;
}

/**
 * 환불 excel item
 */
export interface OrderRefundExcelItem {
  index: number;
  // 주문아이디
  orderId: string;
  // 환불상품
  goodsName: string;
  // 결제타입
  paymentType: string;
  // 수량
  quantity: string;
  // 환불종류
  type: string;
  // 환불방법
  refundMethod: string;
  // 환불금액
  refundPrice: string;
  // 주문자
  ordererName: string;
  // 환불상태
  status: string;
  // 처리일시
  completedDate: string;
  // 환불접수일시
  createdDate: string;
}
