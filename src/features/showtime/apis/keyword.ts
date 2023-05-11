import { baseApiClient } from '@utils/api';
import { KeywordComboSchema } from '../schemas';

export const getKeywordsCombo = (): Promise<KeywordComboSchema> => {
  return baseApiClient.get<KeywordComboSchema>(`/v1/keyword/combo`);
};
