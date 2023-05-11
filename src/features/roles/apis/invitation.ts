import { baseApiClient } from '@utils/api';
import { PRINCIPAL_TYPE, GRADE_TYPE } from '../constants';
import { InvitationListSchema, InvitationInfoSchema } from '../schemas';

/**
 * 계정 타입
 */
export type TPrincipalType = typeof PRINCIPAL_TYPE[keyof typeof PRINCIPAL_TYPE];

/**
 * 권한 타입
 */
export type TGrade = typeof GRADE_TYPE[keyof typeof GRADE_TYPE];

/**
 * 계정 초대 요청
 */
export const createInvitation = async ({ principalType, ...invitationInfo }: ICreateInvitationParams) => {
  return await baseApiClient.post(`/admin/invitation/${principalType}`, invitationInfo);
};

export interface ICreateInvitationParams {
  principalType: TPrincipalType;
  cellPhone: string;
  companyName: string;
  email: string;
  name: string;
  partName: string;
}

/**
 * 계정 초대 취소
 */
export const deleteInvitation = async ({ inviteId }: IDeleteInvitationParams) => {
  return await baseApiClient.delete(`/admin/invitation/${inviteId}`);
};

export interface IDeleteInvitationParams {
  inviteId: number | string;
}

/**
 * 계정 초대 승인
 */
export const updateInvitation = async ({ inviteId, grade, roleIds, providerId = 0 }: IUpdateInvitationParams) => {
  return await baseApiClient.post(`/admin/invitation/${inviteId}/provider/${providerId}/grant`, {
    grade,
    roleIds,
  });
};

export interface IUpdateInvitationParams {
  inviteId: string | number;
  grade: TGrade;
  roleIds: Array<string | number>;
  providerId?: string | number;
}

/**
 * 계정 초대 정보 요청
 */
export const getInvitationInfo = async ({ principalType, inviteId }: IGetInvitationInfoParams) => {
  return await baseApiClient.get<InvitationInfoSchema>(`/admin/invitation/${principalType}/${inviteId}`);
};

export interface IGetInvitationInfoParams {
  principalType: TPrincipalType;
  inviteId: number | string;
}

/**
 * 계정 초대 리스트 요청
 */
export const getInvitationList = async ({ principalType }: IGetUserAccountInviteListRequestParams) => {
  return await baseApiClient.get<InvitationListSchema>(`/admin/invitation/${principalType}`);
};

export interface IGetUserAccountInviteListRequestParams {
  principalType: TPrincipalType;
}
