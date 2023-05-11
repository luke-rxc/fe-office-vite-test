import { CONTENT_TYPE, CONTENT_STATUS_TYPE } from '../constants';

/**
 * 콘텐츠 리스트 스키마
 */
export interface ContentListSchema {
  type: CONTENT_TYPE;
  id: number;
  code: string;
  name: string;
  providerName: string;
  createdDate: number;
  publicStartDate: number;
  publicEndDate: number;
  updatedDate: number;
  showRoomId: number;
  showRoomName: string;
  status: CONTENT_STATUS_TYPE;
  keywordList: {
    id: number;
    name: string;
  }[];
}
