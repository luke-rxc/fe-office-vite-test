import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getProviderComboList } from '../apis';

/**
 * 콤보박스를 위한 입점사 리스트 조회
 */
export const useProviderComboListService = () => {
  const {
    data: { items: providerComboList = [] } = {},
    error,
    isError,
    isSuccess,
    isFetched,
    isLoading,
  } = useQuery([ROLES_QUERY_KEYS.PROVIDER_COMBO_LIST], () => getProviderComboList());

  return {
    providerComboList,
    providerComboListError: error,
    isProviderComboListError: isError,
    isProviderComboListSuccess: isSuccess,
    isProviderComboListFetched: isFetched,
    isProviderComboListLoading: isLoading,
  };
};
