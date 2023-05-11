import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getRoleList, IGetRoleListParams } from '../apis';
import { toRoleListModel } from '../models';

/**
 * principalType 따른 제공되는 권한 목록 Service
 */
export const useRoleListService = ({ principalType }: IGetRoleListParams) => {
  const { data, error, isError, isSuccess, isFetched, isLoading } = useQuery(
    [ROLES_QUERY_KEYS.ROLE_LIST, principalType],
    () => getRoleList({ principalType }),
  );

  return {
    roleList: toRoleListModel(data?.menus || []),
    roleListError: error,
    isRoleListError: isError,
    isRoleListSuccess: isSuccess,
    isRoleListFetched: isFetched,
    isRoleListLoading: isLoading,
  };
};
