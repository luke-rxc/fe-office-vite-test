import _flatMap from 'lodash/flatMap';
import { ValueOf } from '../types';
import { PRINCIPAL_TYPE, GRADE_TYPE } from '../constants';
import { ICreateProviderParams } from '../apis';
import { ProviderListSchema, ProviderItemSchema } from '../schemas';

/**
 * 관리 입점사의 권한 모델
 */
export interface ProviderRoleModel {
  value: string;
  label: string;
}

/**
 * 관리 입점사의 권한 카테고리 모델
 */
export interface ProviderRoleCategoryModel {
  label: string;
  roles: ProviderRoleModel[];
}

/**
 * 관리 입점사 모델
 */
export interface ProviderItemModel extends Omit<ProviderItemSchema, 'menus'> {
  roleCategories: ProviderRoleCategoryModel[];
  grantedRoles: ProviderRoleModel[];
}

/**
 * 관리 입점사 리스트 모델
 */
export type ProviderListModel = ProviderItemModel[];

/**
 * 관리 입점사 정보(권한) 변경을 위한 파리미터 모델
 */
export interface ProviderUpdateParamsModel {
  principalType: ValueOf<typeof PRINCIPAL_TYPE>;
  accountId: number | string;
  providerId: number | string;
  isRoot: boolean;
  roleIds: (number | string)[];
}

/**
 * 카테고리별 권한 목록 중 선택된 권한만 {id, value} 형태의 배열로 반환
 */
export const toGrantedRolesModel = (roleCategories: ProviderItemSchema['menus']) => {
  return _flatMap(roleCategories, (roleCategory): { label: string; value: string }[] =>
    roleCategory.roles.reduce(
      (grantedRoles, role) =>
        // 카테고리내에서 선택된 권한을 필터링하고 {id, value}형태로 가공하여 반환
        role.granted ? [...grantedRoles, { value: String(role.id), label: role.description }] : grantedRoles,
      [],
    ),
  );
};

/**
 * 카테고리별 권한 목록 데이터 가공
 */
export const toRoleCategoriesModel = (roleCategories: ProviderItemSchema['menus']) => {
  return roleCategories.map((roleCategory) => ({
    label: roleCategory.name,
    roles: roleCategory.roles.map((role) => ({ value: String(role.id), label: role.description })),
  }));
};

/**
 * UI를 위한 관리 입점사 데이터 생성
 */
export const toProviderItemModel = (item: ProviderItemSchema): ProviderItemModel => {
  const { providerId, name, isRoot, menus } = item;

  return {
    providerId,
    name,
    isRoot,
    grantedRoles: toGrantedRolesModel(menus),
    roleCategories: toRoleCategoriesModel(menus),
  };
};

/**
 * UI를 위한 관리 입점사 리스트 데이터 생성
 */
export const toProviderListModel = (list: ProviderListSchema): ProviderListModel => {
  return list.map((item) => toProviderItemModel(item));
};

/**
 * 관리 입점사 정보(권한) 변경을 위한 파리미터 데이터 생성
 */
export const toProviderUpdateParamsModel = ({
  principalType,
  accountId,
  providerId,
  isRoot,
  roleIds,
}: ProviderUpdateParamsModel): ICreateProviderParams => {
  let grade;

  if (principalType === PRINCIPAL_TYPE.MANAGER) {
    grade = isRoot ? GRADE_TYPE.MANAGER_ROOT : GRADE_TYPE.MANAGER_GENERAL;
  } else {
    grade = isRoot ? GRADE_TYPE.PARTNER_ROOT : GRADE_TYPE.PARTNER_GENERAL;
  }

  return { accountId, providerId, roleIds, grade };
};
