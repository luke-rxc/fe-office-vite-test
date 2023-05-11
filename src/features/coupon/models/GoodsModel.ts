import { GoodsSchema } from '../schemas';

export type GoodsModel = GoodsSchema;

export const toGoodsModel = (item: GoodsSchema): GoodsModel => {
  return { ...item };
};

export const toGoodsModelList = (items: Array<GoodsSchema>): Array<GoodsModel> => {
  return items.map(toGoodsModel);
};
