/*
 * 제주도서 산간지역
 */
export interface ShippingCountrySchema {
  countryAddressList: ShippingCountryItemSchema[];
}

export interface ShippingCountryItemSchema {
  address: string;
  addressType: string;
  postcode: string;
}
