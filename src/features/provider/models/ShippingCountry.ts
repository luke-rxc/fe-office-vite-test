import { ShippingCountrySchema, ShippingCountryItemSchema } from '../schemas';

export interface ShippingCountryModel {
  id: number;
  postCode: string; // 우편번호
  address: string; // 주소
  isJeju: boolean; // 제주도
  isEtc: boolean; // 제주 외 도서산간
}

export const convertShippingCountry = (data: ShippingCountrySchema): ShippingCountryModel[] => {
  if (!data || !data.countryAddressList) {
    return [];
  }

  return data.countryAddressList.reduce(
    (list: ShippingCountryModel[], countryData: ShippingCountryItemSchema, currentIndex: number) => {
      const { address, addressType, postcode } = countryData;
      const country: ShippingCountryModel = {
        id: currentIndex,
        postCode: postcode,
        address,
        isJeju: addressType === 'JEJU',
        isEtc: addressType === 'ETC',
      };
      list.push(country);
      return list;
    },
    [],
  );
};
