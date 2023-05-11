import { PROVIDER_PERSON_TYPE } from '../constants/provider';
import { MediaModel, ProviderPersonModel } from '../models';
import { AccountPolicyModel } from '../models/ProviderDetail';
/*
 * 입점사 상세
 */
export interface ProviderDetailSchema {
  account: {
    // 정산 정보
    bank: {
      // 은행 정보
      code: string;
      name: string;
    };
    depositor: string; // 입금주명
    commissionRate: number; // 수수료
    accountNumber: string; // 입금계좌
    accountPolicy: AccountPolicySchema; // 정산 방식
    accountEmail: string;
  };
  accountImage: MediaSchema | null; // 통장 사본 정보
  brands: {
    // 브랜드 정보
    id: number;
    name: string;
  }[];
  businessNumberImage: MediaSchema; // 사업자 사본 정보
  createdDate: number; // 생성일
  id: number;
  info: {
    // 기본 정보
    businessCategory: string; // 종목
    businessCondition: string; // 업태
    businessNumber: string; // 사업자 번호
    businessType: string; // 사업자 유형
    companyAddress: {
      // 회사 소재지
      postCode: string;
      address: string;
      addressDetail: string;
      phoneNumber: string;
    } | null;
    companyEmail: string; // 회사 이메일
    homepageUrl: string; // 홈페이지 url
    mailOrderSalesNumber: string; // 통신판매업 신고번호
    presidentName: string; // 대표자명
  };
  isActivate: true;
  name: string; // 입점사명
  person: ProviderPersonSchema[]; // 입점사 담당자
}

/**
 * 입점사 담당자
 */
export type ProviderPersonSchema = ProviderPersonModel;

/**
 * 미디어 - 이미지 비디오
 */
export type MediaSchema = MediaModel;

/**
 * 정산
 */
export type AccountPolicySchema = AccountPolicyModel;
