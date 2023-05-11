import { ProviderComboModel, ShowroomComboModel } from '../models';

/**
 * 콘텐츠 검색 form field
 */
export interface ContentsSearchFormField {
  searchType: string;
  searchValue: string;
  showroom: ShowroomComboModel;
  provider: ProviderComboModel;
}

/**
 * 콘텐츠 검색 params
 */
export interface ContentsSearchParams {
  searchType: string;
  searchValue: string;
  providerId: number;
  showRoomId: number;
  keywordIds: Array<number>;
  searchDateType: string;
  searchEndDate: number;
  searchStartDate: number;
  statusList: Array<string>;
  exceptStoryIds: Array<number>;
  page: number;
  size: number;
}
