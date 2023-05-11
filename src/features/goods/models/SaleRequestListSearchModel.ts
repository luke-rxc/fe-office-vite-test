import type { QueryState } from '@hooks/useQueryState';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { pathConfig } from '@config';
import { toDateFormat } from '@utils/date';
import { SaleRequestListSchema, SaleRequestModifyListSchema, SaleRequestRejectListSchema } from '../schemas';
import { DateType, GoodsTypeCbOptions, SaleRequestType, GoodsType, MaxPurchaseLimit } from '../constants';
import { ProviderModel } from './ProviderModel';
import { ComboModel } from './ComboModel';
import { toCbModelFromQueryState, toQueryStateFromCbModel } from './CommonListSearchModel';

/****************************************************************
 * 검색 Field
 ****************************************************************/
export interface SaleRequestListFormField {
  /** 상품명 */
  name: string;
  /** 상품 아이디 */
  goodsIds: string;
  /** 상품 유형 */
  typeList: Boolean[];
  /** 입점사 */
  providerInfo: ProviderModel;
  /** 브랜드 */
  brandInfo: ComboModel;
  /** MD */
  mdId: number | '';
  /** 상품담당자 */
  amdId: number | '';
  /** 판매기간 기준 */
  dateType: DateType;
  /** 판매기간 > 시작 */
  fromDate: number | null;
  /** 판매기간 > 종료 */
  toDate: number | null;
}

/****************************************************************
 * 검색 Query State
 ****************************************************************/
interface SaleRequestSearchQueryValue extends Pick<SaleRequestListFormField, 'name' | 'goodsIds' | 'dateType'> {
  type: string;
  providerId: string;
  brandId: string;
  mdId: string;
  amdId: string;
  fromDate: string;
  toDate: string;
}

export interface SaleRequestSearchQueryState extends QueryState, SaleRequestSearchQueryValue {
  size: string;
  page: string;
  sort: string;
  requestType: SaleRequestType;
}

/**
 * Query value -> Search State(FormField) 로 치환
 */
export const toSaleRequestFormFieldFromQueryState = (
  defaultFieldValue: SaleRequestListFormField,
  queryState: SaleRequestSearchQueryState,
): SaleRequestListFormField => {
  const searchValues = { ...defaultFieldValue, ...queryState };
  const { ...props } = searchValues;
  return {
    ...props,
    name: queryState.name || defaultFieldValue.name,
    goodsIds: queryState.goodsIds || defaultFieldValue.goodsIds,
    typeList: queryState.type
      ? toCbModelFromQueryState(queryState.type, GoodsTypeCbOptions)
      : defaultFieldValue.typeList,
    dateType: queryState.dateType || defaultFieldValue.dateType,
    mdId: Number(queryState.mdId) || defaultFieldValue.mdId,
    amdId: Number(queryState.amdId) || defaultFieldValue.amdId,
    fromDate: Number(queryState.fromDate) || defaultFieldValue.fromDate,
    toDate: Number(queryState.toDate) || defaultFieldValue.toDate,
  };
};

/**
 * Search State -> Query value 로 치환
 * @use useListSearchService 내 handleSearchSubmit
 */
export const toSaleRequestQueryStateFromFormField = ({
  name,
  dateType,
  typeList,
  goodsIds,
  providerInfo,
  brandInfo,
  mdId,
  amdId,
  fromDate,
  toDate,
}: SaleRequestListFormField): SaleRequestSearchQueryValue => {
  return {
    name,
    dateType,
    type: toQueryStateFromCbModel(typeList, GoodsTypeCbOptions).join(','),
    goodsIds,
    providerId: providerInfo?.value ? `${providerInfo.value}` : undefined,
    brandId: brandInfo?.value ? `${brandInfo.value}` : undefined,
    mdId: mdId ? `${mdId}` : '',
    amdId: amdId ? `${amdId}` : '',
    fromDate: fromDate ? `${fromDate}` : undefined,
    toDate: toDate ? `${toDate}` : undefined,
  };
};

/****************************************************************
 * 검색 결과 Model
 ****************************************************************/
/**********************************************
 * 승인요청
 **********************************************/
export interface SaleRequestListModel
  extends Omit<
    SaleRequestListSchema,
    'primaryImage' | 'displayStartDate' | 'saleStartDate' | 'saleEndDate' | 'userMaxPurchaseLimit' | 'userMaxPurchaseEa'
  > {
  /** 판매 상태 */
  statusText: string;
  /** 섬네일 Path */
  primaryImagePath: string;
  /** 전시 시작일 */
  displayStartDateText: string;
  /** 판매일 */
  saleStartDateText: string;
  saleEndDateText: string;
  /** 1인 최대 구매수량 */
  userMaxPurchaseText: string;
}

const toSaleRequestModel = (item: SaleRequestListSchema): SaleRequestListModel => {
  const {
    request,
    primaryImage,
    displayStartDate,
    saleStartDate,
    saleEndDate,
    userMaxPurchaseLimit,
    userMaxPurchaseEa,
    ...etcItems
  } = item;
  const saleEndDateText = saleEndDate ? toDateFormat(saleEndDate) : '상시';
  return {
    ...etcItems,
    request,
    statusText: request.status.value,
    primaryImagePath: `${pathConfig.cdnUrl}/${primaryImage.path}`,
    displayStartDateText: toDateFormat(displayStartDate),
    saleStartDateText: toDateFormat(saleStartDate),
    saleEndDateText,
    userMaxPurchaseText: userMaxPurchaseLimit === MaxPurchaseLimit.UNLIMIT ? '제한없음' : `${userMaxPurchaseEa}`,
  };
};

