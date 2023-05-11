import { baseApiClient } from '@utils/api';
import type { CreateBrandRequestParams, UpdateBrandRequestParams } from '../types';
import type { BrandDetailSchema } from '../schemas';

/** 브랜드 생성 */
export const createBrand = (params: CreateBrandRequestParams) => {
  return baseApiClient.post('/brands', params);
};

/** 브랜드 수정 */
export const updateBrand = (brandId: number, params: UpdateBrandRequestParams) => {
  return baseApiClient.put(`/brands/${brandId}`, params);
};

/** 브랜드 단일 검색 */
export const getBrand = (brandId: number): Promise<BrandDetailSchema> =>
  baseApiClient.get<BrandDetailSchema>(`/brands/${brandId}`);
