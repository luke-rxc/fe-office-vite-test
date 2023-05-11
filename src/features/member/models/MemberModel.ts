import { toDateFormat } from '@utils/date';
import { format } from 'date-fns';
import { MemberQueryParam } from '../apis';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE } from '../constants';
import { MemberSchema } from '../schemas';
import { MemberListQueryState, MemberSearchFormField } from '../types';

export interface MemberModel extends MemberSchema {
  statusText: string;
  createdDateText: string;
  lastLoginDateText: string;
  isIdentifyText: string;
  isAdultText: string;
}

export interface MemberExcelModel
  extends Omit<MemberSchema, 'status' | 'createdDate' | 'lastLoginDate' | 'isIdentify' | 'isAdult'> {
  status: string;
  createdDate: string;
  lastLoginDate: string;
  isIdentity: string;
  isAdult: string;
}

export function toMemberModel(schema: MemberSchema): MemberModel {
  return {
    ...schema,
    name: schema.name ?? '',
    phone: schema.phone ?? '',
    statusText: schema.status.name,
    createdDateText: toDateText(schema.createdDate),
    lastLoginDateText: toDateText(schema.lastLoginDate),
    isIdentifyText: toYn(schema.isIdentify),
    isAdultText: toYn(schema.isAdult),
  };
}

export function toMemberExcelModel(schema: MemberSchema): MemberExcelModel {
  return {
    id: schema.id,
    email: schema.email,
    nickName: schema.nickName,
    name: schema.name ?? '',
    phone: schema.phone ?? '',
    isIdentity: toYn(schema.isIdentify),
    isAdult: toYn(schema.isAdult),
    ssoConnect: schema.ssoConnect ?? '',
    status: schema.status.name,
    createdDate: toDateText(schema.createdDate),
    lastLoginDate: toDateText(schema.lastLoginDate),
  };
}

export function toMemberQueryParam(
  queryState: MemberListQueryState,
  formValues: MemberSearchFormField,
): MemberQueryParam {
  const { joinFromDate, joinToDate, loginFromDate, loginToDate, isBlack, page, size } = queryState;
  return {
    joinFromDate: toDateQueryParam(joinFromDate, formValues.joinFromDate),
    joinToDate: toDateQueryParam(joinToDate, formValues.joinToDate),
    loginFromDate: toDateQueryParam(loginFromDate, formValues.loginFromDate),
    loginToDate: toDateQueryParam(loginToDate, formValues.loginToDate),
    searchType: queryState.searchType || 'EMAIL',
    userStatus: queryState.userStatus || formValues.userStatus || 'ACTIVE',
    keyword: queryState.keyword ?? '',
    isBlack: isBlack === 'T' ? true : null,
    page: Number(page ?? DEFAULT_PAGE_OFFSET),
    size: Number(size ?? DEFAULT_PAGE_SIZE),
  };
}

export function toMemberQueryState(
  queryState: MemberListQueryState,
  formValues: MemberSearchFormField,
): MemberListQueryState {
  return {
    ...queryState,
    joinFromDate: toDateQueryState(formValues.joinFromDate),
    joinToDate: toDateQueryState(formValues.joinToDate),
    loginFromDate: toDateQueryState(formValues.loginFromDate),
    loginToDate: toDateQueryState(formValues.loginToDate),
    searchType: formValues.searchType,
    keyword: formValues.keyword,
    userStatus: formValues.userStatus || 'ACTIVE',
    isBlack: formValues.isBlack ? 'T' : '',
  };
}

export function toMemberFormField(
  queryState: MemberListQueryState,
  formValues: MemberSearchFormField,
): MemberSearchFormField {
  return {
    ...formValues,
    joinFromDate: toDateFormField(queryState.joinFromDate, formValues.joinFromDate),
    joinToDate: toDateFormField(queryState.joinToDate, formValues.joinToDate),
    loginFromDate: toDateFormField(queryState.loginFromDate, formValues.loginFromDate),
    loginToDate: toDateFormField(queryState.loginToDate, formValues.loginToDate),
    searchType: queryState.searchType || 'EMAIL',
    userStatus: queryState.userStatus || 'ACTIVE',
    keyword: queryState.keyword ?? '',
  };
}

export function toDateQueryParam(date: string, defaultDate: string) {
  if (date === 'ALL') {
    return '';
  }

  return new Date(Number(date) ?? defaultDate).getTime().toString();
}

export function toDateFormField(date: string, defaultDate: string) {
  if (date === 'ALL') {
    return null;
  }

  return toDateFormat(date ? Number(date) : new Date(defaultDate));
}

function toDateQueryState(date: string) {
  if (date === null) {
    return 'ALL';
  }

  return new Date(date).getTime().toString();
}

function toDateText(date: number) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

function toYn(isTrue: boolean) {
  return isTrue ? 'Y' : 'N';
}
