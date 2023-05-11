import { SortOrderType } from '@constants/table';
import { format } from 'date-fns';
import type { SearchDateType } from '../constants';
import { BrandSchema } from '../schemas';

/**
 * 브랜드 검색 파라미터
 */
export interface BrandSearchParams {
  // 검색 기간 조건
  searchDateType: SearchDateType;
  // 검색 시작일
  fromDate: number;
  // 검색 종료일
  toDate: number;
  // 검색 조건
  searchType: string;
  // 검색 키워드
  keyWord: string;
}

/**
 * 브랜드 리스트 파라미터
 */
export interface BrandListParams extends BrandSearchParams {
  page: number;
  size: number;
  sort: [string, SortOrderType];
}

/**
 * 브랜드 검색 폼
 * @description 기간 조건은 최초생성일 외 사용되지 않으므로 searchDateType은 Form에서 제외함.
 */
export interface BrandSearchForm extends Omit<BrandSearchParams, 'searchDateType'> {}

/**
 * 브랜드 UI 모델
 */
export interface BrandModel extends Omit<BrandSchema, 'createdDate'> {
  createdDate: string;
  viewable: boolean;
}

/**
 * Convert BrandSchema to UI Model
 */
export const toBrandModel = (item: BrandSchema): BrandModel => {
  return {
    ...item,
    createdDate: format(item.createdDate, 'yyyy-MM-dd HH:mm:ss'),
    viewable: true,
  };
};

/**
 * Convert BrandSchema List to UI Model
 */
export const toBrandListModel = (items: BrandSchema[]) => {
  return items.map(toBrandModel);
};

/**
 * Convert Label 코드 포맷을 Select 컴포넌트 options 포맷으로 변환
 */
export const toSelectOptionsModel = (items: Record<string, string>) => {
  return Object.entries(items).map(([key, value]) => ({ value: key, label: value }));
};
