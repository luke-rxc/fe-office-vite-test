import { baseApiClient } from '@utils/api';
import { stringify } from '../utils';
import { BaseListSchema, SettlementItemSchema } from '../schemas';

/**
 * 정산 목록 조회 api
 */
export const getSettlementList = (params: GetSettlementListParams) => {
  return baseApiClient.get<BaseListSchema<SettlementItemSchema>>(`/settlement/count?${stringify(params)}`);
};
export interface GetSettlementListParams {
  /** 정산 년 */
  year?: number;
  /** 정산 주기 */
  round?: number;
  /** 정산 회차 */
  count?: number;
  /** 테이블 row 개수 */
  size?: number;
  /** 페이지 인덱스 */
  page?: number;
}

/**
 * 정산 요청  api
 */
export const postSettlementExecute = (params: PostSettlementExecuteParams) => {
  return baseApiClient.post('settlement/execute', params);
};
export interface PostSettlementExecuteParams {
  /** 정산 년월 */
  yyyyMM: string;
  /** 정산 주기 */
  round: number;
  /** 정산 회차 */
  count: number;
}
