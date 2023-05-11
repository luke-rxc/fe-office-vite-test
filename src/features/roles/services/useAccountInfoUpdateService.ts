import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { updateAccountInfo } from '../apis';
import { toAccountInfoUpdateParamsModel, AccountInfoUpdateParamsModel } from '../models';

/**
 * 계정 상세 정보 업데이트
 */
export const useAccountInfoUpdateService = () => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    AccountInfoUpdateParamsModel,
    unknown
  >((params) => updateAccountInfo(toAccountInfoUpdateParamsModel(params)), {
    onSuccess: () => {
      // 계정 리스트 캐시 삭제
      queryClient.removeQueries(ROLES_QUERY_KEYS.ACCOUNT_LIST);
      // 계정 상세 정보 초기화
      queryClient.refetchQueries(ROLES_QUERY_KEYS.ACCOUNT_INFO, { active: true });
    },
  });

  return {
    updateAccountInfoError: error,
    isUpdateAccountInfoError: isError,
    isUpdateAccountInfoLoading: isLoading,
    isUpdateAccountInfoSuccess: isSuccess,
    onUpdateAccountInfo: mutateAsync,
  };
};
