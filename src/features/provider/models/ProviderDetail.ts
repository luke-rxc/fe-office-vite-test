import { AddressModel as CommonAddressModel } from '@components/address/Address';
import { ProviderDetailSchema } from '../schemas';
import { PROVIDER_PERSON_TYPE } from '../constants';
import { ProviderBrandModel, SelectTypeModel } from './Common';

/**
 * 입점사 상세 정보
 */
export type ProviderDetailModel = {
  id: number; // 입점사 번호
  name: string; // 입점사명
  brands: ProviderBrandModel[];
  providerInfo: ProviderInfoModel; // 입점사 기본 정보
  providerAccount: ProviderAccountModel; // 입점사 정산정보
  providerPerson: ProviderPersonModel[]; // 입점사 담당자정보
};

/**
 * 입점사 기본 정보
 */
export type ProviderInfoModel = {
  businessCategory: string; // 종목
  businessCondition: string; // 업태
  businessNumber: string; // 사업자 번호
  businessType: string; // 사업자 유형
  companyAddress: AddressModel; // 회사 소재지
  companyEmail: string; // 대표 회사 이메일
  homepageUrl: string; // 홈페이지 url
  mailOrderSalesNumber: string; // 통신판매업 신고번호
  presidentName: string; // 대표자명
  businessNumberImage: MediaModel; // 사업자 사본 정보
};

/**
 * 입점사 정산 정보
 */
export type ProviderAccountModel = {
  bank: SelectTypeModel; // 입금은행
  commissionRate: number; // 수수료
  depositor: string; // 입금주명
  accountNumber: string; // 입금계좌
  accountEmail: string; // 세금계산서수령이메일
  accountPolicy: AccountPolicyModel; // 정산방식
  accountImage: MediaModel; // 통장 사본 정보
};

/**
 * 입점사 담당자
 */
export type ProviderPersonModel = {
  email: string;
  id: number;
  name: string;
  phone: string;
  type: PROVIDER_PERSON_TYPE;
  typeKor: string;
};

export const toProviderDetail = (data: ProviderDetailSchema): ProviderDetailModel => {
  if (!data) {
    return null;
  }

  const { account, accountImage, brands, businessNumberImage, id, info, name, person } = data;

  // 입점사 사업 정보
  const {
    businessCategory = '',
    businessCondition = '',
    businessNumber = '',
    businessType = '',
    companyEmail = '',
    homepageUrl = '',
    mailOrderSalesNumber,
    presidentName = '',
  } = info;

  // 입점사 정산 정보
  const { bank, commissionRate, depositor, accountNumber, accountEmail, accountPolicy } = account;

  return {
    id,
    name,
    brands,
    providerInfo: {
      businessCategory,
      businessCondition,
      businessNumber,
      businessType,
      companyAddress: info?.companyAddress
        ? { ...info.companyAddress }
        : {
            postCode: '',
            address: '',
            addressDetail: '',
            phoneNumber: '',
          },
      companyEmail,
      homepageUrl,
      mailOrderSalesNumber,
      presidentName,
      businessNumberImage,
    },
    providerAccount: {
      bank: {
        label: bank.name,
        code: bank.code,
      },
      commissionRate,
      depositor,
      accountNumber,
      accountEmail,
      accountPolicy,
      accountImage,
    },
    providerPerson: getSortedPerson(person, [
      PROVIDER_PERSON_TYPE.MD,
      PROVIDER_PERSON_TYPE.SETTLEMENT,
      PROVIDER_PERSON_TYPE.LOGISTICS,
      PROVIDER_PERSON_TYPE.CS,
    ]),
  };
};

const getSortedPerson = (list: ProviderPersonModel[], sort) => {
  return sort.map((sortType) => {
    return list.find((item) => item.type.toLowerCase() === sortType.toLowerCase());
  });
};

/**
 * 입점사 form 모델
 */
