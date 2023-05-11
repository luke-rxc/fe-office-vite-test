import { PaginationResponse } from '@schemas/PaginationSchema';
import { ReplyListModel } from '../models';

/**
 * 댓글 리스트 스키마
 */
export type ReplyListSchema = ReplyListModel;

export type ReplyListPageSchema = PaginationResponse<ReplyListSchema> & {
  exportMeta: {
    contentName: string;
    showRoomName: string;
  };
};
