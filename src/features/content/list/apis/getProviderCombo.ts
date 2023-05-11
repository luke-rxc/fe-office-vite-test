import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';

/**
 * 입점사 콤보리스트
 */
export const getProviderCombo = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`/provider/combo`);
};
