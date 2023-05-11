import { baseApiClient } from '@utils/api';
// import { apiSchemaMock } from '../mocks/';
import { ContentSchema } from '../schemas';

/**
 * 콘텐츠 조회
 */
export const getContent = (contentId: string): Promise<ContentSchema> => {
  return baseApiClient.get<ContentSchema>(`/story/${contentId}/component`);
  // return Promise.resolve(apiSchemaMock);
};
