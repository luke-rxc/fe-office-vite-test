import { baseApiClient } from '@utils/api';
import { DetailDeliveryTmplSchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { DetailDeliveryTmplSchemaMocks } from '../__mocks__/detailDeliveryTmplSchemaMocks';

export const getDeliveryTmpl = (providerId: number, isPartnerSite: boolean): Promise<DetailDeliveryTmplSchema> => {
  // return Promise.resolve<DetailDeliveryTmplSchema>(DetailDeliveryTmplSchemaMocks);
  const apiUrl = isPartnerSite ? `${ApiDomain.Provider}/shipping` : `${ApiDomain.Provider}/${providerId}/shipping`;
  return baseApiClient.get<DetailDeliveryTmplSchema>(apiUrl);
};
