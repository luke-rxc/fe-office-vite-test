import { baseApiClient } from '@utils/api';
import { GRADE_TYPE } from '../constants';
import { ProviderComboListSchema, ProviderListSchema, ProviderItemSchema } from '../schemas';

/**
 * 콤보박스를 위한 입점사리스트 조회(이름/아이디)
 */
export const getProviderComboList = async () => {
  return await baseApiClient.get<ProviderComboListSchema>('common/combo/PROVIDER_ACTIVE');
};

/**
 * 관리 입점사 리스트
 */
export const getProviderList = async ({ accountId }: IGetProviderListParams) => {
  return await baseApiClient.get<ProviderListSchema>(`/admin/${accountId}/providers/roles`);
};

export interface IGetProviderListParams {
  accountId: number | string;
}

/**
 * 관리 입점사 추가
 */
export const createProvider = async ({ accountId, providerId, grade, roleIds }: ICreateProviderParams) => {
  return await baseApiClient.post<ProviderItemSchema, Pick<ICreateProviderParams, 'grade' | 'roleIds'>>(
    `/admin/${accountId}/providers/${providerId}/roles`,
    {
      grade,
      roleIds,
    },
  );
};

export interface ICreateProviderParams {
  accountId: number | string;
  providerId: number | string;
  grade: ValueOf<typeof GRADE_TYPE>;
  roleIds: (number | string)[];
}

/**
 * 관리 입점사 권한 수정
 */
export const updateProvider = async ({ accountId, providerId, grade, roleIds }: IUpdateProviderParams) => {
  return await baseApiClient.put<ProviderItemSchema>(`/admin/${accountId}/providers/${providerId}/roles`, {
    grade,
    roleIds,
  });
};

export interface IUpdateProviderParams extends ICreateProviderParams {}

/**
 * 관리 입점사 삭제
 */
export const deleteProvider = async ({ accountId, providerId }: IDeleteProviderParams) => {
  return await baseApiClient.delete(`/admin/${accountId}/providers/${providerId}/roles`);
};

export interface IDeleteProviderParams {
  accountId: number | string;
  providerId: number | string;
}
