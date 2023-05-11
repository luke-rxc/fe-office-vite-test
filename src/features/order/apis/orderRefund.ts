import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import {
  OrderRefundBankInfoSchema,
  OrderRefundDetailItemSchema,
  OrderRefundListItemSchema,
  OrderRefundPriceInfoSchema,
  OrderRefundPriceSchema,
  OrderRefundReasonItemListSchema,
  OrderRefundStatusSchema,
  OrderRequestRefundOptionSchema,
} from '../schemas';
import {
  OrderRefundAllRequestParams,
  OrderRefundBankInfoRequestParams,
  OrderRefundCaseRequestParams,
  OrderRefundListSearchParams,
  OrderRefundPriceRequestParams,
  OrderRefundStatusRequestParams,
} from '../types';

/**
 * 환불 신청 가능한 주문 옵션 조회
 */
export const getOrderRefundOption = (orderId: string): Promise<OrderRequestRefundOptionSchema> => {
  return baseApiClient.get<OrderRequestRefundOptionSchema>(`/order/${orderId}/refund`);
};

/**
 * 환불 사유 항목 조회
 */
export const getRefundReasonItems = (): Promise<OrderRefundReasonItemListSchema> => {
  return baseApiClient.get<OrderRefundReasonItemListSchema>('/refund/reason-items');
};

/**
 * 환불 목록 조회
 */
export const getOrderRefundList = ({
  page,
  size,
  ...params
}: OrderRefundListSearchParams): Promise<PaginationResponse<OrderRefundListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderRefundListItemSchema>>(
    `/refund/search?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 주문 전체 환불 요청
 */
export const postOrderRefund = ({
  orderId,
  ...params
}: OrderRefundAllRequestParams): Promise<PaginationResponse<void>> => {
  return baseApiClient.post<PaginationResponse<void>>(`/refund/order/${orderId}`, params);
};

/**
 * 주문 전체 환불 요청
 */
export const postOrderRefundByCase = ({
  orderId,
  shippingId,
  ...params
}: OrderRefundCaseRequestParams): Promise<PaginationResponse<void>> => {
  return baseApiClient.post<PaginationResponse<void>>(`/refund/order/${orderId}/shipping/${shippingId}`, params);
};

/**
 * 주문 환불상세 조회
 */
export const getOrderRefundDetail = (refundId: string): Promise<OrderRefundDetailItemSchema> => {
  return baseApiClient.get<OrderRefundDetailItemSchema>(`/refund/${refundId}`);
};

/**
 * 주문 환불상세 조회
 */
export const putRefundBankInfo = ({
  refundId,
  ...params
}: OrderRefundBankInfoRequestParams): Promise<OrderRefundBankInfoSchema> => {
  return baseApiClient.put<OrderRefundBankInfoSchema>(`/refund/${refundId}/bank-info`, params);
};

/**
 * 주문 환불처리 금액정보 조회
 */
export const getRefundPriceInfo = (refundId: string): Promise<OrderRefundPriceInfoSchema> => {
  return baseApiClient.get<OrderRefundPriceInfoSchema>(`/refund/${refundId}/price`);
};

/**
 * 주문 환불 금액 계산 조회
 */
export const getRefundPrice = ({
  refundId,
  ...params
}: OrderRefundPriceRequestParams): Promise<OrderRefundPriceSchema> => {
  return baseApiClient.post<OrderRefundPriceSchema>(`/refund/${refundId}/refund-price`, params);
};

/**
 * 주문 환불 상태변경
 */
export const putRefundStatus = ({
  refundId,
  refundStatus,
  ...params
}: OrderRefundStatusRequestParams): Promise<OrderRefundStatusSchema> => {
  return baseApiClient.put<OrderRefundStatusSchema>(`/refund/${refundId}/status/${refundStatus}`, params);
};

/**
 * 환불 엑셀 data 조회
 */
export const getOrderRefundItems = ({
  page,
  size,
  ...params
}: OrderRefundListSearchParams): Promise<PaginationResponse<OrderRefundListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderRefundListItemSchema>>(
    `/refund/search?page=${page}&size=${size}`,
    params,
  );
};
