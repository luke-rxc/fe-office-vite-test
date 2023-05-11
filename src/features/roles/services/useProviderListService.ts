import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getProviderList, IGetProviderListParams } from '../apis';
import { toProviderListModel } from '../models';

/**
 * 관리 입점사 리스트 조회
 */
export const useProviderListService = ({ accountId }: IGetProviderListParams) => {
  const { data, error, isError, isFetched, isLoading } = useQuery([ROLES_QUERY_KEYS.PROVIDER_LIST, accountId], () =>
    getProviderList({ accountId }),
  );

  return {
    providerList: toProviderListModel(data || []),
    providerListError: error,
    isProviderListError: isError,
    isProviderListFetched: isFetched,
    isProviderListLoading: isLoading,
  };
};
