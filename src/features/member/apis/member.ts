import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { MemberBlackLogRequestParams } from '../models';
import {
  MemberSchema,
  MemberCouponSchema,
  MemberDetailSchema,
  MemberMileageSchema,
  MemberNickNameSchema,
  MemberOrderSchema,
  MemberUsablePointSchema,
} from '../schemas';
export interface MemberQueryParam {
  joinFromDate: string;
  joinToDate: string;
  loginFromDate: string;
  loginToDate: string;
  searchType: string;
  keyword: string;
  userStatus: string;
  isBlack: boolean | null;
  page: number;
  size: number;
}

export interface QueryParam {
  size: number;
  page: number;
}

export interface MileageSetParam {
  actionType: string;
  adminMemo: string;
  expiredDate: string | null;
  point: number;
  reason: string;
}

export const getMemberList = ({
  page,
  size,
  ...param
}: MemberQueryParam): Promise<PaginationResponse<MemberSchema>> => {
  return baseApiClient.post(`/user/search?page=${page}&size=${size}`, param);
};

export const getExcelData = ({ page, size, ...param }: MemberQueryParam): Promise<PaginationResponse<MemberSchema>> => {
  return baseApiClient.post(`/user/search/excel?page=${page}&size=${size}`, param);
};

export const getMemberById = (id: number): Promise<MemberDetailSchema> => {
  return baseApiClient.get(`/user/${id}`);
};

export const getMemberUsablePoint = (id: number): Promise<MemberUsablePointSchema> => {
  return baseApiClient.get(`/user/${id}/point/usable`);
};

export const postMemberUsablePoint = (id: number, param: MileageSetParam): Promise<MemberUsablePointSchema> => {
  return baseApiClient.post(`/user/${id}/point`, param);
};

export const getMemberMileageList = (
  id: number,
  { size, page }: QueryParam,
): Promise<PaginationResponse<MemberMileageSchema>> => {
  return baseApiClient.get(`/user/${id}/point?page=${page}&size=${size}`);
};

export const getMemberCouponList = (
  id: number,
  { size, page }: QueryParam,
): Promise<PaginationResponse<MemberCouponSchema>> => {
  return baseApiClient.get(`/user/${id}/coupon?page=${page}&size=${size}`);
};

export const getMemberOrderList = (
  id: number,
  { size, page }: QueryParam,
): Promise<PaginationResponse<MemberOrderSchema>> => {
  return baseApiClient.get(`/user/${id}/order?page=${page}&size=${size}`);
};

export const getMemberNickNameList = (
  id: number,
  { size, page }: QueryParam,
): Promise<PaginationResponse<MemberNickNameSchema>> => {
  return baseApiClient.get(`/user/${id}/nickname/history?page=${page}&size=${size}`);
};

export const putUserResetIdentify = (id: number): Promise<PaginationResponse<MemberNickNameSchema>> => {
  return baseApiClient.put(`/user/${id}/reset-identify`);
};

export const putPermanentDropOut = (id: number): Promise<void> => {
  return baseApiClient.put(`/user/${id}/permanent-dropout`);
};

export const getBlackLog = (userId: string) => {
  return baseApiClient.get(`/common/logs/USER_BLACK/id/${userId}`);
};

export const postBlackLog = (userId: string, params: MemberBlackLogRequestParams) => {
  return baseApiClient.post(`/user/${userId}/black-log`, params);
};

export const putBlackToggle = (userId: string): Promise<boolean> => {
  return baseApiClient.put(`/user/${userId}/black-toggle`);
};
