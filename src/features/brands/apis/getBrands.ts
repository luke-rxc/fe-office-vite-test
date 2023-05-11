import { stringifyUrl } from 'query-string';
import { baseApiClient } from '@utils/api';
import type { BrandSearchParams, BrandListParams } from '../models';
import type { BaseListSchema, BrandSchema } from '../schemas';

export const getBrands = ({
  page,
  size,
  sort,
  ...brandSearchRequest
}: Partial<BrandListParams>): Promise<BaseListSchema<BrandSchema>> => {
  const url = stringifyUrl(
    {
      url: '/brands/search',
      query: { page, size, sort },
    },
    {
      arrayFormat: 'comma',
      skipNull: true,
      skipEmptyString: true,
    },
  );

  return baseApiClient.post<BaseListSchema<BrandSchema>, Partial<BrandSearchParams>>(url, brandSearchRequest);
};
