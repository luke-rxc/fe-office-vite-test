import { baseApiClient } from '@utils/api';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { BulkListSchema, BulkDetailSchema, BulkHeaderSchema } from '../schemas';
import { BulkListSearchRequestParams, BulkUploadGoodsRequestParams, BulkUploadOptionsRequestParams } from '../models';
import { ApiDomain } from '../constants';

interface SearchRequestParams {
  page: number;
  size: number;
  params: BulkListSearchRequestParams;
}

interface CancelBulkListRequestParams {
  ids: number[];
}

/** 검색 리스트 목록 조회 */
export const postBulkList = async ({
  page,
  size,
  params,
}: SearchRequestParams): Promise<PaginationResponse<BulkListSchema>> => {
  return baseApiClient.post<PaginationResponse<BulkListSchema>>(
    `${ApiDomain.Bulk}/search?page=${page}&size=${size}&sort=id,DESC`,
    params,
  );
};

/** 예약 목록 취소 (대기 상태만 가능) */
export const postCancelBulkList = async (params: CancelBulkListRequestParams) => {
  return baseApiClient.post(`${ApiDomain.Bulk}/cancel`, params);
};

/** 상품 기본정보 일괄수정 엑셀 정보 등록 */
export const postUploadGoodsBaseBulk = async (params: BulkUploadGoodsRequestParams) => {
  return baseApiClient.post(`/v1${ApiDomain.Goods}/bulk-update/goods-base`, params);
};

/** 상품 매핑정보 일괄수정 엑셀 정보 등록 */
export const postUploadGoodsMappingBulk = async (params: BulkUploadGoodsRequestParams) => {
  return baseApiClient.post(`/v1${ApiDomain.Goods}/bulk-update/goods-mapping`, params);
};

/** 상품 옵션정보 일괄수정 엑셀 정보 등록 */
export const postUploadOptionsBulk = async (params: BulkUploadOptionsRequestParams) => {
  return baseApiClient.post(`/v1${ApiDomain.Goods}/bulk-update/option`, params);
};

/** 일괄 상품 상세 정보조회 */
export const getBulkDetail = async (id: string) => {
  return baseApiClient.get<BulkDetailSchema>(`/v1${ApiDomain.Bulk}/${id}`);
};

/** 일괄 상품 서식 다운로드 Header Set */
export const getExportBulkHeader = async () => {
  return baseApiClient.get<BulkHeaderSchema>(`/v1${ApiDomain.Goods}/bulk-update/headers`);
};
