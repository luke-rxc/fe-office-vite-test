import type { QueryState } from '@hooks/useQueryState';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { toDateFormat } from '@utils/date';
import { BulkListSchema } from '../schemas';
import { BulkStatusType, BulkSearchType, BulkStatusTypeCbOptions } from '../constants';
import { ProviderModel } from './ProviderModel';
import { ComboModel } from './ComboModel';

/****************************************************************
 * 검색 Field
 ****************************************************************/
export interface BulkListFormField {
  /** 검색 유형 */
  searchType: BulkSearchType;
  /** 검색어 */
  keyword: string;
  /** 입점사 */
  providerInfo: ProviderModel;
  /** 브랜드 */
  brandInfo: ComboModel;
  /** 일괄 수정 상태 조회 */
  statusList: Boolean[];
  /** 변경일 > 시작 */
  fromDate: number | null;
  /** 변경일 > 종료 */
  toDate: number | null;
}

/** List Search Request Model */

/****************************************************************
 * 검색 Query State
 ****************************************************************/
interface BulkListSearchQueryValue extends Pick<BulkListFormField, 'searchType' | 'keyword'> {
  providerId: string;
  brandId: string;
  status: string;
  fromDate: string;
  toDate: string;
}

export interface BulkListSearchQueryState extends QueryState, BulkListSearchQueryValue {
  size: string;
  page: string;
  sort: string;
}

/**
 * Search State (BulkListFormField) -> Query value (BulkListSearchQueryState) 로 치환
 */
const toStatusFromStatusList = (statusList: Boolean[]) => {
  return statusList.map((isCheck, index) => (isCheck ? BulkStatusTypeCbOptions[index] : null)).filter((item) => !!item);
};
export const toBulkQueryStateFromFormField = (value: BulkListFormField): BulkListSearchQueryValue => {
  const { searchType, keyword, providerInfo, brandInfo, statusList, fromDate, toDate } = value;

  return {
    searchType,
    keyword,
    providerId: providerInfo?.value ? `${providerInfo.value}` : undefined,
    brandId: brandInfo?.value ? `${brandInfo.value}` : undefined,
    status: toStatusFromStatusList(statusList).join(','),
    fromDate: fromDate ? `${fromDate}` : '',
    toDate: toDate ? `${toDate}` : '',
  };
};

/**
 * Query value -> Search State 로 치환
 */
const toStatusListFromStatus = (queryStateStatus: string) => {
  const stateStatus = queryStateStatus.split(',');
  return BulkStatusTypeCbOptions.map((item) => stateStatus.includes(item));
};
export const toBulkFormFieldFromQueryState = (
  defaultFieldValue: BulkListFormField,
  queryState: BulkListSearchQueryState,
): BulkListFormField => {
  const searchValues = { ...defaultFieldValue, ...queryState };
  const { ...props } = searchValues;
  return {
    ...props,
    searchType: queryState.searchType || defaultFieldValue.searchType,
    keyword: queryState.keyword || defaultFieldValue.keyword,
    statusList: queryState.status ? toStatusListFromStatus(queryState.status) : defaultFieldValue.statusList,
    fromDate: Number(queryState.fromDate) || defaultFieldValue.fromDate,
    toDate: Number(queryState.toDate) || defaultFieldValue.toDate,
  };
};

/**
 * 검색 Parameter 생성
 */

/****************************************************************
 * 검색 결과 Model
 ****************************************************************/
export interface BulkListModel extends Omit<BulkListSchema, 'createdDate' | 'updatedDate' | 'reservationDate'> {
  isStandBy: boolean;
  createdDate: string;
  /** status 에 따라 updatedDate, reservationDate 중 하나를 노출 */
  resultDate: string;
}

const toBulkModel = (item: BulkListSchema) => {
  const { status, createdDate, updatedDate, reservationDate, ...etcItems } = item;

  const isStandBy = status === BulkStatusType.STANDBY;
  const resultDate = isStandBy ? reservationDate : updatedDate;

  return {
    ...etcItems,
    isStandBy,
    status,
    createdDate: createdDate ? toDateFormat(createdDate) : '',
    resultDate: resultDate ? toDateFormat(resultDate) : '',
  };
};

export const toBulkModelList = (data: PaginationResponse<BulkListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toBulkModel),
  };
};

/****************************************************************
 * 검색 Request Params
 ****************************************************************/
export interface BulkListSearchRequestParams
  extends Pick<BulkListFormField, 'searchType' | 'keyword' | 'fromDate' | 'toDate'> {
  providerId: number | null;
  brandId: number | null;
  status: BulkStatusType[];
}

/**
 * 검색을 위한 Param 설정
 * form value -> request param 로 치환
 */
export const toBulkListSearchRequestParams = (value: BulkListSearchQueryState): BulkListSearchRequestParams => {
  const { searchType, keyword, brandId, providerId, status, fromDate, toDate } = value;
  return {
    searchType,
    keyword,
    brandId: brandId ? +brandId : null,
    providerId: providerId ? +providerId : null,
    status: status ? ((status as string).split(',') as BulkStatusType[]) : [],
    fromDate: fromDate ? +fromDate : null,
    toDate: toDate ? +toDate : null,
  };
};
