import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';

/**
 * 키워드 콤보리스트
 */
export const getKeywordCombo = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`/v1/keyword/combo`);
};
