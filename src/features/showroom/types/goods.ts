import { AutoCompleteFieldValue, SelectFieldOption } from './common';

/**
 * 상품 테이블 아이템 데이터 타입
 */
export interface GoodsListItem {
  /** 상품 ID */
  id: number;
  /** 전시순서 */
  order?: number;
  name: string;
  type: 'AUCTION' | 'NORMAL' | 'PREORDER';
  status: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
  imageURL: string;
  brandName: string;
  providerName: string;
  salesEndDate: string;
  salesStartDate: string;
  displayStartDate: string;
  /** 판매가 */
  price: string;
  /** 정상가 */
  consumerPrice: string;
}

/**
 * GoodsSearch 데이터 타입
 */
export interface GoodsSearchFields {
  page?: number;
  size?: number;
  keyword?: string;
  searchType?: 'ALL' | 'ID' | 'NAME';
  status?: 'ALL' | 'NORMAL' | 'RUNOUT';
  brand?: AutoCompleteFieldValue;
  provider?: AutoCompleteFieldValue;
  myBrand?: boolean;
  exceptGoodsIds?: number[];
}

/**
 * GoodsSearch 필드 옵션 타입
 */
export interface GoodsSearchFieldOptions {
  status: SelectFieldOption<GoodsSearchFields['status']>[];
  searchType: SelectFieldOption<GoodsSearchFields['searchType']>[];
  brand: GoodsSearchFields['brand'][];
  provider: GoodsSearchFields['provider'][];
}

/**
 * 등록가능여부를 확인한 상품 데이터 타입
 */
export interface GoodsValidationListItem {
  id: number;
  message: string;
  success: boolean;
  goods?: Omit<GoodsListItem, 'order'>;
}
