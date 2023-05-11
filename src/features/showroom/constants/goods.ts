import { LabelColor } from '@components/Label';
import { GoodsListItem, GoodsSearchFields, GoodsSearchFieldOptions } from '../types';

/**
 * 전시상품 상태 라벨
 */
export const GoodsTypeLabel: { [key in GoodsListItem['type']]: string } = {
  AUCTION: '경매',
  NORMAL: '일반',
  PREORDER: '프리오더',
} as const;

/**
 * 전시상품 상태 라벨
 */
export const GoodsStatusLabel: { [key in GoodsListItem['status']]: string } = {
  NORMAL: '판매중',
  RUNOUT: '품절',
  UNSOLD: '판매중단',
} as const;

/**
 * 전시상품 상태에 따른 강조색상
 */
export const GoodsStatusColor: { [key in GoodsListItem['status']]: LabelColor } = {
  NORMAL: 'success',
  RUNOUT: 'warning',
  UNSOLD: 'secondary',
} as const;

/**
 * 전시상품 상태 옵션
 */
export const GoodsStatusOptions: GoodsSearchFieldOptions['status'] = [
  { value: 'ALL', label: '전체' },
  { value: 'NORMAL', label: '판매중' },
  { value: 'RUNOUT', label: '품절' },
];

/**
 * 전시상품 검색어 조건 옵션
 */
export const GoodsSearchTypeOptions: GoodsSearchFieldOptions['searchType'] = [
  { value: 'ALL', label: '전체' },
  { value: 'ID', label: '상품 ID' },
  { value: 'NAME', label: '상품명' },
];

/**
 * 전시가능 상품 검색 필드 기본값
 */
export const GoodsSearchFieldDefaultValues: GoodsSearchFields = {
  page: 1,
  size: 10,
  keyword: '',
  searchType: 'ALL',
  status: 'ALL',
  brand: null,
  provider: null,
  myBrand: false,
};
