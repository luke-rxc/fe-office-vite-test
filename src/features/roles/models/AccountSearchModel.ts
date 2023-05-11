import _get from 'lodash/get';
import _isBoolean from 'lodash/isBoolean';
import _isNumber from 'lodash/isNumber';
import { TOption } from '@components/Select';
import { parser, stringify, stringifyUrl } from '../utils';
import {
  ACCOUNT_SEARCH_TYPES,
  ACCOUNT_SEARCH_TYPE_LABELS,
  ACCOUNT_TABLE_DEFAULT_PAGE,
  ACCOUNT_TABLE_DEFAULT_SIZE,
  ACCOUNT_SEARCH_STATUS_FIELD_VALUES,
} from '../constants';
import { ProviderComboItemSchema } from '../schemas';
import { IGetAccountListParams } from '../apis';
import {
  toSelectedProviderComboItemsModel,
  toProviderComboIdsModel,
  ProviderComboListModel,
} from './ProviderComboListModel';

/**
 * URL Query String을 통해 관리되는 파라미터 모델
 */
export type AccountSearchParamsModel = Omit<IGetAccountListParams, 'principalType'>;

/**
 * 계정 목록 검색 폼 Value 모델
 */
export interface AccountSearchFormValuesModel extends Omit<AccountSearchToQueryModel, 'size' | 'page'> {}

/**
 * URL Query String에서 가져온 계정 조회 폼 데이터 모델
 */
export interface AccountSearchFromQueryModel {
  size?: number;
  page?: number;
  keyword?: string;
  searchType?: string;
  fromCreatedDate?: number | null;
  toCreatedDate?: number | null;
  isActive?: number | string;
  providerIds?: number | (string | number)[];
}

/**
 * 계정 조회 폼의 submit 데이터  모델
 */
export interface AccountSearchToQueryModel {
  // 테이블 페이지네이션 폼 데이터
  size?: number;
  page?: number;
  // 검색폼 데이터
  keyword?: string;
  searchType?: string;
  fromCreatedDate?: number;
  toCreatedDate?: number;
  isActive?: string;
  providerIds?: ProviderComboItemSchema[];
}

/**
 * 계정 목록 검색 조건 옵션
 */
export const accountSearchTypeOptions: TOption[] = [
  { value: ACCOUNT_SEARCH_TYPES.NONE, label: ACCOUNT_SEARCH_TYPE_LABELS.NONE },
  { value: ACCOUNT_SEARCH_TYPES.EMAIL, label: ACCOUNT_SEARCH_TYPE_LABELS.EMAIL },
  { value: ACCOUNT_SEARCH_TYPES.NAME, label: ACCOUNT_SEARCH_TYPE_LABELS.NAME },
  { value: ACCOUNT_SEARCH_TYPES.PART_NAME, label: ACCOUNT_SEARCH_TYPE_LABELS.PART_NAME },
  { value: ACCOUNT_SEARCH_TYPES.COMPANY_NAME, label: ACCOUNT_SEARCH_TYPE_LABELS.COMPANY_NAME },
];

/**
 * 계정 목록 조회 검색 폼 디폴트값
 */
export const accountSearchFormDefaultVales: AccountSearchFormValuesModel = {
  keyword: '',
  searchType: '',
  isActive: '',
  fromCreatedDate: null,
  toCreatedDate: null,
  providerIds: [],
};

/**
 * 계정 목록 조회 API 파라미터 베이스
 */
export const accountSearchParamsBase: AccountSearchParamsModel = {
  page: ACCOUNT_TABLE_DEFAULT_PAGE,
  size: ACCOUNT_TABLE_DEFAULT_SIZE,
  keyword: '',
  searchType: '',
  fromCreatedDate: null,
  toCreatedDate: null,
  isActive: null,
  providerIds: [],
};

/**
 * QueryString[isActive] >> Search Field[isActive]
 */
const toActiveStatusFieldValueModel = (activeState?: boolean) => {
  if (_isBoolean(activeState)) {
    return activeState // prettier-ignore
      ? ACCOUNT_SEARCH_STATUS_FIELD_VALUES.ACTIVE
      : ACCOUNT_SEARCH_STATUS_FIELD_VALUES.PAUSE;
  }

  return ACCOUNT_SEARCH_STATUS_FIELD_VALUES.ALL;
};

/**
 * QueryString >> Search Field
 */
export const toAccountSearchFormValuesModel = (
  search: string,
  providerList?: ProviderComboListModel,
): AccountSearchFormValuesModel => {
  const { size, page, isActive, providerIds, ...query } = toAccountSearchParamsModel(search);

  return {
    ...query,
    isActive: toActiveStatusFieldValueModel(isActive),
    providerIds: toSelectedProviderComboItemsModel(providerIds, providerList || []),
  };
};

/**
 * Search Field >> QueryString
 */
export const toAccountURLSearchModel = (query: AccountSearchToQueryModel, search?: string): string => {
  const page = _get(query, 'page', accountSearchParamsBase.page);
  const providerIds = toProviderComboIdsModel(_get(query, 'providerIds', []));

  return stringifyUrl({ query: { ...query, page, providerIds }, url: search });
};

/**
 * QueryString >> API Params
 * 계정 리스트 검색에 필요한 파라미터 값을 생성
 */
export const toAccountSearchParamsModel = (search: string): AccountSearchParamsModel => {
  const query = parser(stringify(parser(search))) as AccountSearchFromQueryModel;
  const { page, size, keyword, searchType, isActive, providerIds, fromCreatedDate, toCreatedDate } = query;

  return {
    page: page || accountSearchParamsBase.page,
    size: size || accountSearchParamsBase.size,
    keyword: keyword ?? accountSearchParamsBase.keyword,
    fromCreatedDate: fromCreatedDate || accountSearchParamsBase.fromCreatedDate,
    toCreatedDate: toCreatedDate || accountSearchParamsBase.toCreatedDate,
    providerIds: _isNumber(providerIds) ? [providerIds] : Array.isArray(providerIds) ? providerIds : [],
    isActive: _isNumber(isActive) ? Boolean(isActive) : null,
    searchType: ACCOUNT_SEARCH_TYPES[searchType] || ACCOUNT_SEARCH_TYPES.NONE,
  };
};
