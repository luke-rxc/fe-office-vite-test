import { UseFormReturn } from 'react-hook-form';
import { QueryState } from '@hooks/useQueryState';
import { CONTENT_SEARCH_DATE_TYPE, CONTENT_SEARCH_TYPE, CONTENT_STATUS_TYPE, CONTENT_TYPE } from '../constants';
import { ContentListSchema } from '../schemas';
import { ComboItemModel } from './ComboList';

/**
 * 콘텐츠 리스트 모델
 */
export type ContentListModel = {
  id: number;
  code: string;
  type: CONTENT_TYPE;
  name: string;
  showRoomId: number;
  showRoomName: string;
  providerName: string;
  createdDate: number;
  updatedDate: number;
  publicDate: {
    publicStartDate: number;
    publicEndDate: number;
  };
  status: CONTENT_STATUS_TYPE;
  keywordList: {
    id: number;
    name: string;
  }[];
};

/**
 * 검색 폼 필드
 */
export type ContentSearchFieldModel = {
  // 컨텐츠 검색 타입 - 콘텐츠명/쇼룸명/입점사
  searchType: CONTENT_SEARCH_TYPE;
  // 컨텐츠 검색어
  searchValue: string;
  // 기간조회 타입 - 전체 기간 / 최초 생성일 / 최종 편집일 / 공개 기간
  searchDateType: CONTENT_SEARCH_DATE_TYPE;
  // 기간 시작일
  searchStartDate: number | string;
  // 기간 종료일
  searchEndDate: number | string;
  // 공개 상태
  statusList: CONTENT_STATUS_TYPE | '';
  // 컨텐츠 타입
  type: CONTENT_TYPE | '';
  // 키워드
  keywordIds: ComboItemModel[];
};

/**
 * content form props
 */
export type ContentFormProps<T> = {
  formMethod: UseFormReturn<T>;
  handleSubmit: (e?: any) => Promise<void>;
  handleReset: () => void;
};

/**
 * Story 리스트 query string state
 */
export type ContentListQueryState = QueryState & {
  size: string;
  page: string;
  // sort: string;
  // 컨텐츠 검색 타입 - 콘텐츠명/쇼룸명/입점사
  searchType: string;
  // 컨텐츠 검색어
  searchValue: string;
  // 기간조회 타입 - 전체 기간 / 최초 생성일 / 최종 편집일 / 공개 기간
  searchDateType: string;
  // 기간 시작일
  searchStartDate: string;
  // 기간 종료일
  searchEndDate: string;
  // 공개 상태
  statusList: CONTENT_STATUS_TYPE | '';
  // 컨텐츠 타입
  type: CONTENT_TYPE | '';
  // 키워드
  keywordIds: string;
};

export type RequestParams = {
  page: string;
  size: string;
  searchDateType: string;
  searchStartDate: number;
  searchEndDate: number;
  searchType: string;
  searchValue: string;
  statusList: string[];
  type: string;
  keywordIds: number[];
};

/**
 * FormField -> Query State 로 convert
 */
export const toQueryState = (
  formField: ContentSearchFieldModel,
  currentQueryState?: ContentListQueryState,
): ContentListQueryState => {
  const { searchStartDate, searchEndDate, keywordIds } = formField;
  return {
    ...currentQueryState,
    ...formField,
    searchStartDate: searchStartDate ? searchStartDate.toString() : '',
    searchEndDate: searchEndDate ? searchEndDate.toString() : '',
    keywordIds: keywordIds.map((keyword) => keyword.value).join(','),
  };
};

/**
 *  Query State -> api query param convert
 */
export const toQueryParams = (queryState: ContentListQueryState): RequestParams => {
  const {
    size,
    page,
    searchType,
    searchValue,
    searchDateType,
    searchStartDate,
    searchEndDate,
    statusList,
    type,
    keywordIds,
  } = queryState;

  return {
    size,
    page,
    searchType: searchType ?? CONTENT_SEARCH_TYPE.STORY_NAME,
    searchValue,
    searchDateType: searchDateType ?? CONTENT_SEARCH_DATE_TYPE.ALL,
    searchStartDate: Number.isInteger(Number(searchStartDate)) ? Number(searchStartDate) : null,
    searchEndDate: Number.isInteger(Number(searchEndDate)) ? Number(searchEndDate) : null,
    statusList: statusList ? [statusList] : [],
    type,
    keywordIds: keywordIds ? keywordIds.split(',').map((keyword) => +keyword) : [],
  };
};

/**
 * content model list convert
 */
export const toContentList = (items: ContentListSchema[]): ContentListModel[] => {
  return items.map((item) => {
    const { publicStartDate, publicEndDate } = item;
    return {
      ...item,
      publicDate: {
        publicStartDate,
        publicEndDate,
      },
    };
  });
};

export const toFormField = (queryState: ContentListQueryState, defaultFormValues: ContentSearchFieldModel): any => {
  const { searchStartDate, searchEndDate } = queryState;
  return {
    ...defaultFormValues,
    ...queryState,
    searchStartDate: Number.isInteger(Number(searchStartDate)) ? Number(searchStartDate) : '',
    searchEndDate: Number.isInteger(Number(searchEndDate)) ? Number(searchEndDate) : '',
    keywordIds: [],
  };
};
