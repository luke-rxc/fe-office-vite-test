import _omit from 'lodash/omit';
import format from 'date-fns/format';
import { ValueOf } from '../types';
import { ACCOUNT_ROOT_YN_TEXT, ACCOUNT_STATE_TEXT, ACCOUNT_CREATED_DATE_FORMAT } from '../constants';
import { AccountItemSchema } from '../schemas';

/**
 * 계정 리스트 아이템 모델
 */
export interface AccountItemModel extends Omit<AccountItemSchema, 'isRoot' | 'isActive' | 'createdDate'> {
  rootYn: ValueOf<typeof ACCOUNT_ROOT_YN_TEXT>;
  activeState: ValueOf<typeof ACCOUNT_STATE_TEXT>;
  createdDate: string;
}

/**
 * 계정 리스트 모델
 */
export type AccountListModel = AccountItemModel[];

/**
 * [aip > ui] 계정 리스트 아이템 데이터 가공
 *
 */
export const toAccountItemModel = (item: AccountItemSchema): AccountItemModel => {
  return {
    ..._omit(item, ['isRoot', 'isActive', 'createdDate']),
    rootYn: item.isRoot ? ACCOUNT_ROOT_YN_TEXT.Y : ACCOUNT_ROOT_YN_TEXT.N,
    activeState: item.isActive ? ACCOUNT_STATE_TEXT.ACTIVE : ACCOUNT_STATE_TEXT.PAUSE,
    createdDate: format(item.createdDate, ACCOUNT_CREATED_DATE_FORMAT),
  };
};

/**
 * [api > ui] 계정 리스트 데이터 가공
 */
export const toAccountListModel = (list: AccountItemSchema[]): AccountListModel => {
  return list.map((item) => toAccountItemModel(item));
};
