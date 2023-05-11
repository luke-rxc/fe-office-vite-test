import { DiscoverSectionDisplayType, DiscoverSectionType } from '../constants';
import { ContentsSchema } from './ContentsSchema';
import { GoodsSchema } from './GoodsSchema';
import { ShowroomSchema } from './ShowroomSchema';

/**
 * 디스커버 섹션  타입 item
 */
export type DiscoverSectionTypeItemSchema = GoodsSchema | ContentsSchema | ShowroomSchema;

/**
 * 디스커버 섹션 키워드 schema
 */
export interface DiscoverSectionKeywordSchema {
  id: number;
  name: string;
}

/**
 * 디스커버 섹션 아이템 schema
 */
export interface DiscoverSectionItemSchema {
  id: number;
  sectionType: DiscoverSectionType;
  displayType: DiscoverSectionDisplayType;
  title: string;
  keyword?: DiscoverSectionKeywordSchema;
  isDelete: boolean;
  isOpen: boolean;
  createdDate: number;
  updatedDate: number;
}

/**
 * 디스커버 섹션 생성가능 타입 schema
 */
export interface DiscoverSectionCreatableTypeSchema {
  sectionType: DiscoverSectionType;
  displayType: Array<DiscoverSectionDisplayType>;
}
