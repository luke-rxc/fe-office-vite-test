import { baseApiClient } from '@utils/api';
import { GeneralInfoSchema, AuthoritySchema } from '../schemas';

export interface GeneralDetailSubmitParams {
  params: { name: string; cellPhone: string; partName: string };
}

// 내 관리자 정보 상세 조회
export const getGeneralInfo = async () => {
  return await baseApiClient.get<GeneralInfoSchema>(`/admin/me`);
};

// 내정보 수정하기
export const putGeneralDetail = async ({ params }: GeneralDetailSubmitParams) => {
  return baseApiClient.put(`/admin/me`, params);
};

// 현재 토큰(세션) 기반 권한조회
export const getAuthority = async () => {
  return await baseApiClient.get<AuthoritySchema>(`/admin/me/roles`);
};
