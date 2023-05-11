import { requestMeAccount } from '@apis/account';
import { login, logout } from '@apis/login';
import { PROVIDER_ACCESS_LIST, TOKEN } from '@constants/auth';
import { toUserModel } from '@models/userModel';
import { useMutation } from 'react-query';

export const useUser = () => {
  const { mutateAsync: requestLogin } = useMutation(login, {
    onSuccess: ({ tokens }) => {
      if ((tokens ?? []).length > 0) {
        localStorage.setItem(TOKEN, tokens[0].token);
        localStorage.setItem(PROVIDER_ACCESS_LIST, JSON.stringify(tokens));
      }
    },
  });

  const { mutateAsync: requestLogout } = useMutation(logout, {
    onSuccess: () => {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(PROVIDER_ACCESS_LIST);
    },
  });

  const { mutateAsync: requestGetMeAccount } = useMutation(requestMeAccount, {
    onError: () => {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(PROVIDER_ACCESS_LIST);
    },
  });

  const getMeAccount = async () => {
    const user = await requestGetMeAccount();
    return toUserModel(user);
  };

  return {
    requestLogin,
    requestLogout,
    getMeAccount,
  };
};
