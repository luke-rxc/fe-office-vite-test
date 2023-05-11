import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import {
  OrderReturnReasonItemListSchema,
  OrderRequestReturnOptionSchema,
  OrderReturnListItemSchema,
  OrderReturnDetailItemSchema,
  OrderReturnChangeInfoSchema,
  OrderReturnExcelListItemSchema,
} from '../schemas';
import {
  OrderReturnActionRequestParams,
  OrderReturnExportTicketCancelRequestParams,
  OrderReturnInfoRequestParams,
  OrderReturnListSearchParams,
  OrderReturnRequestParams,
  OrderReturnStatusRequestParams,
} from '../types';

/**
 * 반품 사유 항목 조회
 */
export const getReturnReasonItems = (): Promise<OrderReturnReasonItemListSchema> => {
  return baseApiClient.get<OrderReturnReasonItemListSchema>('/return/reason-items');
};

/**
 * 반품 신청 가능한 주문 옵션 조회
 */
export const getOrderReturnOption = (orderId: string): Promise<OrderRequestReturnOptionSchema> => {
  return baseApiClient.get<OrderRequestReturnOptionSchema>(`/order/${orderId}/return`);
};

/**
 * 반품리스트 조회
 */
export const getOrderReturnList = ({
  page,
  size,
  ...params
}: OrderReturnListSearchParams): Promise<PaginationResponse<OrderReturnListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderReturnListItemSchema>>(
    `/return/search?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 반품 상세내역 조회
 */
export const getOrderReturnDetail = (returnId: string): Promise<OrderReturnDetailItemSchema> => {
  return baseApiClient.get<OrderReturnDetailItemSchema>(`/return/${returnId}`);
};

/**
 * 주문 반품 요청
 */
export const postOrderReturn = ({ orderId, exportId, ...params }: OrderReturnRequestParams): Promise<void> => {
  return baseApiClient.post<void>(`/return/order/${orderId}/export/${exportId}`, params);
};

/**
 * 주문 반품요청 거부
 */
export const putOrderReturnReject = ({
  returnId,
  ...params
}: OrderReturnActionRequestParams): Promise<OrderReturnChangeInfoSchema> => {
  return baseApiClient.put<OrderReturnChangeInfoSchema>(`/return/${returnId}/reject`, params);
};

/**
 * 주문 반품요청 철회
 */
export const putOrderReturnWithdraw = ({
  returnId,
  ...params
}: OrderReturnActionRequestParams): Promise<OrderReturnChangeInfoSchema> => {
  return baseApiClient.put<OrderReturnChangeInfoSchema>(`/return/${returnId}/withdraw`, params);
};

/**
 * 주문 반품요청 철회
 */
export const putOrderReturnInfo = ({
  returnId,
  ...params
}: OrderReturnInfoRequestParams): Promise<OrderReturnChangeInfoSchema> => {
  return baseApiClient.put<OrderReturnChangeInfoSchema>(`/return/${returnId}`, params);
};

/**
 * 주문 반품 상태변경
 */
export const putOrderReturnStatus = ({
  returnId,
  returnStatus,
  ...params
}: OrderReturnStatusRequestParams): Promise<OrderReturnChangeInfoSchema> => {
  return baseApiClient.put<OrderReturnChangeInfoSchema>(`/return/${returnId}/status/${returnStatus}`, params);
};

/**
 * 주문 반품 엑셀 다운로드
 */
export const getOrderReturnExcel = ({
  page,
  size,
  ...params
}: OrderReturnListSearchParams): Promise<PaginationResponse<OrderReturnExcelListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderReturnExcelListItemSchema>>(
    `/return/search/excel-download?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 주문 반품 티켓 연동사 취소 요청
 */
export const postOrderReturnExportTicketCancelRequest = ({
  returnId,
  exportId,
}: OrderReturnExportTicketCancelRequestParams): Promise<string> => {
  return baseApiClient.post<string>(`/return/${returnId}/export-ticket/${exportId}/cancel-request`);
};
