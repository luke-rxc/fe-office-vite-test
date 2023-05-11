import { baseApiClient } from '@utils/api';
import { SearchParamsModel, CreateProviderFiledModel } from '../models';
import { ProviderListSchema } from '../schemas';

/**
 * 입점사 삭제
 * @param {number[]} selectedKeyList : 선택된 id 리스트
 * @returns
 */
export const deleteProviders = (selectedKeyList: number[]) => {
  return Promise.all(
    selectedKeyList.map((id: number) => {
      return baseApiClient.delete(`/provider/${id}`);
    }),
  );
};

/**
 * 입점사 리스트 조회
 * @param {SearchParamsModel} params
 * @returns
 */
export const getProviders = (params: SearchParamsModel): Promise<ProviderListSchema> => {
  const { providerName, businessType, calculateCount, fromDate, toDate, page, limit, sort } = params;

  const providerSearchRequest = {
    providerName,
    businessType,
    calculateCount,
    fromDate,
    toDate,
    page,
    size: limit,
    sort: ['createdDate', sort.toUpperCase()].join(','),
  };
  return baseApiClient.get(`/provider`, providerSearchRequest);
};

/**
 * 입점사 등록
 */
export const postProvider = (formData: CreateProviderFiledModel) => {
  return baseApiClient.post('/provider', formData);
};
