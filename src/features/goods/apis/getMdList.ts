import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { mdSchemaMocks } from '../__mocks__/mdSchemaMocks';

export const getMdList = (): Promise<ComboSchema> => {
  // return Promise.resolve<ComboSchema>(mdSchemaMocks);
  return baseApiClient.get<ComboSchema>(`${ApiDomain.CommonCombo}/MD`);
};
