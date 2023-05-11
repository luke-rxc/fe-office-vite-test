import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS, ACCOUNT_TABLE_DEFAULT_SIZE, ACCOUNT_TABLE_DEFAULT_PAGE } from '../constants';
import { getAccountList, IGetAccountListParams } from '../apis';
import { toAccountListModel, toAccountSearchParamsModel } from '../models';

/**
 * 계정 목록 조회
 */
export const useAccountListService = ({
  principalType,
  search,
}: {
  principalType: IGetAccountListParams['principalType'];
  search: string;
}) => {
  const { data, error, isError, isFetched, isLoading } = useQuery(
    [ROLES_QUERY_KEYS.ACCOUNT_LIST, { principalType, search }],
    () => getAccountList({ principalType, ...toAccountSearchParamsModel(search) }),
    { keepPreviousData: true },
  );

  return {
    accountList: toAccountListModel(data?.content || []),
    accountListTotal: data?.totalElements || 0,
    accountListSize: data?.size || ACCOUNT_TABLE_DEFAULT_SIZE,
    accountListPage: data?.number + 1 || ACCOUNT_TABLE_DEFAULT_PAGE,
    accountListError: error,
    isAccountListError: isError,
    isAccountListFetched: isFetched,
    isAccountListLoading: isLoading,
  };
};
