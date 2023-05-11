import { BrandComboModel, ProviderComboModel } from '../models';

/**
 * 상품 검색 form field
 */
export interface GoodsSearchFormField {
  searchType: string;
  keyword: string;
  status: string;
  brand: BrandComboModel;
  provider: ProviderComboModel;
}

/**
 * 상품 검색 params
 */
export interface GoodsSearchParams {
  searchType: string;
  keyword: string;
  status: string;
  brandId: number;
  providerId: number;
  page: number;
  size: number;
  addGoodsIds: Array<number>;
}
