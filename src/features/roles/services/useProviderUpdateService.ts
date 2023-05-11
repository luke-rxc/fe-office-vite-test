import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { toProviderUpdateParamsModel, ProviderUpdateParamsModel } from '../models';
import { updateProvider } from '../apis';

/**
 * 권리 입점사의 정보(권한) 변경 Service
 */
export const useProviderUpdateService = () => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    ProviderUpdateParamsModel,
    unknown
  >((params) => updateProvider(toProviderUpdateParamsModel(params)), {
    onSuccess: () => {
      // 계정 리스트 캐시 삭제
      queryClient.removeQueries(ROLES_QUERY_KEYS.ACCOUNT_LIST);
      // 관리 입점사 리스트 리로드
      queryClient.refetchQueries(ROLES_QUERY_KEYS.PROVIDER_LIST, { active: true });
    },
  });

  return {
    providerUpdateError: error,
    isProviderUpdateError: isError,
    isProviderUpdateLoading: isLoading,
    isProviderUpdateSuccess: isSuccess,
    onProviderUpdate: mutateAsync,
  };
};
