import { AddressModel } from '@components/address/Address';
import { ShippingType } from '../constants';
import { ShippingListSchema, ShippingSchema, DeliveryCompanySchema } from '../schemas';
import { SelectTypeModel } from './Common';

/**
 * 배송지 상세 정보
 */
export type ShippingDetailModel = {
  contract: {
    registered: boolean;
    required: boolean;
  };
  createdDate: number;
  defaultExportingDelays: number;
  deliveryName: string;
  extraAddCosts: {
    region: string;
    price: number;
    value: string;
  }[];
  id: number;
  isDefault: boolean;
  name: string;
  providerId: number;
  returnAddCost: number;
  returnAddress: {
    postCode: string;
    address: string;
    addressDetail: string;
    phoneNumber: string;
  };
  returnCost: number;
  sendingAddress: {
    postCode: string;
    address: string;
    addressDetail: string;
    phoneNumber: string;
  };
  shippingPolicy: {
    costType: string;
    payCost: number;
    ifpayFreePrice: number;
    ifpayCost: number;
  };
};

/**
 * 굿스플로우 자동반품 등록 링크
 */
export type ReturnGoodsFlowLinkModel = {
  link: string;
  providerShippingId: number;
};

/**
 * 배송지 폼 데이터
 */
export type ShippingDetailFieldModel = {
  shippingId: number | null; // 배송지 번호
  shippingName: string; // 배송지명
  shippingCompany: SelectTypeModel; // 택배사
  shippingType: string; //  배송방법
  shippingCostType: string; // 배송비 설정 조건
  payCost: number; // 유료 배송비
  ifpayCost: number; // 조건부 무료 기본 배송비
  ifpayFreePrice: number; // 조건부 무료 금액 조건
  useExtraAddCosts: string; // 제주도서 산간 배송비 사용여부
  jejuAddCost: number; // 제주 지역 추가 배송비
  etcAddCost: number; // 기타 지역 추가 배송비
  returnCost: number; // 반품/교환 배송비
  sendingAddress: AddressModel; // 출고지 주소
  returnAddress: AddressModel; // 반품 교환 주소
  returnPhone: string; // 반품 교환 연락처
};

/**
 * 배송지 등록/수정
 */
export type ShippingRequestParamModel = {
  deliveryCompany: string;
  extraAddCosts: { price: number; region: string }[];
  name: string;
  returnAddress: {
    address: string;
    addressDetail: string;
    phoneNumber: string;
    postCode: string;
  };
  returnCost: number;
  sendingAddress: {
    address: string;
    addressDetail: string;
    phoneNumber: string;
    postCode: string;
  };
  shippingPolicy: {
    costType: string;
    ifpayCost: number;
    ifpayFreePrice: number;
    payCost: number;
  };
};

export const toShippingList = (data: ShippingListSchema): ShippingDetailModel[] => {
  if (!data || !data.providerShippings) {
    return [];
  }

  return data.providerShippings.reduce((list: ShippingDetailModel[], shippingData: ShippingSchema) => {
    const { extraAddCosts, shippingPolicy } = shippingData;
    const shipping: ShippingDetailModel = {
      ...shippingData,
      extraAddCosts: extraAddCosts ? [...extraAddCosts] : [],
      shippingPolicy,
    };
    list.push(shipping);
    return list;
  }, []);
};

/**
 * 택배사 리스트
 * @param data
 * @returns
 */
export const toDeliveryCompany = (data: DeliveryCompanySchema[]) => {
  if (!data) {
    return [];
  }

  return data.reduce((list: SelectTypeModel[], companyData: DeliveryCompanySchema) => {
    const { name, code } = companyData;
    const company: SelectTypeModel = {
      label: name,
      code,
    };
    list.push(company);
    return list;
  }, []);
};

/**
 * 배송지 등록/수정 리퀘스트 데이터
 * @param {ShippingDetailFieldModel} formData
 * @returns
 */

export const toShippingRequestParam = (formData: ShippingDetailFieldModel): ShippingRequestParamModel => {
  const {
    shippingCompany,
    jejuAddCost,
    etcAddCost,
    shippingName,
    shippingType,
    shippingCostType,
    ifpayCost,
    ifpayFreePrice,
    returnCost,
    payCost,
    returnAddress,
    sendingAddress,
    returnPhone,
  } = formData;

  const deliverCompany = shippingType === ShippingType.DIRECT ? ShippingType.DIRECT : (shippingCompany.code as string);
  return {
    deliveryCompany: deliverCompany,
    extraAddCosts: [
      { region: 'JEJU', price: jejuAddCost },
      { region: 'ETC', price: etcAddCost },
    ],
    name: shippingName,
    shippingPolicy: {
      costType: shippingCostType,
      ifpayCost,
      ifpayFreePrice,
      payCost,
    },
    returnCost,
    returnAddress: {
      address: returnAddress.address,
      addressDetail: returnAddress.addressDetail,
      postCode: returnAddress.postCode,
      phoneNumber: returnPhone,
    },
    sendingAddress: {
      address: sendingAddress.address,
      addressDetail: sendingAddress.addressDetail,
      postCode: sendingAddress.postCode,
      phoneNumber: '',
    },
  };
};
