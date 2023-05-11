import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getAccountInfo, IGetAccountInfoParams } from '../apis';
import { toAccountAffiliationInfoModel, toAccountPrimaryInfoModel } from '../models';

/**
 * 계정 상세 정보 조회
 */
export const useAccountInfoService = ({ accountId }: IGetAccountInfoParams) => {
  const { data, error, isError, isFetched, isLoading } = useQuery([ROLES_QUERY_KEYS.ACCOUNT_INFO, accountId], () =>
    getAccountInfo({ accountId }),
  );

  return {
    primaryInfo: toAccountPrimaryInfoModel(data),
    affiliationInfo: toAccountAffiliationInfoModel(data),
    accountInfoError: error,
    isAccountInfoError: isError,
    isAccountInfoFetched: isFetched,
    isAccountInfoLoading: isLoading,
  };
};
