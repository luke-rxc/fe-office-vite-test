import { baseApiClient } from '@utils/api';
import { ContentRequestParams } from '../schemas';

/**
 * 콘텐츠 미리보기
 */
type PostPreviewParams = {
  contentId: string;
  params: ContentRequestParams;
};
export const postPreview = async ({ contentId, params }: PostPreviewParams) => {
  return baseApiClient.post(`/story/${contentId}/component/preview`, params);
};
