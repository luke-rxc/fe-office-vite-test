import { toDateFormat } from '@utils/date';
import { toCommify } from '@utils/toCommify';
import { toKRW } from '@utils/toKRW';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash/groupBy';
import {
  MemberBlackListLogItemSchema,
  MemberCouponSchema,
  MemberDetailSchema,
  MemberDropSchema,
  MemberMileageSchema,
  MemberNickNameSchema,
  MemberOrderSchema,
  MemberRefundSchema,
  MemberShippingAddressSchema,
  MemberUsablePointSchema,
} from '../schemas';
import { MemberDetailQueryState } from '../types';
import { phoneNumberToString } from '../utils';

export interface MemberDetailBasicModel
  extends Omit<MemberDetailSchema, 'shippingAddressList' | 'dropOut' | 'refundBank'> {
  statusText: string;
  isIdentifyText: string;
  isAdultText: string;
  shippingAddressList: MemberAddressModel[];
  dropOut: MemberDropModel | null;
  createdDateText: string;
  lastLoginDateText: string;
  refundBank: MemberRefundInfoModel | null;
}

export interface MemberAddressModel extends MemberShippingAddressSchema {
  isDefaultYn: string;
}

export interface MemberMileageModel extends MemberMileageSchema {
  rowId: string;
  totalAmountText: string;
  amountText: string;
  expireDateText: string;
  createdDateText: string;
  statusText: string;
  mileageGroupRowSpan: number | null;
}

export interface MemberCouponModel {
  id: number;
  name: string;
  useType: string;
  saleText: string;
  rangeDateText: string;
  policyText: string;
  status: string;
  usedDateText: string;
}

export interface MemberOrderModel extends Omit<MemberOrderSchema, 'recipientName'> {
  createdDateText: string;
  recipientName: string;
  paymentTypeText: string;
  orderStatusText: string;
  amountText: string;
}

export interface MemberDropModel extends Omit<MemberDropSchema, 'reason' | 'reasonText'> {
  createdDateText: string;
  reason: string;
  reasonText: string;
}

export interface MemberNickNameModel extends MemberNickNameSchema {
  createdDateText: string;
}

export interface MemberRefundInfoModel {
  bankName: string;
  account: string;
  depositor: string;
}

export type MemberBlackListLogModel = {
  createdDateTime: number;
  email: string;
  message: string;
};

export type MemberBlackLogFormField = {
  message: string;
};

export type MemberBlackLogRequestParams = {
  message: string;
};

export function toMemberDetailBasicModel(schema: MemberDetailSchema): MemberDetailBasicModel {
  const format = 'yyyy-MM-dd HH:mm:ss';

  return {
    ...schema,
    isIdentifyText: schema.isIdentify ? 'Y' : 'N',
    isAdultText: schema.isAdult ? 'Y' : 'N',
    statusText: schema.status.name,
    shippingAddressList: schema.shippingAddressList.map(toMemberAddressModel),
    dropOut: schema.dropOut ? toMemberDropInfo(schema.dropOut) : null,
    createdDateText: toDateFormat(schema.createdDate, format),
    lastLoginDateText: toDateFormat(schema.lastLoginDate, format),
    phone: phoneNumberToString(schema.phone ?? ''),
    refundBank: schema.refundBank ? toMemberRefundInfoModel(schema.refundBank) : null,
  };
}

export function toMemberAddressModel(schema: MemberShippingAddressSchema): MemberAddressModel {
  return {
    ...schema,
    isDefaultYn: schema.isDefault ? 'Y' : 'N',
    phone: phoneNumberToString(schema.phone),
  };
}

export function toMemberUsablePointModel(schema: MemberUsablePointSchema): string {
  return toCommify(schema.usablePoint, {});
}

export function toMemberMileageModel(schema: MemberMileageSchema): MemberMileageModel {
  const YYYY_MM_DD_HH_MM_SS = 'yyyy-MM-dd HH:mm:ss';
  const YYYY_MM_DD = 'yyyy-MM-dd';

  return {
    ...schema,
    amountText: toCommify(schema.amount, {}),
    totalAmountText: toCommify(schema.totalAmount, {}),
    createdDateText: toDateFormat(schema.createdDate, YYYY_MM_DD_HH_MM_SS),
    expireDateText: toDateFormat(schema.expireDate, YYYY_MM_DD),
    statusText: schema.action,
    mileageGroupRowSpan: null,
    rowId: uuidv4(),
  };
}

export function toMemberMileageListQueryParam(queryState: MemberDetailQueryState) {
  return {
    page: Number(queryState.mileagePage) || 1,
    size: Number(queryState.mileageSize) || 10,
  };
}

