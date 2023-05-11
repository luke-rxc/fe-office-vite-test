import { baseApiClient } from '@utils/api';
import { ContentCreatorRequestParams } from '../models';
import { ContentCreatorSchema } from '../schemas';

/**
 * 콘텐츠 등록
 */
export const postContentCreator = (params: ContentCreatorRequestParams): Promise<ContentCreatorSchema> => {
  return baseApiClient.post<ContentCreatorSchema>('/story', params);
};
