import * as yup from 'yup';
import { isValid } from '../utils';
import { INVITATION_FIELD_ERROR_MESSAGES, MANAGER_INVITATION_COMPANY_NAME } from '../constants';
import { ICreateInvitationParams } from '../apis';

/**
 * 계정 초대 모델
 */
export type InvitationFieldModel = Omit<ICreateInvitationParams, 'principalType'>;

/**
 * 계정 초대 기본 입력 값
 */
const invitationDefaultValues: InvitationFieldModel = {
  cellPhone: '',
  companyName: '',
  email: '',
  name: '',
  partName: '',
};

/**
 * 매니저 초대 기본 입력 값
 */
export const mangerInviteFieldDefaultValues: InvitationFieldModel = {
  ...invitationDefaultValues,
  companyName: MANAGER_INVITATION_COMPANY_NAME,
};

/**
 * 파트너 초대 기본 입력 값
 */
export const partnerInviteFieldDefaultValues: InvitationFieldModel = {
  ...invitationDefaultValues,
};

/**
 * 계정 초대 유효성 검사
 */
export const inviteFieldValidation = yup.object().shape<Partial<Record<keyof InvitationFieldModel, any>>>({
  companyName: yup.string().required(INVITATION_FIELD_ERROR_MESSAGES.REQUIRED_COMPANY_NAME),
  name: yup.string().required(INVITATION_FIELD_ERROR_MESSAGES.REQUIRED_NAME),
  partName: yup.string().required(INVITATION_FIELD_ERROR_MESSAGES.REQUIRED_PART_NAME),
  email: yup
    .string()
    .required(INVITATION_FIELD_ERROR_MESSAGES.REQUIRED_EMAIL)
    .test('', INVITATION_FIELD_ERROR_MESSAGES.INVALID_EMAIL, (value) => {
      return isValid({ type: 'email', value });
    }),
  cellPhone: yup
    .string()
    .required(INVITATION_FIELD_ERROR_MESSAGES.REQUIRED_CELL_PHONE)
    .test('', INVITATION_FIELD_ERROR_MESSAGES.INVALID_CELL_PHONE, (value) => {
      return isValid({ type: 'phone', value });
    }),
});
