import format from 'date-fns/format';
import { INVITATION_CREATED_DATE_FORMAT } from '../constants';
import { InvitationItemSchema } from '../schemas';

/**
 * 초대 리스트 아이템 모델
 */
export interface InvitationItemModel extends Omit<InvitationItemSchema, 'createdDate'> {
  createdDate: string;
}

/**
 * 초대 리스트 모델
 */
export type InvitationListModel = InvitationItemModel[];

/**
 * [api > ui] 초대 리스트 아이템 데이터 가공
 */
export const toInvitationItemModel = (item: InvitationItemSchema): InvitationItemModel => {
  return {
    ...item,
    createdDate: format(item.createdDate, INVITATION_CREATED_DATE_FORMAT),
  };
};

/**
 * [api > ui] 초대 리스트 데이터 가공
 */
export const toInvitationListModel = (list: InvitationItemSchema[]): InvitationListModel => {
  return list.map((item) => toInvitationItemModel(item));
};
