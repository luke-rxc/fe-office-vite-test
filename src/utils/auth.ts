import { PROVIDER_ACCESS_LIST, TOKEN } from '@constants/auth';
import { AuthToken } from '@schemas/user';

export function getToken() {
  return localStorage.getItem(TOKEN);
}

export function getProvider(providerToken: string = getToken()) {
  const providers = (JSON.parse(localStorage.getItem(PROVIDER_ACCESS_LIST)) as Array<AuthToken>) || [];

  return providers.find(({ token }) => token === providerToken);
}
