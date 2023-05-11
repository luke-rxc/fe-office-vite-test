import { baseApiClient } from '@utils/api';
import { ProviderDetailSchema } from '../schemas';
import { ProviderDetailFormFieldModel, ProviderDetailUpdateModel } from '../models';

/**
 * 입점사 상세 정보 조회
 * @param {number} id
 * @returns
 */
export const getProvider = (id: number): Promise<ProviderDetailSchema> => {
  return baseApiClient.get(`/provider/${id}`);
};

/**
 * 입점사 상세 수정
 * @param {number} id
 * @param {ProviderFormDataModel} formData
 * @returns
 */

const getData = (formData: ProviderDetailFormFieldModel): ProviderDetailUpdateModel => {
  const {
    accountEmail,
    accountImageId,
    accountNumber,
    bank,
    businessCategory,
    businessCondition,
    businessNumber,
    businessNumberImageId,
    businessType,
    calculateCount,
    commissionRate,
    companyAddress,
    companyEmail,
    depositor,
    homepageUrl,
    mailOrderSalesNumber,
    name,
    person,
    phoneNumber,
    presidentName,
  } = formData;

  return {
    account: {
      accountEmail,
      accountImageId,
      accountNumber,
      accountPolicy: {
        calculateCount: +calculateCount,
      },
      bankCode: `${bank?.code}` ?? '',
      commissionRate,
      depositor,
    },
    info: {
      businessCategory,
      businessCondition,
      businessNumber,
      businessNumberImageId,
      businessType,
      companyAddress: {
        address: companyAddress.address,
        addressDetail: companyAddress.addressDetail,
        postCode: companyAddress.postCode,
        phoneNumber,
      },
      companyEmail,
      homepageUrl,
      mailOrderSalesNumber,
      presidentName,
    },
    name,
    person,
  };
};
export const updateProvider = (id: number, formData: ProviderDetailFormFieldModel) => {
  const params: ProviderDetailUpdateModel = getData(formData);
  return baseApiClient.put(`/provider/${id}`, params);
};