export function toMemberCouponModel(schema: MemberCouponSchema): MemberCouponModel {
  const {
    couponDownloadId,
    startDate,
    expiredDate,
    coupon: { name, useType, discount, costType },
    status,
    usedDate,
  } = schema;
  const format = 'yyyy-MM-dd HH:mm:ss';

  return {
    id: couponDownloadId,
    name,
    useType,
    saleText: getCouponSaleText(costType, discount),
    rangeDateText: `${toDateFormat(startDate, format)} ~ ${toDateFormat(expiredDate, format)}`,
    usedDateText: usedDate ? `${toDateFormat(usedDate, format)}` : '',
    policyText: toCouponPolicy(schema),
    status,
  };
}

export function toMemberCouponListQueryParam(queryState: MemberDetailQueryState) {
  return {
    page: Number(queryState.couponPage) || 1,
    size: Number(queryState.couponSize) || 10,
  };
}

export function toMemberOrderModel(schema: MemberOrderSchema): MemberOrderModel {
  const { createdDate, recipientName, paymentType, orderStatus, amount } = schema;
  const format = 'yyyy-MM-dd HH:mm';
  return {
    ...schema,
    createdDateText: toDateFormat(createdDate, format),
    recipientName: recipientName ?? '',
    paymentTypeText: paymentType.name,
    amountText: toKRW(amount),
    orderStatusText: orderStatus.name,
  };
}

export function toMemberOrderListQueryParam(queryState: MemberDetailQueryState) {
  return {
    page: Number(queryState.orderPage) || 1,
    size: Number(queryState.orderSize) || 10,
  };
}

export function toMemberNickNameListQueryParam(queryState: MemberDetailQueryState) {
  return {
    page: Number(queryState.nickNamePage) || 1,
    size: Number(queryState.nickNameSize) || 10,
  };
}

export function toMemberDropInfo(schema: MemberDropSchema): MemberDropModel {
  const format = 'yyyy-MM-dd HH:mm:ss';

  return {
    ...schema,
    reason: schema.reason ?? '',
    reasonText: schema.reasonText ?? '',
    createdDateText: schema.createdDate ? toDateFormat(schema.createdDate, format) : '',
  };
}

export function toMemberNickNameModel(schema: MemberNickNameSchema, index: number): MemberNickNameModel {
  const format = 'yyyy-MM-dd HH:mm:ss';

  return {
    ...schema,
    createdDateText: toDateFormat(schema.createdDate, format),
  };
}

export function toMemberRefundInfoModel(schema: MemberRefundSchema): MemberRefundInfoModel {
  return {
    bankName: schema.bank?.name ?? '',
    account: schema.account ?? '',
    depositor: schema.depositor ?? '',
  };
}

function getCouponSaleText(costType: string, discount: number) {
  if (costType === 'PERCENT') {
    return `${discount}%`;
  }

  return toKRW(discount);
}

function getCouponSuffix(minPurchasePrice: number, maxSalePrice: number) {
  const purchaseText = minPurchasePrice ? `${toKRW(minPurchasePrice)} 이상 구매` : '';
  const saleText = maxSalePrice ? `최대 ${toKRW(maxSalePrice)} 할인` : '';
  const body = [purchaseText, saleText].filter((text) => text !== '').join('/');
  return body === '' ? body : `${body}`;
}

function toCouponPolicy(schema: MemberCouponSchema) {
  const { coupon } = schema;
  const { limitMinPurchasePrice, limitMaxSalePrice } = coupon;

  if (limitMinPurchasePrice === 0 && limitMaxSalePrice === 0) {
    return '';
  }

  const suffix = getCouponSuffix(limitMinPurchasePrice, limitMaxSalePrice);

  return suffix;
}
export const toBlackLogModel = (list: MemberBlackListLogItemSchema[]): MemberBlackListLogModel[] => {
  return list.map((item): MemberBlackListLogModel => {
    const { createdDateTime, email, message } = item;
    return {
      createdDateTime,
      email,
      message,
    };
  });
};

export function withMileageGroupRowSpanCount(items: Array<MemberMileageModel>): Array<MemberMileageModel> {
  const keys = uniq(items.map((item) => item.pointUserTrxId));
  const groups = groupBy(items, 'pointUserTrxId');
  const withRowSpan = keys.map((key) => {
    const target = groups[key];
    const [first] = target;
    const rowSpan = target.length;
    first.mileageGroupRowSpan = rowSpan;
    return target;
  });
  const result = flatten(withRowSpan);

  return result;
}
