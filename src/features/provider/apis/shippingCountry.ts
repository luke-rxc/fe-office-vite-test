import { baseApiClient } from '@utils/api';
import { ShippingCountrySchema } from '../schemas';

/**
 * 제주도서산간지역 조회
 * @returns
 */
export const getShippingCountry = (): Promise<ShippingCountrySchema> => {
  return baseApiClient.get(`/provider/shipping-country-address`);
};
