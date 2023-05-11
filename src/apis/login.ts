import { AuthTokenSchema } from '@schemas/user';
import { commonApiClient } from '@utils/api';

export interface LoginParams {
  email: string;
  password: string;
  otpVerifyCode: string;
}

export const login = (params: LoginParams) => {
  return commonApiClient.post<AuthTokenSchema, LoginParams>('/account/login', params);
};

export const logout = async () => {
  await commonApiClient.post('/account/logout');
};
