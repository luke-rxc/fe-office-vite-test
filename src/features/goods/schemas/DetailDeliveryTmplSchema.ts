import { ProviderDeliveryPolicy } from '../constants';

export interface DetailDeliveryTmplSchema {
  providerShippings: ProviderShippingSchema[];
}

export interface ProviderShippingSchema {
  id: number;
  // 입점사 아이디
  providerId: number;
  // 템플릿 이름
  name: string;
  // 배송 정책
  shippingPolicy: ShippingPolicySchema;
  returnCost: number;
  returnAddCost: number;
  defaultExportingDelays: number;
  // 제주/도서산간배송비
  extraAddCosts: ExtraAddCostSchema[];
  // 출고지 주소
  sendingAddress: AddressSchema;
  // 반품지 주소
  returnAddress: AddressSchema;
  // 택배사
  deliveryName: string;
  // 기본 배송지 여부
  isDefault: boolean;
  /** @todo 제거했을때 mocks 내 type 여부 확인  */
  createdDate: number;
}

export interface ShippingPolicySchema {
  costType: ProviderDeliveryPolicy;
  payCost: number;
  ifpayFreePrice: number;
  ifpayCost: number;
}

interface ExtraAddCostSchema {
  region: string; // JEJU, ETC
  price: number;
}

export interface AddressSchema {
  postCode: string;
  address: string;
  addressDetail: string;
  phoneNumber: string;
}
