import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { createProvider, IGetRoleListParams } from '../apis';
import { toAddProviderParamsModel, AddProviderParamsModel } from '../models';
import { useProviderComboListService } from './useProviderComboListService';
import { useRoleListService } from './useRoleListService';

/**
 * 관리 입점사 추가 Service
 */
export const useProviderAddService = ({ principalType }: IGetRoleListParams) => {
  const queryClient = useQueryClient();
  // 입점사 등록
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    AddProviderParamsModel,
    unknown
  >((params) => createProvider(toAddProviderParamsModel(params)), {
    onSuccess: () => {
      // 계정 리스트 캐시 삭제
      queryClient.removeQueries(ROLES_QUERY_KEYS.ACCOUNT_LIST);
      // 관리 입점사 리스트 리로드
      queryClient.refetchQueries(ROLES_QUERY_KEYS.PROVIDER_LIST, { active: true });
    },
  });

  // 부여 가능 권한 리스트
  const { roleList, roleListError, isRoleListError, isRoleListSuccess, isRoleListFetched, isRoleListLoading } =
    useRoleListService({ principalType });

  // 선택가능 입점사 리스트
  const {
    providerComboList,
    providerComboListError,
    isProviderComboListError,
    isProviderComboListSuccess,
    isProviderComboListFetched,
    isProviderComboListLoading,
  } = useProviderComboListService();

  return {
    roleList,
    providerComboList,
    providerAddError: error || roleListError || providerComboListError,
    isProviderAddError: isError || isRoleListError || isProviderComboListError,
    isProviderAddLoading: isLoading || isRoleListLoading || isProviderComboListLoading,
    isProviderAddFetched: isRoleListFetched || isProviderComboListFetched,
    isProviderAddSuccess: isSuccess || isRoleListSuccess || isProviderComboListSuccess,
    onProviderAdd: mutateAsync,
  };
};
