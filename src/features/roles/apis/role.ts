import { baseApiClient } from '@utils/api';
import { ValueOf } from '../types';
import { PRINCIPAL_TYPE } from '../constants';
import { RolesSchema } from '../schemas';

/**
 * principalType 따른 제공되는 권한 목록 조회
 */
export const getRoleList = async ({ principalType }: IGetRoleListParams) => {
  return await baseApiClient.get<RolesSchema>(`/admin/${principalType}/roles`);
};

export interface IGetRoleListParams {
  principalType: ValueOf<typeof PRINCIPAL_TYPE>;
}
