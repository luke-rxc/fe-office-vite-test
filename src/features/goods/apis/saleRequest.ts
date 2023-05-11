import { baseApiClient } from '@utils/api';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ApiDomain, SaleRequestType } from '../constants';
import {
  SaleRequestListSchema,
  SaleRequestModifyListSchema,
  SaleRequestRejectListSchema,
  SaleRequestOptionInfoSchema,
} from '../schemas';
import { SaleRequestSearchRequestParams } from '../models';

interface SearchRequestParams {
  page: number;
  size: number;
  requestType: SaleRequestType;
  params: SaleRequestSearchRequestParams;
}

type SaleRequestSearchResponseType = PaginationResponse<
  SaleRequestListSchema | SaleRequestModifyListSchema | SaleRequestRejectListSchema
>;

export interface PutApprovalRequestParams {
  requestIds: number[];
}

export interface PutApprovalRejectParams {
  requestIds: number[];
  memo: string;
}

/** 검색 리스트 목록 조회 */
export const postSaleRequestList = async ({
  page,
  size,
  requestType,
  params,
}: SearchRequestParams): Promise<SaleRequestSearchResponseType> => {
  const type = requestType.toLowerCase();
  return baseApiClient.post<SaleRequestSearchResponseType>(
    `${ApiDomain.SaleRequest}/search/${type}?page=${page}&size=${size}&sort=id,DESC`,
    params,
  );
};

/** 옵션 상세 검색 */
export const getSaleRequestOptions = async (requestId: number) => {
  return baseApiClient.get<SaleRequestOptionInfoSchema>(`${ApiDomain.SaleRequest}/${requestId}/option`);
};

/** 승인 요청 */
export const putApproval = async (params: PutApprovalRequestParams) => {
  return baseApiClient.put(`${ApiDomain.SaleRequest}/approval`, params);
};

/** 반려 요청 */
export const putReject = async (params: PutApprovalRejectParams) => {
  return baseApiClient.put(`${ApiDomain.SaleRequest}/reject`, params);
};
