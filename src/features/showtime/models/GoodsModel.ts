import { pathConfig } from '@config';
import { GoodsSchema } from '@schemas/GoodsSchema';
import { GoodsItem } from '../types';

export interface GoodsModel extends GoodsSchema {
  priceText: string;
  consumerPriceText: string;
}

/**
 * GoodsSchema => GoodsModel convert
 */
export const toGoodsModel = (item: GoodsSchema): GoodsModel => {
  return {
    ...item,
    priceText: `${item.price.toLocaleString()} 원`,
    consumerPriceText: item.consumerPrice > item.price ? `${item.consumerPrice.toLocaleString()} 원` : '',
  };
};

/**
 * GoodsSchema List => GoodsModel List convert
 */
export const toGoodsModelList = (items: Array<GoodsSchema>): Array<GoodsModel> => {
  return items.map(toGoodsModel);
};

/**
 * GoodsModel => GoodsItem convert
 */
export const toGoodsItem = (item: GoodsModel): GoodsItem => {
  return {
    id: item.id,
    name: item.name,
    consumerPrice: item.consumerPrice,
    consumerPriceText: item.consumerPriceText,
    price: item.price,
    priceText: item.priceText,
    primaryImagePath: `${pathConfig.cdnUrl}/${item.primaryImage.path}`,
  };
};
