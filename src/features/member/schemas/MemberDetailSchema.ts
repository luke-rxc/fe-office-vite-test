export interface MemberDetailSchema {
  id: number;
  email: string;
  nickName: string;
  name: string | null;
  phone: string | null;
  isIdentify: boolean;
  isIdentifyResettable: boolean;
  isAdult: boolean;
  isBlack: boolean;
  status: {
    code: string;
    name: string;
  };
  createdDate: number;
  lastLoginDate: number;
  ssoConnect: string;
  shippingAddressList: MemberShippingAddressSchema[];
  refundBank: MemberRefundSchema | null;
  dropOut: MemberDropSchema | null;
  isPossiblePermanentDropOut: boolean;
}

export interface MemberShippingAddressSchema {
  id: number;
  isDefault: boolean;
  addressName: string;
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
  createdDate: number;
  updatedDate: number;
}

export interface MemberRefundSchema {
  bank: {
    code: string;
    name: string;
  } | null;
  account: string | null;
  depositor: string | null;
}

export interface MemberDropSchema {
  createdDate: number | null;
  reason: string | null;
  reasonText: string | null;
}

export interface MemberUsablePointSchema {
  usablePoint: number;
}

export interface MemberMileageSchema {
  pointUserTrxId: number;
  amount: number;
  action: string;
  memo: string;
  expireDate: number;
  createdDate: number;
  adminMemo: string | null;
  totalAmount: number;
}

export interface MemberCouponSchema {
  coupon: {
    id: number;
    name: string;
    useType: string;
    costType: string;
    discount: number;
    limitMaxSalePrice: number;
    limitMinPurchasePrice: number;
  };
  couponDownloadId: number;
  startDate: number;
  expiredDate: number;
  isUsed: boolean;
  usedDate: number;
  status: string;
}

export interface MemberOrderSchema {
  orderId: number;
  createdDate: number;
  paymentDate: number | null;
  ordererName: string;
  recipientName: string | null;
  paymentType: {
    type: string;
    name: string;
    description: string | null;
  };
  amount: number;
  orderStatus: {
    step: string;
    name: string;
  };
  goodsName: string;
  quantity: string;
}

export interface MemberNickNameSchema {
  nickName: string;
  createdDate: number;
}

export type MemberBlackListLogSchema = {
  logs: MemberBlackListLogItemSchema[];
};

export type MemberBlackListLogItemSchema = {
  createdDateTime: number;
  domain: string;
  domainPrimaryId: number;
  domainSubId: number;
  email: string;
  id: number;
  message: string;
  name: string;
  origin: string;
  originName: string;
  requestJson: string;
  userId: number;
};
