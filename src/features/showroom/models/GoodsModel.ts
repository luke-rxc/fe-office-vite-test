import { pathConfig } from '@config';
import { toKRW } from '@utils/toKRW';
import { toDateFormat } from '@utils/date';
import { GoodsListItem, GoodsSearchFields, GoodsValidationListItem } from '../types';
import { GoodsSchema, GoodsValidationSchema } from '../schemas';
import { GetAddableGoodsListParams, UpdateGoodsListParams } from '../apis';

/**
 * 상품 정보 데이터 가공
 */
export const toGoodsInfoModel = (schema: GoodsSchema): Omit<GoodsListItem, 'order'> => ({
  id: schema.goodsId,
  name: schema.goodsName,
  type: schema.goodsType,
  status: schema.salesStatus,
  imageURL: schema.goodsImage?.path && `${pathConfig.cdnUrl}/${schema.goodsImage.path}?im=Resize,width=100`,
  brandName: schema.brandName,
  providerName: schema.providerName,
  salesEndDate: schema.salesEndDate ? toDateFormat(schema.salesEndDate) : '상시',
  salesStartDate: toDateFormat(schema.salesStartDate),
  displayStartDate: toDateFormat(schema.displayStartDate),
  price: toKRW(schema.price),
  consumerPrice: toKRW(schema.consumerPrice),
});

/**
 * 전시가능한 상품 테이블 아이템 데이터로 변환
 */
export const toGoodsSearchListModel = (schema?: GoodsSchema[]): GoodsListItem[] => {
  return (schema || []).map((goods, index) => ({
    order: index + 1,
    ...toGoodsInfoModel(goods),
  }));
};

/**
 * 전시상품 테이블 데이터로 변환
 */
export const toGoodsListModel = (schema?: GoodsSchema[]): GoodsListItem[] => {
  return (schema || []).map((goods, index) => ({
    order: index + 1,
    ...toGoodsInfoModel(goods),
  }));
};

/**
 * 전시가능 상품 검색을 위한 파라미터 데이터로 변화
 */
export const toGoodsSearchParamsModel = (values: GoodsSearchFields): Omit<GetAddableGoodsListParams, 'showroomId'> => {
  const { brand, provider, ...rest } = values;

  return {
    brandId: brand?.id,
    providerId: provider?.id,
    ...rest,
  };
};

/**
 * 전시상품 목록 수정을 위한 파라미터 데이터로 변환
 */
export const toGoodsListUpdateParamsModel = ({
  showroomId,
  sectionId,
  items,
}: {
  showroomId: number;
  sectionId: number;
  items: GoodsListItem[];
}): UpdateGoodsListParams => {
  return {
    showroomId,
    sectionId,
    contentIds: items.map(({ id }) => id),
  };
};

/**
 * 전시 상품 등록 가능 여부 결과
 */
export const toGoodsValidationListModel = (schema: GoodsValidationSchema[]) => {
  return schema.reduce<{
    failedItems: GoodsValidationListItem[];
    successfulItems: GoodsValidationListItem[];
  }>(
    (acc, { id, message, success, item }) => {
      const data: GoodsValidationListItem[] = [
        { id, message, success, goods: item ? toGoodsInfoModel(item) : undefined },
      ];

      return {
        failedItems: acc.failedItems.concat(success ? [] : data),
        successfulItems: acc.successfulItems.concat(success ? data : []),
      };
    },
    { failedItems: [], successfulItems: [] },
  );
};
