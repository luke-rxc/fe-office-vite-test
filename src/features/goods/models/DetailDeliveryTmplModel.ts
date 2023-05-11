import orderBy from 'lodash/orderBy';
import { ProviderShippingSchema, AddressSchema, ShippingPolicySchema } from '../schemas';

export type AddressModel = AddressSchema;
export type ShippingPolicyType = ShippingPolicySchema;
export type DetailDeliveryTmplModel = ProviderShippingSchema;
export const toProviderDeliveryTmpl = (items: ProviderShippingSchema[]): DetailDeliveryTmplModel[] => {
  // 기본 default 잡은 순으로 filter
  return orderBy(items, 'isDefault', ['desc']);
};
