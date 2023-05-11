import { baseApiClient } from '@utils/api';
import { ProviderComboListSchema } from '../schemas';

/**
 * 입점사 콤보 박스 조회
 */
export const getProviderCombo = (): Promise<ProviderComboListSchema> => {
  return baseApiClient.get<ProviderComboListSchema>('/provider/combo');
};
