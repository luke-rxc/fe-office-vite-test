import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import { DiscoverKeywordItemModel } from '../models/DiscoverKeywordModel';
import { KeywordComboSchema } from '../schemas';
import {
  DiscoverKeywordModifyParams,
  DiscoverKeywordRegistExcelItem,
  DiscoverKeywordRegistResponse,
  DiscoverKeywordSearchParams,
} from '../types';

/**
 * 디스커버 키워드 리스트 조회
 */
export const getDiscoverKeywordList = ({
  page,
  size,
  status,
}: DiscoverKeywordSearchParams): Promise<PaginationResponse<DiscoverKeywordItemModel>> => {
  return baseApiClient.get<PaginationResponse<DiscoverKeywordItemModel>>(
    `/v1/keyword?page=${page}&size=${size}&sort=id,DESC${status ? `&status=${status}` : ''}`,
  );
};

/**
 * 디스커버 키워드 등록
 */
export const postDiscoverKeyword = (value: string): Promise<object> => {
  return baseApiClient.post<object>('/v1/keyword', { value });
};

/**
 * 디스커버 키워드 상세 조회
 */
export const getDiscoverKeyword = (keywordId: string): Promise<DiscoverKeywordItemModel> => {
  return baseApiClient.get<DiscoverKeywordItemModel>(`/v1/keyword/${keywordId}`);
};

/**
 * 디스커버 키워드 수정
 */
export const putDiscoverKeyword = ({ keywordId, ...params }: DiscoverKeywordModifyParams): Promise<object> => {
  return baseApiClient.put<object>(`/v1/keyword/${keywordId}`, params);
};

/**
 * 디스커버 키워드 수정
 */
export const getDiscoverKeywordComboList = (): Promise<KeywordComboSchema> => {
  return baseApiClient.get<KeywordComboSchema>(`v1/keyword/combo`);
};

/**
 * 디스커버 키워드 일괄등록 체크
 */
export const postDiscoverKeywordMappingRegistCheck = <T>({
  keywordId,
  mappingType,
  ...params
}: DiscoverKeywordRegistExcelItem): Promise<Array<DiscoverKeywordRegistResponse<T>>> => {
  return baseApiClient.post<Array<DiscoverKeywordRegistResponse<T>>>(`/${mappingType}/validate/bulk`, params);
};
