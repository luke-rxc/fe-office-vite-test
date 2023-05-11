import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';
import { ApiDomain } from '../constants';

export const getKeywordList = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`${ApiDomain.Keyword}/combo`);
};
