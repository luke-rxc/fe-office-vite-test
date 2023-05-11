import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { deleteProvider, IDeleteProviderParams } from '../apis';

/**
 * 권리 입점사 제거
 */
export const useProviderDeleteService = () => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    IDeleteProviderParams,
    unknown
  >((params) => deleteProvider(params), {
    onSuccess: () => {
      // 계정 리스트 캐시 삭제
      queryClient.removeQueries(ROLES_QUERY_KEYS.ACCOUNT_LIST);
      // 관리 입점사 리스트 리로드
      queryClient.refetchQueries(ROLES_QUERY_KEYS.PROVIDER_LIST, { active: true });
    },
  });

  return {
    providerDeleteError: error,
    isProviderDeleteError: isError,
    isProviderDeleteLoading: isLoading,
    isProviderDeleteSuccess: isSuccess,
    onProviderDelete: mutateAsync,
  };
};
