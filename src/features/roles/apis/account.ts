import { baseApiClient } from '@utils/api';
import { ValueOf } from '../types';
import { PRINCIPAL_TYPE, ACCOUNT_SEARCH_TYPES } from '../constants';
import { AccountListSchema, AccountInfoSchema } from '../schemas';

/**
 * 계정 리스트
 */
export const getAccountList = async ({ page, size, ...search }: IGetAccountListParams) => {
  return await baseApiClient.post<AccountListSchema>(`/admin/search?page=${page}&size=${size}`, {
    ...search,
  });
};

export interface IGetAccountListParams {
  principalType: ValueOf<keyof typeof PRINCIPAL_TYPE>;
  page: number | string;
  size: number | string;
  keyword: string;
  searchType: ValueOf<typeof ACCOUNT_SEARCH_TYPES>;
  isActive: boolean | null;
  fromCreatedDate: number | null;
  toCreatedDate: number | null;
  providerIds: Array<number | string>;
}

/**
 * 계정 상세
 */
export const getAccountInfo = async ({ accountId }: IGetAccountInfoParams) => {
  return await baseApiClient.get<AccountInfoSchema>(`/admin/${accountId}`);
};

export interface IGetAccountInfoParams {
  accountId: number | string;
}

/**
 * 계정 상세 수정
 */
export const updateAccountInfo = async ({ accountId, ...accountData }: IUpdateAccountInfoParams) => {
  return await baseApiClient.put<AccountInfoSchema>(`/admin/${accountId}`, {
    ...accountData,
  });
};

export interface IUpdateAccountInfoParams extends IGetAccountInfoParams {
  cellPhone: string;
  companyName: string;
  isEnabled: boolean;
  name: string;
  partName: string;
}

/**
 * 계정 임시 비밀 번호 발급
 */
export const updateAccountPassword = async ({ accountId }: IUpdateAccountPasswordParams) => {
  return await baseApiClient.post(`/admin/${accountId}/reset-password`);
};

export interface IUpdateAccountPasswordParams extends IGetAccountInfoParams {}
