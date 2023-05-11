import { toKRW } from '@utils/toKRW';
import { BulkDetailSchema } from '../schemas';

export type BulkDetailModel = BulkDetailSchema;

/**
 * 일괄수정 상세 페이지내 받은 Api 데이터를 기반으로 Goods(goods-base, goods-mapping) Mapping
 * - keywords, searchTags 값이 있는 경우라면 형식에 맞게 맵핑
 */
const toBulkDetailGoodsModel = (item: Record<string, any>): Record<string, any> => {
  const { keywords, searchTags, ...etcItems } = item;
  const extendsParams = {
    ...(keywords && { keywords: keywords.toString() }),
    ...(searchTags && { searchTags: searchTags.toString() }),
  };

  return {
    ...extendsParams,
    ...etcItems,
  };
};

/**
 * 일괄수정 상세 페이지내 받은 Api 데이터를 기반으로 Option Mapping
 * - commissionRate, consumerPrice, price 값이 있는 경우라면 형식에 맞게 맵핑
 */
const toBulkDetailOptionsModel = (item: Record<string, any>): Record<string, any> => {
  const { consumerPrice, price, commissionRate, ...etcItems } = item;
  const extendsParams = {
    ...(commissionRate && { commissionRate: `${commissionRate}%` }),
    ...(consumerPrice && { consumerPrice: toKRW(consumerPrice) }),
    ...(price && { price: toKRW(price) }),
  };

  return {
    ...extendsParams,
    ...etcItems,
  };
};

/**
 * 일괄수정 상세 페이지내 받은 Api 데이터를 기반으로 Mapping
 */
export const toBulkDetail = (data: BulkDetailSchema): BulkDetailModel => {
  const { option, goods, ...etcData } = data;
  return {
    option: option?.map(toBulkDetailOptionsModel),
    goods: goods?.map(toBulkDetailGoodsModel),
    ...etcData,
  };
};
