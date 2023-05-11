import { baseApiClient } from '@utils/api';
import { BrandComboListSchema } from '../schemas';

/**
 * 브랜드 콤보 박스 조회
 */
export const getBrandCombo = (providerId: number): Promise<BrandComboListSchema> => {
  return baseApiClient.get<BrandComboListSchema>(`/brands/combo${providerId ? `?providerId=${providerId}` : ''}`);
};
