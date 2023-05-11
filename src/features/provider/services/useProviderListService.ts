import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { getProviders } from '../apis';
import { toProviderList, SearchParamsModel, ProviderListInfoModel } from '../models';
import { QUERY_KEYS } from '../constants';
import { ProviderListSchema } from '../schemas';

/**
 * 입점사 리스트 조회
 */
export const useProviderListService = (
  params: SearchParamsModel,
): {
  providerListInfo: ProviderListInfoModel;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  handleInvalidateQuery: () => void;
} => {
  const client = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery(
    [QUERY_KEYS.PROVIDER_LIST, params],
    () => getProviders(params),
    {
      select: (data: ProviderListSchema) => toProviderList(data),
    },
  );

  const handleInvalidateQuery = useCallback(() => {
    client.invalidateQueries(QUERY_KEYS.PROVIDER_LIST);
  }, [client]);

  return {
    handleInvalidateQuery,
    providerListInfo: data,
    isLoading,
    isError,
    isSuccess,
  };
};
