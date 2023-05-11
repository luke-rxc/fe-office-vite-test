import { baseApiClient } from '@utils/api';
import { ReplyListPageSchema } from '../schemas';
import { RequestParams } from '../models';

/**
 * 댓글 리스트 조회
 */
export const getReplyList = (id: number, params: RequestParams): Promise<ReplyListPageSchema> => {
  const { page, size, ...param } = params;
  return baseApiClient.get<ReplyListPageSchema>(`/reply/story/${id}/search?page=${page}&size=${size}`, {
    ...param,
  });
};