export type ProviderDetailFormFieldModel = {
  name: string; // 입점사명
  brands: ProviderBrandModel[]; // 브랜드 정보
  businessType: string; // 사업자 유형
  businessNumber: string; // 사업자 번호
  businessNumberImage: MediaModel; // 사업자 이미지
  businessNumberImageId: number; // 사업자 사본 이미지 ID
  businessCondition: string; // 업태
  businessCategory: string; // 종목
  companyAddress: AddressModel; // 사업자 소재지
  companyEmail: string; // 대표 회사 이메일
  mailOrderSalesNumber: string; //통신판매업 신고번호
  presidentName: string; // 대표자명
  phoneNumber: string; // 대표번호
  homepageUrl: string; // 홈페이지url
  commissionRate: number; // 입점사 수수료
  calculateCount: string;
  bank: SelectTypeModel; // 입금은행
  accountEmail: string; // 세금계산서수령 E-mail
  depositor: string; // 입금주명
  accountNumber: string; // 계좌번호
  accountImage: MediaModel; // 통장 이미지
  accountImageId: number; // 통장 사본 이미지 ID
  person: ProviderPersonModel[]; // 담당자
};

/**
 * to FormField Data
 * @param providerData
 * @returns
 */
export const toFormFieldProvider = (providerData: ProviderDetailModel): ProviderDetailFormFieldModel => {
  const { name, brands, providerInfo, providerAccount, providerPerson } = providerData;

  const person: ProviderPersonModel[] = providerPerson.map((person) => {
    const { email, id, name, phone, type, typeKor } = person;
    return {
      email: email ?? '',
      id,
      name: name ?? '',
      phone: phone ?? '',
      type,
      typeKor,
    };
  });
  return {
    name,
    brands,
    businessType: providerInfo.businessType,
    businessNumber: providerInfo.businessNumber,
    businessNumberImage: providerInfo.businessNumberImage,
    businessNumberImageId: providerInfo.businessNumberImage?.id,
    businessCondition: providerInfo.businessCondition ?? '',
    businessCategory: providerInfo.businessCategory ?? '',
    companyEmail: providerInfo.companyEmail ?? '',
    companyAddress: providerInfo.companyAddress,
    mailOrderSalesNumber: providerInfo.mailOrderSalesNumber ?? '',
    presidentName: providerInfo.presidentName ?? '',
    phoneNumber: providerInfo.companyAddress?.phoneNumber ?? '',
    homepageUrl: providerInfo.homepageUrl ?? '',
    commissionRate: providerAccount.commissionRate,
    calculateCount: `${providerAccount.accountPolicy?.calculateCount}`,
    bank: providerAccount.bank,
    accountEmail: providerAccount.accountEmail ?? '',
    depositor: providerAccount.depositor ?? '',
    accountNumber: providerAccount.accountNumber ?? '',
    accountImage: providerAccount.accountImage,
    accountImageId: providerAccount.accountImage?.id,
    person,
  };
};

/**
 * 미디어 - 이미지 비디오
 */
export type MediaModel = {
  extension: string;
  fileSize: number;
  fileType: 'ETC' | 'IMAGE' | 'VIDEO';
  width: number;
  height: number;
  id: number;
  originalFileName: string;
  path: string;
  thumbnailImage: {
    extension: string;
    width: number;
    height: number;
    id: number;
    path: string;
  };
};

export type AccountPolicyModel = {
  calculateCount: number; // 정산 주기 1: 월 1회, 2: 월 2회
};

/**
 * 주소
 */
export type AddressModel = CommonAddressModel & {
  phoneNumber: string;
};

/**
 * 입점사 수정 param 정보
 */
export type ProviderDetailUpdateModel = {
  account: {
    accountEmail: string;
    accountImageId: number;
    accountNumber: string;
    accountPolicy: {
      calculateCount: number;
    };
    bankCode: string;
    commissionRate: number;
    depositor: string;
  };
  info: {
    businessCategory: string;
    businessCondition: string;
    businessNumber: string;
    businessNumberImageId: number;
    businessType: string;
    companyAddress: {
      address: string;
      addressDetail: string;
      postCode: string;
      phoneNumber: string;
    };
    companyEmail: string;
    homepageUrl: string;
    mailOrderSalesNumber: string;
    presidentName: string;
  };
  name: string;
  person: ProviderPersonModel[];
};

/**
 * 은행 리스트
 */
export type BankItemModel = SelectTypeModel;

export const toBankList = (list): SelectTypeModel[] => {
  return list.map((bank) => {
    return {
      label: bank.name,
      code: bank.value,
    };
  });
};
