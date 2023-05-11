import { baseApiClient } from '@utils/api';
import { ContentListsSchema } from '../schemas';

/**
 * 콘텐츠(편성/미편성) 목록 조회
 */
export const getContentList = async ({ showroomId }: GetContentListParams) => {
  return await baseApiClient.get<ContentListsSchema>(`/showroom/${showroomId}/story`);
};

export interface GetContentListParams {
  showroomId: number;
}

/**
 * 콘텐츠(편성/미편성) 목록 수정
 */
export const updateContentList = async ({ showroomId, ids, exceptIds }: UpdateContentListParams) => {
  return await baseApiClient.put<ContentListsSchema>(`/showroom/${showroomId}/story`, {
    storyIds: ids,
    deleteStoryIds: exceptIds,
  });
};

export interface UpdateContentListParams {
  showroomId: number;
  /** 편성 콘텐츠 IDs */
  ids: number[];
  /** 편성 제외 콘텐츠 IDs */
  exceptIds: number[];
}
