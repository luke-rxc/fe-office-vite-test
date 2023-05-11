import { baseApiClient } from '@utils/api';

interface PasswordParams {
  params: { password: string; newPassword: string };
}

// 비밀번호 변경
export const putPassword = async ({ params }: PasswordParams) => {
  return baseApiClient.put(`/admin/me/password`, params);
};
