import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { updateAccountPassword, IUpdateAccountPasswordParams } from '../apis';

/**
 * 계정 비밀전호 초기화
 */
export const useAccountPasswordResetService = () => {
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    IUpdateAccountPasswordParams,
    unknown
  >((params) => updateAccountPassword(params));

  return {
    passwordResetError: error,
    isPasswordResetError: isError,
    isPasswordResetLoading: isLoading,
    isPasswordResetSuccess: isSuccess,
    onPasswordReset: mutateAsync,
  };
};
