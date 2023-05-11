import { QueryState } from '@hooks/useQueryState';
import { DiscoverSectionDisplayType, DiscoverSectionType } from '../constants';
import { KeywordComboItemModel } from '../models';

/**
 * 디스커버 섹션 query state
 */
export interface DiscoverSectionQueryState extends QueryState {
  page: string;
  limit: string;
}

/**
 * 디스커버 섹션 등록 form field
 */
export interface DiscoverSectionCreateFormField {
  displayType: string;
  keyword: KeywordComboItemModel;
  sectionType: string;
  title: string;
}

/**
 * 디스커버 섹션 등록 params
 */
export interface DiscoverSectionCreateParams {
  displayType: DiscoverSectionDisplayType;
  keywordId: number;
  sectionType: DiscoverSectionType;
  title: string;
}

/**
 * 디스커버 섹션 수정 form field
 */
export interface DiscoverSectionModifyFormField {
  isOpen: string;
  keyword: KeywordComboItemModel;
  title: string;
}

/**
 * 디스커버 섹션 수정 params
 */
export interface DiscoverSectionModifyParams {
  sectionId: string;
  isOpen: boolean;
  keywordId: number;
  title: string;
}

/**
 * 디스커버 섹션타입별 리스트 조회 params
 */
export interface DiscoverSectionTypeListParams {
  page: number;
  size: number;
  displayType: DiscoverSectionDisplayType;
  keywordId?: number;
  /**
   * 리스트 데이터에 키워드 포함여부를 결정 (백앤드 성능 개선 요청으로 추가된 params)
   */
  requestKeyword?: boolean;
}
