import { SearchBaseSchema, ImageSchema, MediaSchema, ComboSchema } from './CommonSchema';

/**
 * 쇼룸 검색 Schema
 */
export type ShowroomSearchSchema = SearchBaseSchema<ShowroomSearchContentSchema>;

/**
 * 쇼룸 검색 아이템 Schema
 */
export interface ShowroomSearchContentSchema {
  id: number;
  code: string;
  name: string;
  brandId: number;
  brandName: string;
  createdDate: number;
  keywordList: ComboSchema[];
  lastUpdatedDate: number;
  providerId: number;
  providerName: string;
  status: 'ADMIN_PUBLIC' | 'PRIVATE' | 'PUBLIC';
}

/**
 * 쇼룸 상세 정보 Schema
 */
export interface ShowroomInfoSchema {
  id: number;
  code: string;
  name: string;
  providerId: number;
  providerName: string;
  brandId: number;
  brandName: string;
  description: string;
  textColor: string;
  tintColor: string;
  contentColor: string;
  backgroundColor: string;
  primaryImage: ImageSchema;
  lottieImage: ImageSchema;
  coverImage: ImageSchema;
  coverVideo: MediaSchema;
  keywords: ComboSchema[];
  showRoomType: 'NORMAL' | 'CONCEPT';
  status: 'ADMIN_PUBLIC' | 'PRIVATE' | 'PUBLIC';
  sectionId: number;
  discoverUse?: boolean;
}
