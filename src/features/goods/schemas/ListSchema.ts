import { GoodsKind } from '@constants/goods';
import { GoodsSchema } from '@schemas/GoodsSchema';
import { GoodsType } from '../constants';
import { ComboListSchema } from './ComboSchema';

export interface GoodsListSchema extends GoodsSchema {
  keyword: ComboListSchema[];
  type: GoodsType;
  goodsKind: GoodsKind;
  requestStatus: string;
  requestMemo: string | null;
}
