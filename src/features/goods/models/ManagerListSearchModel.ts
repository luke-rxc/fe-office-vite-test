import { GoodsKind, GoodsStatus } from '@constants/goods';
import type { QueryState } from '@hooks/useQueryState';
import { SaleStatusCbOptions, GoodsTypeCbOptions, DateType, GoodsType } from '../constants';
import { ComboModel } from './ComboModel';
import { BaseSearchModel, toCbModelFromQueryState, toQueryStateFromCbModel } from './CommonListSearchModel';

interface ProvideInfoModel extends ComboModel {
  commissionRate: number;
}

/****************************************************************
 * 검색 Field
 ****************************************************************/
export interface ListFormField extends Omit<BaseSearchModel, 'statuses' | 'type'> {
  /* category1: string | number;
  category2: string | number;
  category3: string | number; */
  goodsIds: string;
  brandInfo: ComboModel[];
  providerInfo: ProvideInfoModel[];
  keywordInfo: ComboModel[];
  goodsKind: GoodsKind;
  statusList: Boolean[];
  typeList: Boolean[];
}
/****************************************************************
 * 검색 Query State
 ****************************************************************/
/** Query String Value Model */
export interface ListSearchQueryValue extends Pick<ListFormField, 'name' | 'dateType' | 'goodsIds' | 'goodsKind'> {
  keywordIds: string;
  brandIds: string;
  providerIds: string;
  fromDate: string;
  toDate: string;
  /* category1: string;
  category2: string;
  category3: string; */
  statuses: string;
  type: string;
}

/** Query Value State (extend Query String Value Model) */
export interface ListSearchQueryState extends QueryState, ListSearchQueryValue {
  size: string;
  page: string;
  sort: string;
}

/**
 * Query value -> Search State 로 치환
 * @use useManagerListSearchService 내 react-hook-form set
 */
export const toFormFieldFromQueryState = (
  defaultFieldValue: ListFormField,
  queryState: ListSearchQueryState,
): ListFormField => {
  const searchValues = { ...defaultFieldValue, ...queryState };
  const { statuses, type, ...props } = searchValues;
  return {
    ...props,
    fromDate: Number(queryState.fromDate) || defaultFieldValue.fromDate,
    toDate: Number(queryState.toDate) || defaultFieldValue.toDate,
    statusList: queryState.statuses
      ? toCbModelFromQueryState(queryState.statuses, SaleStatusCbOptions)
      : defaultFieldValue.statusList,
    typeList: queryState.type
      ? toCbModelFromQueryState(queryState.type, GoodsTypeCbOptions)
      : defaultFieldValue.typeList,
  };
};

/**
 * Search State -> Query value 로 치환
 * @use useManagerListSearchService 내 handleSearchSubmit
 */
export const toQueryStateFromFormField = ({
  brandInfo,
  dateType,
  goodsIds,
  keywordInfo,
  name,
  providerInfo,
  fromDate,
  toDate,
  statusList,
  typeList,
  goodsKind,
}: ListFormField): ListSearchQueryValue => {
  return {
    fromDate: fromDate ? `${fromDate}` : undefined,
    toDate: toDate ? `${toDate}` : undefined,
    statuses: toQueryStateFromCbModel(statusList, SaleStatusCbOptions).join(','),
    type: toQueryStateFromCbModel(typeList, GoodsTypeCbOptions).join(','),
    /* category1: category1 ? `${category1}` : undefined,
    category2: category2 ? `${category2}` : undefined,
    category3: category3 ? `${category3}` : undefined, */
    brandIds: brandInfo.map((v) => v.value).join(','),
    dateType,
    goodsIds,
    keywordIds: keywordInfo.map((v) => v.value).join(','),
    name,
    providerIds: providerInfo.map((v) => v.value).join(','),
    goodsKind: goodsKind ?? undefined,
  };
};

/****************************************************************
 * 검색 Request Params
 ****************************************************************/
/** Submit Request Model */
export interface ListSearchRequestParams extends BaseSearchModel {
  // categoryId: number;
  goodsIds: string[];
  keywordIds: string[];
  brandIds: string[];
  providerIds: string[];
  goodsKind: GoodsKind[];
}

/**
 * form value -> request param 로 치환
 * @use useManagerListSearchService 내 API 내 submit
 */
export const toSearchRequest = ({
  name,
  dateType,
  goodsIds,
  keywordIds,
  fromDate,
  toDate,
  statuses,
  type,
  goodsKind,
  brandIds,
  providerIds,
}: Omit<ListSearchQueryState, 'page' | 'size' | 'sort'>): ListSearchRequestParams => {
  return {
    // categoryId: +category3 || +category2 || +category1 || null,
    name: name as string,
    dateType: (dateType as DateType) ?? DateType.START,
    goodsIds: goodsIds ? (goodsIds as string)?.split(',') : null,
    keywordIds: keywordIds ? (keywordIds as string)?.split(',') : null,
    fromDate: fromDate ? +fromDate : null,
    toDate: toDate ? +toDate : null,
    statuses: statuses ? ((statuses as string)?.split(',') as GoodsStatus[]) : null,
    type: type ? ((type as string)?.split(',') as GoodsType[]) : null,
    goodsKind: goodsKind ? ([goodsKind] as GoodsKind[]) : null,
    brandIds: brandIds ? (brandIds as string)?.split(',') : null,
    providerIds: providerIds ? (providerIds as string)?.split(',') : null,
  };
};
