import { toAccountSearchFormValuesModel } from '../models';
import { useProviderComboListService } from './useProviderComboListService';

/**
 * 검색 폼 데이터 / 입점사 리스트 가져오기
 */
export const useAccountSearchService = ({ search }: { search: string }) => {
  const {
    providerComboList,
    providerComboListError,
    isProviderComboListError,
    isProviderComboListSuccess,
    isProviderComboListFetched,
    isProviderComboListLoading,
  } = useProviderComboListService();

  return {
    accountSearchFormValues: toAccountSearchFormValuesModel(search, providerComboList),
    accountSearchProviderList: providerComboList,
    accountSearchFormError: providerComboListError,
    isAccountSearchFormError: isProviderComboListError,
    isAccountSearchFormSuccess: isProviderComboListSuccess,
    isAccountSearchFormFetched: isProviderComboListFetched,
    isAccountSearchFormLoading: isProviderComboListLoading,
  };
};
