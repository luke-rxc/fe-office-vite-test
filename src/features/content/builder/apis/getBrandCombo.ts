import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';

/**
 * 브랜드 콤보리스트
 */
export const getBrandCombo = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`/story/combo/brand`);
};
