import { DiscoverKeywordStatus } from '../constants/discoverKeyword';

/**
 * 디스커버 키워드 아이템 schema
 */
export interface DiscoverKeywordItemSchema {
  id: number;
  status: DiscoverKeywordStatus;
  name: string;
  createdDate: number;
  updatedDate: number;
  goodsCount: number;
  showRoomCount: number;
  storyCount: number;
}
