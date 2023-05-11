import { baseApiClient } from '@utils/api';

/**
 * 댓글 관리자 삭제
 */
export const deleteReply = (replyId: number) => {
  return baseApiClient.delete<void>(`/reply/${replyId}`);
};
