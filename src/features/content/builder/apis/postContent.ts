import { baseApiClient } from '@utils/api';
import { ContentRequestParams } from '../schemas';

/**
 * 콘텐츠 등록/업데이트
 */
type PostContentParams = {
  contentId: string;
  params: ContentRequestParams;
};
export const postContent = async ({ contentId, params }: PostContentParams) => {
  return baseApiClient.post(`/story/${contentId}/component`, params);
};
