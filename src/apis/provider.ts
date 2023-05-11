import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { ProviderSchema } from '@schemas/ProviderSchema';

interface RequestParams {
  size: number;
  page: number;
  keyword: string;
}

export const getProviders = ({ page, size, keyword }: RequestParams): Promise<PaginationResponse<ProviderSchema>> => {
  return baseApiClient.get<PaginationResponse<ProviderSchema>>(`/provider?page=${page}&size=${size}`, {
    providerName: keyword,
  });
};
