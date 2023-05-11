import { ShowroomType } from '../constants';
import { ImageSchema } from './CommonSchema';
import { DiscoverKeywordItemSchema } from './DiscoverKeywordSchema';

/**
 * 쇼룸 schema
 */
export interface ShowroomSchema {
  id: number;
  code: string;
  name: string;
  providerName: string;
  brandName: string;
  status: string;
  keyword: Array<DiscoverKeywordItemSchema>;
  primaryImage: ImageSchema;
  type: ShowroomType;
  createdDate: number;
  lastUpdatedDate: number;
}

/**
 * 브랜드 combo schema
 */
export interface ShowroomComboSchema {
  id: number;
  name: string;
}

/**
 * 브랜드 combo list schema
 */
export interface ShowroomComboListSchema {
  items: Array<ShowroomComboSchema>;
}
