import { baseApiClient } from '@utils/api';
import { BrandListSchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { brandSchemaMock } from '../__mocks__/brandSchemaMocks';

// 모든 브랜드 리스트
export const getBrandList = (): Promise<BrandListSchema> => {
  return baseApiClient.get<BrandListSchema>(`${ApiDomain.CommonCombo}/BRAND`);
};

// 입점사에 속한 브랜드 리스트
export const getBrandInProviderList = (providerId: number | null): Promise<BrandListSchema> => {
  const params = providerId ? { providerId } : null;
  return baseApiClient.get<BrandListSchema>(`${ApiDomain.Brands}/combo`, {
    ...params,
  });
};