export const toSaleRequestModelList = (data: PaginationResponse<SaleRequestListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toSaleRequestModel),
  };
};

/**********************************************
 * 반려
 **********************************************/
export interface SaleRequestRejectListModel
  extends Pick<SaleRequestRejectListSchema, 'goodsId' | 'brandName' | 'goodsName'> {
  /** 반려 메모 */
  responseMemo: string;
  /** 반려 유형 */
  responseStatus: string;
  /** 반려 날짜 */
  responseDate: string;
}

const toSaleRequestRejectModel = (item: SaleRequestRejectListSchema): SaleRequestRejectListModel => {
  const { response, goodsId, brandName, goodsName } = item;
  const {
    memo,
    date,
    status: { value: responseStatus },
  } = response;
  return {
    goodsId,
    brandName,
    goodsName,
    responseMemo: memo ?? '',
    responseStatus,
    responseDate: toDateFormat(date),
  };
};

export const toSaleRequestRejectModelList = (data: PaginationResponse<SaleRequestRejectListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toSaleRequestRejectModel),
  };
};

/**********************************************
 * 수정요청
 **********************************************/
export interface SaleRequestModifyListModel
  extends Omit<SaleRequestModifyListSchema, 'salesPeriod' | 'purchaseEa' | 'request'> {
  /** (기존)판매 시작일 */
  fromStartDate: string;
  /** (기존)판매 종료일 */
  fromEndDate: string;
  /** (기존)판매일 수정 여부*/
  isChangeFromSaleDate: boolean;
  /** (변경)판매 시작일 */
  toStartDate: string;
  /** (변경)판매 종료일 */
  toEndDate: string;
  /** (변경)판매일 수정 여부*/
  isChangeToSaleDate: boolean;
  /** (기존)제한수량 */
  fromUserMaxEaText: string;
  /** (변경)제한수량 */
  toUserMaxEaText: string;
  /** 제한수량 변경여부 */
  isChangeUserMaxEa: boolean;
  /** 수정 사유 */
  reason: string;
}

const toSaleRequestModifyModel = (item: SaleRequestModifyListSchema): SaleRequestModifyListModel => {
  const { salesPeriod, purchaseEa, request, ...etcItems } = item;
  const { fromStartDate, fromEndDate, toStartDate, toEndDate, changeStart, changeEnd } = salesPeriod;
  const { fromUserMaxEa, fromUserMaxLimit, toUserMaxEa, toUserMaxLimit, changeUserMaxEa } = purchaseEa;
  const { memo } = request;
  const fromEndDateText = fromEndDate ? toDateFormat(fromEndDate) : '상시';
  const toEndDateText = toEndDate ? toDateFormat(toEndDate) : '상시';
  return {
    ...etcItems,
    fromStartDate: toDateFormat(fromStartDate),
    fromEndDate: fromEndDateText,
    isChangeFromSaleDate: changeStart,
    toStartDate: toDateFormat(toStartDate),
    toEndDate: toEndDateText,
    isChangeToSaleDate: changeEnd,
    fromUserMaxEaText: fromUserMaxLimit === MaxPurchaseLimit.UNLIMIT ? '제한없음' : `${fromUserMaxEa}`,
    toUserMaxEaText: toUserMaxLimit === MaxPurchaseLimit.UNLIMIT ? '제한없음' : `${toUserMaxEa}`,
    isChangeUserMaxEa: changeUserMaxEa,
    reason: memo,
  };
};

export const toSaleRequestModifyModelList = (data: PaginationResponse<SaleRequestModifyListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toSaleRequestModifyModel),
  };
};

/*
export interface BulkListModel extends Omit<BulkListSchema, 'createdDate' | 'updatedDate' | 'reservationDate'> {
  isStandBy: boolean;
  createdDate: string;
  resultDate: string;
}
*/
/****************************************************************
 * 검색 Request Params
 ****************************************************************/
export interface SaleRequestSearchRequestParams
  extends Pick<SaleRequestListFormField, 'name' | 'dateType' | 'fromDate' | 'toDate'> {
  goodsIds: string[];
  keywordIds: string[];
  type: GoodsType[];
  providerId: number | null;
  brandId: number | null;
  mdId: number | null;
  amdId: number | null;
}

/**
 * form value -> request param 로 치환
 * @use useListSearchService 내 API 내 submit
 */
export const toSaleRequestSearchRequest = ({
  name,
  goodsIds,
  keywordIds,
  type,
  fromDate,
  toDate,
  brandId,
  providerId,
  mdId,
  amdId,
  dateType,
}: Omit<SaleRequestSearchQueryState, 'page' | 'size' | 'sort' | 'requestType'>): SaleRequestSearchRequestParams => {
  return {
    name: name as string,
    goodsIds: goodsIds ? (goodsIds as string)?.split(',') : null,
    keywordIds: keywordIds ? (keywordIds as string)?.split(',') : null,
    type: type ? ((type as string)?.split(',') as GoodsType[]) : null,
    fromDate: fromDate ? +fromDate : null,
    toDate: toDate ? +toDate : null,
    brandId: brandId ? +brandId : null,
    providerId: providerId ? +providerId : null,
    mdId: mdId ? +mdId : null,
    amdId: amdId ? +amdId : null,
    dateType: (dateType as DateType) ?? DateType.START,
  };
};
