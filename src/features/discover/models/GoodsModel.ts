import { GoodsStatusLabel } from '@constants/goods';
import { toDateFormat } from '@utils/date';
import { DisplayStatusLabel, GoodsTypeLabel } from '../constants';
import { GoodsSchema } from '../schemas';
import { GoodsSearchFormField, GoodsSearchParams } from '../types';
import { ImageModel, toImageModel } from './CommonModel';
import { DiscoverKeywordItemModel, toDiscoverKeywordListModel } from './DiscoverKeywordModel';

/**
 * 상품 model
 */
export interface GoodsModel extends Omit<GoodsSchema, 'keyword'> {
  sortNum: number;
  goodsImage: ImageModel;
  keyword: Array<DiscoverKeywordItemModel>;
  keywordLabel: string;
  consumerPriceText: string;
  priceText: string;
  salesStartDateText: string;
  salesEndDateText: string;
  salesStatusText: string;
  salesStatusClassName: string;
  displayStatusText: string;
  displayStatusClassName: string;
  rowKey: string;
}

/**
 * 상품 schema > 상품 model covert
 */
export const toGoodsModel = (item: GoodsSchema, index: number): GoodsModel => {
  return {
    ...item,
    goodsImage: toImageModel(item.goodsImage),
    keyword: item.keyword ? toDiscoverKeywordListModel(item.keyword) : null,
    keywordLabel: item.keyword
      ? toDiscoverKeywordListModel(item.keyword)
          .map((item) => item.name)
          .join(', ')
      : null,
    consumerPriceText: item.consumerPrice.toLocaleString(),
    priceText: item.price.toLocaleString(),
    salesStartDateText: item.salesStartDate ? toDateFormat(item.salesStartDate) : '-',
    salesEndDateText: item.salesEndDate ? toDateFormat(item.salesEndDate) : '-',
    salesStatusText: item.salesStatus ? GoodsStatusLabel[item.salesStatus] : '',
    salesStatusClassName: item.salesStatus ? item.salesStatus.toLowerCase() : '',
    goodsType: GoodsTypeLabel[item.goodsType] ?? item.goodsType,
    rowKey: item.goodsId.toString(),
    displayStatusText: item.displayStatus ? DisplayStatusLabel[item.displayStatus] : '-',
    displayStatusClassName: item.displayStatus ? item.displayStatus.toLowerCase() : '',
    sortNum: index + 1,
  };
};

/**
 * 상품 schema list > 상품 model list covert
 */
export const toGoodsListModel = (items: Array<GoodsSchema>): Array<GoodsModel> => {
  return items.map(toGoodsModel);
};

/**
 * 상품 검색 form field > 상품 검색 form field covert
 */
export const toGoodsSearchParams = (
  item: GoodsSearchFormField,
  addGoodsList: Array<GoodsModel>,
  page: number,
  size: number,
): GoodsSearchParams => {
  return {
    searchType: item.searchType,
    keyword: item.keyword,
    status: item.status,
    providerId: item.provider ? item.provider.value : null,
    brandId: item.brand ? item.brand.value : null,
    addGoodsIds: addGoodsList ? addGoodsList.map((item) => item.goodsId) : [],
    page,
    size,
  };
};
