import { ImageSchema } from './CommonSchema';

/**
 * 콘텐츠(편성/미편성) 목록 Schema
 */
export interface ContentListsSchema {
  published: ContentSchema[];
  unpublished: ContentSchema[];
}

/**
 * 콘텐츠 Schema
 */
export interface ContentSchema {
  endDate: number;
  providerId: number;
  providerName: string;
  publicStatus: 'CLOSED' | 'PUBLISHABLE' | 'PUBLISHED' | 'RESERVED' | 'UNPUBLISHABLE';
  showRoomId: number;
  showRoomName: string;
  sortNumber: number;
  startDate: number;
  storyId: number;
  storyImage: ImageSchema;
  storyName: string;
  type: 'COLLABORATION' | 'EVENT' | 'EXCLUSIVE' | 'STORY' | 'TEASER';
}
