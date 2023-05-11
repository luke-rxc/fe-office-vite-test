import * as yup from 'yup';
import { ValueOf } from '../types';
import { PRINCIPAL_TYPE, GRADE_TYPE, ADD_PROVIDER_FIELD_ERROR_MESSAGES } from '../constants';
import { ICreateProviderParams } from '../apis';

/**
 * 관리 입점사 등록을 위한 파라미터 모델
 */
export interface AddProviderParamsModel extends Omit<ICreateProviderParams, 'grade'> {
  principalType: ValueOf<typeof PRINCIPAL_TYPE>;
  isRoot: boolean;
}

/**
 * 관리 입점사 폼 모델
 */
export interface AddProviderFieldModel {
  providerId: string | number | null;
  isRoot: false;
  roleIds: (number | string)[];
}

/**
 * 관리 입점사 폼 디폴트 값
 */
export const addProviderFiledDefaultValues: AddProviderFieldModel = {
  providerId: null,
  isRoot: false,
  roleIds: [],
};

/**
 * 관리 입점사 등록 폼 유효성 검사
 */
export const addProviderFieldValidation = yup
  .object()
  .shape<Partial<Record<keyof typeof addProviderFiledDefaultValues, any>>>({
    providerId: yup.number().nullable().required(ADD_PROVIDER_FIELD_ERROR_MESSAGES.REQUIRED_PROVIDER),
  });

/**
 * 관리 입점사 등록을 위해 API파라미터에 맞게 데이터 가공
 */
export const toAddProviderParamsModel = ({
  principalType,
  accountId,
  providerId,
  isRoot,
  roleIds = [],
}: AddProviderParamsModel): ICreateProviderParams => {
  let grade: ValueOf<typeof GRADE_TYPE>;

  if (principalType === PRINCIPAL_TYPE.MANAGER) {
    grade = isRoot ? GRADE_TYPE.MANAGER_ROOT : GRADE_TYPE.MANAGER_GENERAL;
  }

  if (principalType === PRINCIPAL_TYPE.PARTNER) {
    grade = isRoot ? GRADE_TYPE.PARTNER_ROOT : GRADE_TYPE.PARTNER_GENERAL;
  }

  return {
    accountId,
    providerId,
    roleIds,
    grade,
  };
};
