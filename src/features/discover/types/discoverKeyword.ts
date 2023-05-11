import { QueryState } from '@hooks/useQueryState';

/**
 * 디스커버 키워드 query state
 */
export interface DiscoverKeywordQueryState extends QueryState {
  page: string;
  limit: string;
}

/**
 * 디스커버 키워드 검색 params
 */
export interface DiscoverKeywordSearchParams {
  status: string;
  page: string;
  size: string;
}

/**
 * 디스커버 키워드 등록 form field
 */
export interface DiscoverKeywordCreateFormField {
  keyword: string;
}

/**
 * 디스커버 키워드 수정 form field
 */
export interface DiscoverKeywordModifyFormField {
  keyword: string;
  status: string;
}

/**
 * 디스커버 키워드 수정 params
 */
export interface DiscoverKeywordModifyParams {
  keywordId: string;
  value: string;
  status: string;
  goodsIdList: Array<number>;
  showRoomIdList: Array<number>;
  storyIdList: Array<number>;
}

/**
 * 디스커버 키워드 일괄등록 excel item schema
 */
export interface DiscoverKeywordRegistExcelItem {
  keywordId: string;
  checkIds: Array<string>;
  localIds: Array<number>;
  mappingType: string;
}

/**
 * 디스커버 키워드 일괄등록 체크 response
 */
export type DiscoverKeywordRegistResponse<T> =
  | {
      success: true;
      id: number;
      item: T;
    }
  | {
      success: false;
      message: string;
      id: number;
    };
