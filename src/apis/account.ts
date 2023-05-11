import { UserSchema } from '@schemas/user';
import { commonApiClient } from '@utils/api';

export const requestMeAccount = (): Promise<UserSchema> => {
  return commonApiClient.get<UserSchema>('/account/me');
};
