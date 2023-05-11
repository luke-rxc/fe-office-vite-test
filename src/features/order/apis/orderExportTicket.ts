import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { OrderExportTicketItemSchema } from '../schemas';
import {
  OrderExportBookingDateChangeExcelItem,
  OrderExportTicketBulkUsedParams,
  OrderExportTicketListSearchParams,
} from '../types';

/**
 * 출고(티켓) 리스트 조회
 */
export const getOrderExportTicketList = ({
  page,
  size,
  ...params
}: OrderExportTicketListSearchParams): Promise<PaginationResponse<OrderExportTicketItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderExportTicketItemSchema>>(
    `/export/ticket/search?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 출고(티켓) 사용완료 처리
 */
export const putOrderExportTicketUsed = (exportId: string): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/ticket-used`);
};

/**
 * 출고(티켓) 미사용 처리
 */
export const putOrderExportTicketUnUsed = (exportId: string): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/ticket-unused`);
};

/**
 * 출고(티켓) 엑셀 data 조회
 */
export const getOrderExportTicketItems = ({
  page,
  size,
  ...params
}: OrderExportTicketListSearchParams): Promise<PaginationResponse<OrderExportTicketItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderExportTicketItemSchema>>(
    `/export/ticket/search?page=${page}&size=${size}`,
    { ...params, isExcelDownload: true },
  );
};

/**
 * 출고(티켓) 일괄 사용 처리
 */
export const putOrderExportTicketAllUsed = (
  params: OrderExportTicketBulkUsedParams,
): Promise<{ resultCount: number }> => {
  return baseApiClient.put<{ resultCount: number }>(`/export/ticket/bulk-used`, params);
};

/**
 * 출고(티켓) 사용 처리 (엑셀)
 */
export const putOrderExportExcelTicketUsed = (exportId: string, orderId: string): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/order/${orderId}/ticket-used`);
};

/**
 * 출고(티켓) 투숙일지정 처리
 */
export const putOrderExportExcelTicketBookingDate = ({
  exportId,
  ...params
}: OrderExportBookingDateChangeExcelItem): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/booking-date`, params);
};
