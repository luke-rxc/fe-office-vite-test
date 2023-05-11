import { DEAL_SALE_STATUS, GOODS_SEARCH_TYPE } from '../constants';
import { GoodsSchema } from '../schemas';
import { ComboItemModel } from './ComboList';
import { GoodsModel } from './Common';

/**
 * 상품 검색폼 피드
 */
export type GoodsSearchFieldModel = {
  // 상품검색 유형
  searchType: GOODS_SEARCH_TYPE;
  // 상품 검색어
  keyword: string;
  // 입점사 리스트
  providerId: ComboItemModel[] | ComboItemModel;
  // 브랜드 리스트
  brandId: ComboItemModel[] | ComboItemModel;
  // 내브랜드 조회
  isMyBrand: boolean;
  // 상품판매 상태
  status: DEAL_SALE_STATUS | '';
  // page
  page?: number;
  // 조회개수
  size?: number;
};

/**
 * 상품 리스트 조회 쿼리
 */
export type GoodsListQueryState = GoodsSearchFieldModel;

/**
 * request params
 */
export type GoodsRequestParams = {
  searchType: GOODS_SEARCH_TYPE;
  status: string;
  providerId: number;
  keyword: string;
  isMyBrand: boolean;
  brandId: number;
  exceptGoodsIds: number[];
  page?: number;
  size?: number;
};

/**
 * 검색 쿼리 파람
 * @param param
 * @returns
 */
export const toGoodsQueryParams = (queryState: GoodsListQueryState, list: GoodsModel[] = []): GoodsRequestParams => {
  const { searchType, keyword, providerId, brandId, isMyBrand, status, page, size } = queryState;
  const provider = providerId as ComboItemModel;
  const providerIdValue = (provider?.value as number) ?? null;
  const brand = brandId as ComboItemModel;
  const brandIdValue = (brand?.value as number) ?? null;
  return {
    searchType,
    keyword,
    providerId: providerIdValue,
    brandId: brandIdValue,
    isMyBrand,
    status,
    exceptGoodsIds: list.map((goods) => goods.goodsId),
    page,
    size,
  };
};

export const toGoodsListModel = (schema?: GoodsSchema[]): GoodsModel[] => {
  return (schema || []).map((goods) => ({
    ...goods,
  }));
};
