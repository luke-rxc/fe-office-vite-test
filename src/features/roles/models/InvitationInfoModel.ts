import _omit from 'lodash/omit';
import _get from 'lodash/get';
import { InvitationInfoSchema } from '../schemas';
import { ProviderComboListModel } from './ProviderComboListModel';
import { toRoleListModel, RoleListModel } from './RoleListModel';

/**
 * 초대 정보 모델
 */
export interface InvitationInfoModel extends Omit<InvitationInfoSchema, 'id' | 'createdDate' | 'roles'> {
  providerComboList: ProviderComboListModel;
  roles: RoleListModel;
  isRoot: boolean;
}

/**
 * [api > ui] 초대 상세 정보 데이터 가공
 */
export const toInvitationInfoModel = (invitationInfo: InvitationInfoSchema): InvitationInfoModel => {
  const invitationInfoBase = _omit(invitationInfo, 'id', 'createdDate', 'roles');
  const roles = toRoleListModel(_get(invitationInfo, 'roles.menus', []));
  const isRoot = _get(invitationInfo, 'roles.isRoot');

  return {
    ...invitationInfoBase,
    providerComboList: [],
    isRoot,
    roles,
  };
};
