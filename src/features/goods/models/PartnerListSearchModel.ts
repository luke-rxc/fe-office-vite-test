import { GoodsStatus } from '@constants/goods';
import type { QueryState } from '@hooks/useQueryState';
import {
  SaleStatusCbOptions,
  GoodsTypeCbOptions,
  RequestStatusCbOptions,
  DateType,
  GoodsType,
  GoodsRequestStatus,
} from '../constants';
import { BaseSearchModel, toCbModelFromQueryState, toQueryStateFromCbModel } from './CommonListSearchModel';
import { ComboModel } from './ComboModel';

/****************************************************************
 * 검색 Field
 ****************************************************************/
interface PartnerBaseSearchModel extends BaseSearchModel {
  requestStatus: GoodsRequestStatus[];
}

export interface PartnerListFormField extends Omit<PartnerBaseSearchModel, 'statuses' | 'type' | 'requestStatus'> {
  goodsIds: string;
  brandInfo: ComboModel[];
  // brandId: string;
  statusList: Boolean[];
  typeList: Boolean[];
  requestStatusList: Boolean[];
}
/****************************************************************
 * 검색 Query State
 ****************************************************************/
/** Query String Value Model */
export interface PartnerListSearchQueryValue extends Pick<PartnerListFormField, 'name' | 'dateType' | 'goodsIds'> {
  brandIds: string;
  fromDate: string;
  toDate: string;
  statuses: string;
  type: string;
  requestStatus: string;
}

/** Query Value State (extend Query String Value Model) */
export interface PartnerListSearchQueryState extends QueryState, PartnerListSearchQueryValue {
  size: string;
  page: string;
  sort: string;
}

/**
 * Query value -> Search State 로 치환
 * @use usePartnerListSearchService 내 react-hook-form set
 */
export const toPartnerFormFieldFromQueryState = (
  defaultFieldValue: PartnerListFormField,
  queryState: PartnerListSearchQueryState,
): PartnerListFormField => {
  const searchValues = { ...defaultFieldValue, ...queryState };
  const { statuses, type, requestStatus, ...props } = searchValues;
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
    requestStatusList: queryState.requestStatus
      ? toCbModelFromQueryState(queryState.requestStatus, RequestStatusCbOptions)
      : defaultFieldValue.requestStatusList,
  };
};

/**
 * Search State -> Query value 로 치환
 * @use usePartnerListSearchService 내 handleSearchSubmit
 * @todo cbOptions type 선언
 */
export const toPartnerQueryStateFromFormField = ({
  brandInfo,
  dateType,
  goodsIds,
  name,
  fromDate,
  toDate,
  statusList,
  typeList,
  requestStatusList,
}: PartnerListFormField): PartnerListSearchQueryValue => {
  return {
    fromDate: fromDate ? `${fromDate}` : undefined,
    toDate: toDate ? `${toDate}` : undefined,
    statuses: toQueryStateFromCbModel(statusList, SaleStatusCbOptions).join(','),
    type: toQueryStateFromCbModel(typeList, GoodsTypeCbOptions).join(','),
    requestStatus: toQueryStateFromCbModel(requestStatusList, RequestStatusCbOptions).join(','),
    brandIds: brandInfo.map((v) => v.value).join(','),
    dateType,
    goodsIds,
    name,
  };
};

/****************************************************************
 * 검색 Request Params
 ****************************************************************/
/** Submit Request Model */
export interface PartnerListSearchRequestParams extends PartnerBaseSearchModel {
  goodsIds: string[];
  brandIds: string[];
}

/**
 * form value -> request param 로 치환
 * @use usePartnerListSearchService 내 API 내 submit
 */
export const toPartnerSearchRequest = ({
  name,
  dateType,
  goodsIds,
  fromDate,
  toDate,
  statuses,
  type,
  requestStatus,
  brandIds,
}: Omit<PartnerListSearchQueryState, 'page' | 'size' | 'sort'>): PartnerListSearchRequestParams => {
  return {
    name: name as string,
    dateType: (dateType as DateType) ?? DateType.START,
    goodsIds: goodsIds ? (goodsIds as string)?.split(',') : null,
    fromDate: fromDate ? +fromDate : null,
    toDate: toDate ? +toDate : null,
    statuses: statuses ? ((statuses as string)?.split(',') as GoodsStatus[]) : null,
    type: type ? ((type as string)?.split(',') as GoodsType[]) : null,
    requestStatus: requestStatus ? ((requestStatus as string)?.split(',') as GoodsRequestStatus[]) : null,
    brandIds: brandIds ? (brandIds as string)?.split(',') : null,
  };
};
