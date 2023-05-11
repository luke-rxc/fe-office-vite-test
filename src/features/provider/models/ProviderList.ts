import { SortOrderType } from '@constants/table';
import { toDateFormat } from '@utils/date';
import { ProviderListSchema, ProviderSchema } from '../schemas';
import { getActiveSelect } from '../utils';
import { BUSINESS_TYPE_LABEL, CALCULATE_TYPE_LIST } from '../constants';
import { ProviderBrandModel } from './Common';

/**
 * 검색 폼
 */
export interface SearchFormModel {
  providerName: string; // 입점사명
  businessType: string; // 사업자유형
  calculateCount: number; // 정산타입
  fromDate: number; // 시작일
  toDate: number; // 종료일
}

/**
 * 리스트 조회 params
 */
export interface SearchParamsModel extends SearchFormModel {
  page: number;
  limit: number;
  sort: SortOrderType;
}

/*
 * 입점사 리스트
 */
export interface ProviderListInfoModel {
  totalCount: number;
  providerList: ProviderListModel[];
}

export interface ProviderListModel {
  id: number; // 입점사 번호
  name: string; // 입점사명
  brands: ProviderBrandModel[]; // 브랜드 정보
  createdDate: string; // 입점일자
  businessType: string; // 사업자 유형
  commissionRate: number; // 수수료
  calculate: string; // 정산
}

/**
 * 입점사 등록
 */
export type CreateProviderFiledModel = {
  businessType: string; // 사업자 유형
  businessNumber: string; // 사업자 번호
  name: string; // 입점사명
};

export const toProviderList = (data: ProviderListSchema): ProviderListInfoModel => {
  if (!data) {
    return null;
  }

  const list: ProviderListModel[] = data.content.map((item: ProviderSchema) => {
    const { id, name, brands, createdDate, businessType, commissionRate, calculateCount } = item;
    const calculate = getActiveSelect(calculateCount, CALCULATE_TYPE_LIST);
    return {
      id,
      name,
      brands: [...brands],
      createdDate: toDateFormat(createdDate),
      businessType: BUSINESS_TYPE_LABEL[businessType],
      commissionRate,
      calculate: calculate ? calculate.label : '',
    };
  });
  return {
    totalCount: data.totalElements,
    providerList: list,
  };
};
