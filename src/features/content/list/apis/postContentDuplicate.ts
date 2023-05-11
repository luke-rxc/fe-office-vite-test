import { baseApiClient } from '@utils/api';

/**
 * 콘텐츠 복제
 */
export const postContentDuplicate = (id: number) => {
  return baseApiClient.post(`/story/${id}/copy`);
};
