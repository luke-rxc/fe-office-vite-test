import { DiscoverFeedStatus } from '../constants';
import { DiscoverSectionItemSchema } from './DiscoverSectionSchema';

/**
 * 디스커버 피드 전시그룹 schema
 */
export interface DiscoverFeedDisplayGroupSchema {
  id: number;
  displayStartDate: number;
  sections: Array<DiscoverSectionItemSchema>;
  status?: DiscoverFeedStatus;
  sectionSize?: number;
  isDelete: boolean;
}
