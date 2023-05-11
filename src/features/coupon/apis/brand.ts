import { baseApiClient } from '@utils/api';
import { BrandComboSchema } from '../schemas';

interface BrandResponse {
  items: Array<BrandComboSchema>;
}

export const getBrands = (): Promise<BrandResponse> => {
  return baseApiClient.get<BrandResponse>(`/brands/combo`);
};
