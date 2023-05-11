import { baseApiClient } from '@utils/api';
import { ContentDefaultSchema } from '../schemas';

/**
 * 기본정보 관리
 */
export const getContentDefault = (contentId: number): Promise<ContentDefaultSchema> => {
  return baseApiClient.get<ContentDefaultSchema>(`/story/${contentId}`);
};
