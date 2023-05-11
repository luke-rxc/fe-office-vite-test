import { baseApiClient } from '@utils/api';
import { stringify } from '../utils';
import { BaseListSchema, ComboListSchema, ProviderSettlementItemSchema, ExportExcelSchema } from '../schemas';

/**
 * 입점사별 정산 목록 조회 api
 */
export const getProviderSettlementList = (params: GetProviderSettlementListParams) => {
  return baseApiClient.get<BaseListSchema<ProviderSettlementItemSchema>>(`/settlement/search?${stringify(params)}`);
};
export interface GetProviderSettlementListParams {
  /** 정산 년월 */
  yyyyMm?: string;
  /** 정산 회차 */
  count?: number;
  /** 정산 주기 */
  round?: number;
  /** 입점사명 */
  providerName?: string;
  /** 정산금 지급 여부 */
  isPaid?: boolean;
  /** 세금계산서 발행 여부 */
  isTaxBillPublished?: boolean;
  /** 페이지 index */
  page?: number;
  /** 페이지 row 개수 */
  size?: number;
}

/**
 * 세금 계산서 발행 api
 */
export const postPublishTaxBill = ({ ids }: PostPublishTaxBillParams) => {
  return baseApiClient.post('settlement/publish-tax-bill', { ids });
};
export interface PostPublishTaxBillParams {
  /** 정산 ids */
  ids: number[];
}

/**
 * 정산금 지급 api
 */
export const postPaidPrice = ({ ids }: PostPaidPriceParams) => {
  return baseApiClient.post('settlement/paid-price', { ids });
};
export interface PostPaidPriceParams {
  /** 정산 ids */
  ids: number[];
}

/**
 * 정산 재시도 api
 */
export const postSettlementReExecute = ({ id: settlementId }: PostSettlementReExecuteParams) => {
  return baseApiClient.post(`settlement/execute/${settlementId}`);
};
export interface PostSettlementReExecuteParams {
  /** 정산 id */
  id: number;
}

/**
 * [엑셀파일 생성용] 특정 입점사의 정산 상세 데이터 api
 */
export const getExcelByProviderSettlement = ({ id: settlementId }: GetExcelByProviderSettlementParams) => {
  return baseApiClient.get<ExportExcelSchema>(`/settlement/${settlementId}/excel`);
};
export interface GetExcelByProviderSettlementParams {
  /** 정산 id */
  id: number;
}

/**
 * [엑셀파일 생성용] 입점사별 정산 목록 데이터 === 전체다운로드 api
 */
export const getExcelAllListByProviderSettlement = (params: GetExcelAllListByProviderSettlementParams) => {
  return baseApiClient.get<ExportExcelSchema>(`/settlement/excel?${stringify(params)}`);
};
export interface GetExcelAllListByProviderSettlementParams {
  /** 년월 */
  yyyyMm?: string;
  /** 정산 주기 */
  round?: number;
  /** 정산 회차 */
  count?: number;
  /** 정산 ids */
  ids?: number[];
  /** 정산금 지급 여부 */
  isPaid?: boolean;
  /** 세금 계산서 발행 여부 */
  isTaxBillPublished?: boolean;
  /** 입점사명 */
  providerName?: string;
}

/**
 * 입점사명 콤보 리스트 api
 */
export const getProviderNamesForCombobox = () => {
  return baseApiClient.get<ComboListSchema>(`common/combo/PROVIDER`);
};
