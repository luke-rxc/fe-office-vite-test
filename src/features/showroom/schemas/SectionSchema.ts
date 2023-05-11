import { SearchBaseSchema } from './CommonSchema';

export type SectionListSchema = SearchBaseSchema<SectionListItemSchema>;

export interface SectionListItemSchema {
  contentCount: number;
  createdDate: number;
  id: number;
  sortNumber: number;
  status: 'PRIVATE' | 'PUBLIC';
  title: string;
  type: 'DISCOVER_BANNER' | 'GOODS' | 'SHOWROOM' | 'STORY';
  updatedDate: number;
}
