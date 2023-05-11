import { baseApiClient } from '@utils/api';
import { ContentDefaultRequestParams } from '../models';

/**
 * 기본관리 업데이트
 */
export const updateContentDefault = (id: number, params: ContentDefaultRequestParams) => {
  return baseApiClient.put(`/story/${id}`, params);
};
