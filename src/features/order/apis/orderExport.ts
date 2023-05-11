import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import {
  OrderExportableItemSchema,
  OrderExportDetailSchema,
  OrderExportListItemSchema,
  OrderExportRegistSchema,
} from '../schemas';
import { OrderExportDeliveryInfoParams, OrderExportListSearchParams, OrderExportUploadOptionParams } from '../types';

interface OrderExportableItemsResponse {
  items: Array<OrderExportableItemSchema>;
}

/**
 * 출고 리스트 조회
 */
export const getOrderExportList = ({
  page,
  size,
  ...params
}: OrderExportListSearchParams): Promise<PaginationResponse<OrderExportListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderExportListItemSchema>>(
    `/export/search?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 출고 상세내역 조회
 */
export const getOrderExportDetail = (exportId: string): Promise<OrderExportDetailSchema> => {
  return baseApiClient.get<OrderExportDetailSchema>(`/export/${exportId}`);
};

/**
 * 주문 출고가능 리스트 조회
 */
export const getOrderExportableItems = (orderItemIds: Array<string>): Promise<OrderExportableItemsResponse> => {
  return baseApiClient.get<OrderExportableItemsResponse>(`/export/exportable-items`, {
    orderItemIds: orderItemIds.join(','),
  });
};

/**
 * 출고 생성 - 주문 아이템 단위
 */
export const postOrderExportOption = (
  params: Array<OrderExportUploadOptionParams>,
): Promise<Array<OrderExportRegistSchema>> => {
  return baseApiClient.post<Array<OrderExportRegistSchema>>(`/export/option/`, params);
};

/**
 * 출고 배송완료 처리
 */
export const putOrderExportShippingComplete = (exportId: string): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/shipping-complete`);
};

/**
 * 출고 구매확정 처리
 */
export const putOrderExportOrderComplete = (exportId: string): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/order-complete`);
};

/**
 * 출고 운송정보 수정
 */
export const putOrderExportDeliveryInfo = ({ exportId, ...params }: OrderExportDeliveryInfoParams): Promise<string> => {
  return baseApiClient.put<string>(`/export/${exportId}/delivery-info`, params);
};

/**
 * 출고 엑셀 data 조회
 */
export const getOrderExportItems = ({
  page,
  size,
  ...params
}: OrderExportListSearchParams): Promise<PaginationResponse<OrderExportListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<OrderExportListItemSchema>>(
    `/export/search?page=${page}&size=${size}`,
    params,
  );
};
