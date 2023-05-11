import * as yup from 'yup';
import {
  GRADE_TYPE,
  INVITATION_APPROVAL_FIELD_ERROR_MESSAGES,
  MANAGER_INVITATION_APPROVAL_PROVIDER_ID,
} from '../constants';
import { InvitationInfoSchema, RolesSchema } from '../schemas';
import { TPrincipalType, IUpdateInvitationParams } from '../apis';
import { InvitationInfoModel } from './InvitationInfoModel';

/**
 * 계정 초대 폼 values 모델
 */
export interface InvitationsApprovalFiledModel
  extends Omit<InvitationInfoSchema, 'roles' | 'createdDate' | 'id'>,
    Pick<RolesSchema, 'isRoot'> {
  roleIds: (string | number)[];
  providerId?: number;
}

/**
 * [ui] 계정 초대 폼 디폴트 값
 */
export const invitationApprovalFieldDefaultValues: InvitationsApprovalFiledModel = {
  email: '',
  name: '',
  companyName: '',
  partName: '',
  cellPhone: '',
  isRoot: false,
  providerId: null,
  roleIds: [],
};

/**
 * 매니저 초대 승인 폼 입력 값
 */
export const mangerInvitationApprovalFieldDefaultValues: InvitationsApprovalFiledModel = {
  ...invitationApprovalFieldDefaultValues,
  // 매니저 계정은 1일 고정값
  providerId: MANAGER_INVITATION_APPROVAL_PROVIDER_ID,
};

/**
 * 파트너 초대 승인 폼 입력 값
 */
export const partnerInvitationApprovalFieldDefaultValues: InvitationsApprovalFiledModel =
  invitationApprovalFieldDefaultValues;

/**
 * [ui > api] api에 맞게 초대 승인 폼 데이터 가공
 */
export const toInvitationApprovalParamsModel = ({
  principalType,
  inviteId,
  accountInfo,
}: {
  principalType: TPrincipalType;
  inviteId: number;
  accountInfo: InvitationsApprovalFiledModel;
}): IUpdateInvitationParams => {
  const { isRoot, roleIds = [], providerId } = accountInfo;

  if (principalType === 'MANAGER') {
    return {
      inviteId,
      roleIds,
      providerId: MANAGER_INVITATION_APPROVAL_PROVIDER_ID,
      grade: isRoot ? GRADE_TYPE.MANAGER_ROOT : GRADE_TYPE.MANAGER_GENERAL,
    };
  }

  return {
    inviteId,
    roleIds,
    providerId,
    grade: isRoot ? GRADE_TYPE.PARTNER_ROOT : GRADE_TYPE.PARTNER_GENERAL,
  };
};

/**
 * [api > ui] 초대 승인 폼 데이터에 맞게 초대정보 데이터 가공
 */
export const toInvitationApprovalFieldValuesModel = (
  invitationInfo: InvitationInfoModel,
): InvitationsApprovalFiledModel => {
  const { email, name, companyName, partName, cellPhone, isRoot } = invitationInfo;

  return {
    ...invitationApprovalFieldDefaultValues,
    email,
    name,
    companyName,
    partName,
    cellPhone,
    isRoot,
  };
};

/**
 * [ui] 계정 초대 유효성 검사
 */
export const invitationApprovalFieldValidation = yup
  .object()
  .shape<Partial<Record<keyof InvitationsApprovalFiledModel, any>>>({
    providerId: yup.number().nullable().required(INVITATION_APPROVAL_FIELD_ERROR_MESSAGES.REQUIRED_PROVIDER),
  });
