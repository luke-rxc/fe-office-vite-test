import { useQuery } from '@hooks/useQuery';
import { getProviderCombo } from '../apis';
import { QUERY_KEY } from '../constants';
import { toComboListModel } from '../models';

/**
 * 입점사 콤보리스트 service
 */
export const useProviderService = () => {
  const { data: providerComboList, isLoading: isLoadingProviderComboList } = useQuery(
    [QUERY_KEY.PROVIDER_COMBO],
    getProviderCombo,
    {
      select: (data) => {
        return toComboListModel(data.items);
      },
    },
  );

  return {
    providerComboList,
    isLoadingProviderComboList,
  };
};
