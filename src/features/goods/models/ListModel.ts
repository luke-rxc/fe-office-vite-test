import { PaginationResponse } from '@schemas/PaginationSchema';
// import { CategoriesItem } from '@schemas/GoodsSchema';
import { GoodsStatus, GoodsStatusLabel, GoodsKind } from '@constants/goods';
import { toDateFormat } from '@utils/date';
import { toKRW } from '@utils/toKRW';
import { GoodsTypeLabel } from '../constants';
import { GoodsListSchema, ComboListSchema } from '../schemas';

type GoodsStatusType = keyof typeof GoodsStatus;
export interface ListModel {
  /** 상품 아이디 */
  goodsId: number;
  /** 썸네일 이미지 */
  imageUrl: string;
  /** 상품 유형 */
  type: string;
  /** 브랜드 이름 */
  brandName: string;
  /** 상품명 */
  goodsName: string;
  /** 정상가 */
  consumerPrice: number;
  consumerPriceText: string;
  /** 판매가 */
  price: number;
  priceText: string;
  /** 키워드 */
  keyword: string;

  providerName: string;
  status: GoodsStatusType;
  salesStartDate: string;
  salesEndDate: string;
  goodsKind: GoodsKind;

  /** 상품검수 상태 */
  requestStatus: string;

  /** 상품 검수시 Memo, Partner Only */
  requestMemo: string | null;
}

const toGoodsKeyword = (list: ComboListSchema[]) => {
  if (list.length) {
    return list.map((item) => item.name).join(', ');
  }

  return '';
};

/**
 * Response data -> UI Data Mapping
 * @description
 * 주의 :
 * - isExcelExport : excel export 를 하기 위한 맵핑
 * - excel export 도 겸하기 때문에 해당 순서가 중요
 * - ExcelExportListHeader(src/features/goods/constants/goodsList.ts)와 같아야 함
 */
const toGoodsModelGenerator = (item: GoodsListSchema, isExcelExport = false): Partial<ListModel> => {
  const {
    id,
    primaryImage,
    type,
    brand,
    provider,
    name,
    consumerPrice,
    price,
    status,
    salesStartDate,
    salesEndDate,
    keyword,
    goodsKind,
    requestStatus,
    requestMemo,
  } = item;
  const transformModel = {
    goodsId: id,
    imageUrl: primaryImage.path,
    type: GoodsTypeLabel[type] ?? '',
    brandName: brand?.name ?? '',
    providerName: provider.name,
    goodsName: name,
    consumerPrice,
    consumerPriceText: toKRW(consumerPrice),
    price,
    priceText: toKRW(price),
    requestMemo: requestMemo ?? null,

    /** @todo refactoring */
    status: (GoodsStatusLabel[status] ?? '') as GoodsStatusType,
    salesStartDate: salesStartDate ? toDateFormat(salesStartDate) : '-',
    salesEndDate: salesEndDate ? toDateFormat(salesEndDate) : '상시',
    keyword: toGoodsKeyword(keyword),
    requestStatus,

    // Excel
    goodsKind,
  };

  // ExcelExportListHeader 와 매칭
  if (isExcelExport) {
    const { goodsId, goodsName, type, goodsKind, status, providerName, keyword, salesStartDate, salesEndDate } =
      transformModel;
    return { goodsId, goodsName, type, goodsKind, status, providerName, keyword, salesStartDate, salesEndDate };
  }

  return transformModel;
};

const toGoodsModel = (item: GoodsListSchema): ListModel => toGoodsModelGenerator(item) as ListModel;
const toGoodsExcelModel = (item: GoodsListSchema): Partial<ListModel> => toGoodsModelGenerator(item, true);

/* const toCategoryName = (categories: CategoriesItem[]) => {
  if (categories.length) {
    const {
      one: { name: category1 },
      two: { name: category2 },
      three: { name: category3 },
    } = categories[0];
    return `${category1} > ${category2} > ${category3}`;
  }

  return '';
}; */

export const toGoodsModelList = (data: PaginationResponse<GoodsListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toGoodsModel),
  };
};

export const toGoodsExcelModelList = (data: PaginationResponse<GoodsListSchema>) => {
  return {
    ...data,
    content: data?.content.map(toGoodsExcelModel),
  };
};
