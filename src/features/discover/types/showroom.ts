import { BrandComboModel, ProviderComboModel } from '../models';

/**
 * 쇼룸 검색 form field
 */
export interface ShowroomSearchFormField {
  searchType: string;
  searchValue: string;
  brand: BrandComboModel;
  provider: ProviderComboModel;
}

/**
 * 쇼룸 검색 params
 */
export interface ShowroomSearchParams {
  searchType: string;
  keyword: string;
  providerId: number;
  brandId: number;
  endDate: string;
  exceptShowRoomIds: Array<number>;
  keywordIds: Array<number>;
  periodDateType: string;
  startDate: string;
  status: string;
  page: number;
  size: number;
}
