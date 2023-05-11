import { baseApiClient } from '@utils/api';
import { ProvideListSchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { providerSchemaMocks } from '../__mocks__/providerSchemaMocks';

export const getProviderList = (): Promise<ProvideListSchema> => {
  // return Promise.resolve<ProvideListSchema[]>(providerSchemaMocks);
  return baseApiClient.get<ProvideListSchema>(`${ApiDomain.CommonCombo}/PROVIDER`);
};
