import { ImageSchema } from './CommonSchema';
import { DiscoverKeywordItemSchema } from './DiscoverKeywordSchema';

/**
 * 콘텐츠 schema
 */
export interface ContentsSchema {
  id: number;
  name: string;
  code: string;
  providerName: string;
  showRoomName: string;
  brandName: string;
  type: string;
  publicStartDate: number;
  publicEndDate: number;
  status: string;
  primaryImage: ImageSchema;
  keyword: Array<DiscoverKeywordItemSchema>;
}
