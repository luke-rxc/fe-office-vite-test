import _flatMap from 'lodash/flatMap';
import _isEmpty from 'lodash/isEmpty';
import { RoleCategorySchema } from '../schemas';

/**
 * 권한 리스트 모델
 */
export type RoleListModel = { value: number; label: string }[];

/**
 * [ui > ui & api] 권한 리스트에서 권한 id만 추출
 */
export const toRoleIdsModel = (roleList: RoleListModel) => {
  return roleList.map(({ value }) => value);
};

/**
 * [api > ui] 권한 리스트 데이터 가공
 */
export const toRoleListModel = (roleCategories: RoleCategorySchema[]): RoleListModel => {
  if (!_isEmpty(roleCategories)) {
    const roles = _flatMap(roleCategories, ({ roles }) => roles);

    return roles.map((role) => ({ value: role.id, label: role.description }));
  }

  return [];
};
