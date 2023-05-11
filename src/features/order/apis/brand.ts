import { baseApiClient } from '@utils/api';
import { BrandComboListSchema } from '../schemas';

/**
 * 입점사 콤보 박스 조회
 */
export const getBrandCombo = (): Promise<BrandComboListSchema> => {
  return baseApiClient.get<BrandComboListSchema>('/brands/combo');
};
