import * as yup from 'yup';
import format from 'date-fns/format';
import { isValid } from '../utils';
import {
  ACCOUNT_PRIMARY_INFO_DATE_FORMAT,
  ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES,
  ACCOUNT_AFFILIATION_FIELD_HELPER_TEXTS,
  ACCOUNT_PRIMARY_INFO_STATUS_OPTION_LABELS,
  ACCOUNT_PRIMARY_INFO_STATUS_OPTION_VALUES,
} from '../constants';
import { AccountInfoSchema } from '../schemas';
import { IUpdateAccountInfoParams } from '../apis';

/**
 * 기본 정보 모델
 */
export interface AccountPrimaryInfoModel {
  email: string;
  enabled: number; // 0| 1
  createdDate: string;
  lastLoginDate: string;
}

/**
 * 소속 정보 모델
 */
export interface AccountAffiliationInfoModel {
  companyName: string;
  cellPhone: string;
  partName: string;
  name: string;
}

/**
 * 계정 상세 정보 업데이터를 위한 데이터
 */
export interface AccountInfoUpdateParamsModel extends Omit<IUpdateAccountInfoParams, 'isEnabled'> {
  enabled: string | number; // 0 || 1
}

/**
 * 기본 정보의 계정 상태 옵션
 */
export const primaryInfoStatusFieldOptions = [
  {
    label: ACCOUNT_PRIMARY_INFO_STATUS_OPTION_LABELS.ACTIVE,
    value: ACCOUNT_PRIMARY_INFO_STATUS_OPTION_VALUES.ACTIVE,
  },
  {
    label: ACCOUNT_PRIMARY_INFO_STATUS_OPTION_LABELS.PAUSE,
    value: ACCOUNT_PRIMARY_INFO_STATUS_OPTION_VALUES.PAUSE,
  },
] as const;

/**
 * 소속 정보 필드 유효성 검사
 */
export const affiliationInfoFieldsValidation = yup.object().shape<Record<keyof AccountAffiliationInfoModel, any>>({
  companyName: yup.string().required(ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES.REQUIRED_COMPANY_NAME),
  partName: yup.string().required(ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES.REQUIRED_PART_NAME),
  name: yup.string().required(ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES.REQUIRED_NAME),
  cellPhone: yup
    .string()
    .required(ACCOUNT_AFFILIATION_FIELD_ERROR_MESSAGES.REQUIRED_CELL_PHONE)
    .test('', ACCOUNT_AFFILIATION_FIELD_HELPER_TEXTS.CELL_PHONE, (value) => isValid({ type: 'phone', value })),
});

/**
 * 기본 정보 데이터 가공
 */
export const toAccountPrimaryInfoModel = (accountInfo: AccountInfoSchema) => {
  const { email, enabled, createdDate, lastLoginDate } = accountInfo || {};

  return {
    email: email || '',
    enabled: Number(enabled || 0),
    createdDate: (createdDate || '') && format(createdDate, ACCOUNT_PRIMARY_INFO_DATE_FORMAT),
    lastLoginDate: (lastLoginDate || '') && format(lastLoginDate, ACCOUNT_PRIMARY_INFO_DATE_FORMAT),
  };
};

/**
 * 소속 정보 데이터 가공
 */
export const toAccountAffiliationInfoModel = (accountInfo: AccountInfoSchema) => {
  const { companyName, cellPhone, partName, name } = accountInfo || {};

  return {
    companyName: companyName || '',
    cellPhone: cellPhone || '',
    partName: partName || '',
    name: name || '',
  };
};

/**
 * 계정 상세 업데이트를 위한 데이터 가공
 */
export const toAccountInfoUpdateParamsModel = (accountInfo: AccountInfoUpdateParamsModel): IUpdateAccountInfoParams => {
  return {
    ...accountInfo,
    isEnabled: !!Number(accountInfo.enabled),
  };
};
