import { SearchBaseSchema, ImageSchema } from './CommonSchema';

/**
 * 전시가능 상품 검색 Schema
 */
export type GoodsSearchSchema = SearchBaseSchema<GoodsSearchContentSchema>;

/**
 * 전시가능 상품 검색 아이템 Schema
 */
export type GoodsSearchContentSchema = GoodsSchema;

/**
 * 전시상품 목록 아이템 Schema
 */
export interface GoodsSchema {
  brandName: string;
  consumerPrice: number;
  displayStartDate: number;
  goodsId: number;
  goodsImage: ImageSchema;
  goodsName: string;
  goodsType: 'AUCTION' | 'NORMAL' | 'PREORDER';
  price: number;
  providerName: string;
  salesEndDate: number;
  salesStartDate: number;
  salesStatus: 'NORMAL' | 'RUNOUT' | 'UNSOLD';
}

/**
 * 등록가능 상품 여부에 대한 결과정보 Schema
 */
export interface GoodsValidationSchema {
  id: number;
  item: GoodsSchema;
  success: boolean;
  message: string;
}

/**
 * 상품 리스트 수정에 따른 응답값
 */
export interface GoodsStatusSchema {
  id: number;
  createdDate: number;
  contentCount: number;
  status: 'PRIVATE' | 'PUBLIC';
  title: string;
  type: 'GOODS'; // 'DISCOVER_BANNER' | 'GOODS' | 'SHOWROOM' | 'STORY';
  sortNumber?: number;
  updatedDate?: string;
}
