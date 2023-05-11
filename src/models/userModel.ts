import { AuthToken, UserSchema } from '@schemas/user';

/**
 * 사용자 UI model
 */
export interface UserModel extends UserSchema {
  name: string;
}

/**
 * 입점사 menu model
 */
export interface ProviderMenuModel extends AuthToken {
  readOnly: boolean;
}

export const toUserModel = (item: UserSchema): UserModel => {
  const { email } = item;
  return {
    ...item,
    name: email.split('@')[0] ?? email,
  };
};

/**
 * AuthToken > 입점사 menu model convert
 */
export const toProviderMenuModel = (item: AuthToken, currentPartnerToken: AuthToken): ProviderMenuModel => {
  return {
    ...item,
    readOnly: item.token === currentPartnerToken.token,
  };
};

/**
 * AuthToken list > 입점사 menu model list convert
 */
export const toProviderMenuListModel = (
  items: Array<AuthToken>,
  currentPartnerToken: AuthToken,
): Array<ProviderMenuModel> => {
  return items.map((item) => toProviderMenuModel(item, currentPartnerToken));
};
