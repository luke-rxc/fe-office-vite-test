import { GoodsStatus } from '@constants/goods';
import { DisplayStatus } from '../constants';
import { ImageSchema } from './CommonSchema';
import { DiscoverKeywordItemSchema } from './DiscoverKeywordSchema';

/**
 * 상품 schema
 */
export interface GoodsSchema {
  goodsId: number;
  goodsImage: ImageSchema;
  goodsName: string;
  brandName: string;
  providerName: string;
  consumerPrice: number;
  price: number;
  displayStartDate: number;
  displayStatus: DisplayStatus;
  salesStartDate: number;
  salesEndDate: number;
  salesStatus: GoodsStatus;
  goodsType: string;
  showRoomName: string;
  keyword: Array<DiscoverKeywordItemSchema>;
}
