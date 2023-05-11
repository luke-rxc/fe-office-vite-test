import { TOption } from '@components/Select';
import {
  OrderGoodsModel,
  OrderGoodsOptionModel,
  OrderRequestReturnSenderModel,
  toOrderGoodsModel,
  toOrderGoodsOptionModel,
} from '.';
import {
  OrderGoodsOptionItemSchema,
  OrderRequestExchangeableItemOptionSchema,
  OrderRequestExchangeOptionSchema,
} from '../schemas';
import { OrderRequestExchangeFormField } from '../types';

/**
 * 주문 상품 option item model
 */
export interface OrderGoodsOptionItemModel extends OrderGoodsOptionModel {
  isExchangeable: boolean;
  priceText: string;
}

/**
 * 주문 교환신청 가능 item option model
 */
export interface OrderRequestExchangeableItemOptionModel extends OrderRequestExchangeableItemOptionSchema {
  goods: OrderGoodsModel;
  goodsOptions: Array<TOption>;
  goodsStockList: Array<{ id: number; purchasableStock: number }>;
  packageOption: OrderGoodsOptionModel;
  providerRowspan: number | null;
  exportGroupRowspan: number | null;
  rowKey: string;
}

/**
 * 주문 교환신청 option model
 */
export interface OrderRequestExchangeOptionModel extends OrderRequestExchangeOptionSchema {
  exchangeableItemOptionList: Array<OrderRequestExchangeableItemOptionModel>;
  returnSender: OrderRequestReturnSenderModel;
}

// --------------------------------- convert --------------------------------- //

/**
 * 주문 상품 option item schema > 주문 상품 option item model convert
 */
export const toOrderGoodsOptionItemModel = (item: OrderGoodsOptionItemSchema): OrderGoodsOptionItemModel => {
  return {
    ...toOrderGoodsOptionModel(item),
    isExchangeable: item.isExchangeable,
  };
};

/**
 * 주문 상품 option item schema list > 주문 상품 option item model list convert
 */
export const toOrderGoodsOptionItemModelList = (
  items: Array<OrderGoodsOptionItemSchema>,
): Array<OrderGoodsOptionItemModel> => {
  return items.map(toOrderGoodsOptionItemModel).filter((item) => item.isExchangeable);
};

/**
 * 입점사그룹 count 조회
 */
const getProviderGroupCount = (items: Array<OrderRequestExchangeableItemOptionModel>, providerId: number): number => {
  return items.filter((item) => item.provider.id === providerId).length;
};

/**
 * 출고그룹 count 조회
 */
const getExportGroupCount = (items: Array<OrderRequestExchangeableItemOptionModel>, exportId: number): number => {
  return items.filter((item) => item.exportId === exportId).length;
};

/**
 * rowspan 처리를 위한 설정
 */
export const convertRowExchangeGroup = (
  items: Array<OrderRequestExchangeableItemOptionModel>,
): Array<OrderRequestExchangeableItemOptionModel> => {
  return items.reduce<{
    providerId: number | null;
    exportId: number | null;
    exchangeableItemOptionList: Array<OrderRequestExchangeableItemOptionModel>;
  }>(
    ({ providerId, exportId, exchangeableItemOptionList }, item) => {
      if (providerId !== item.provider.id && exportId !== item.exportId) {
        exchangeableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
          exportGroupRowspan: getExportGroupCount(items, item.exportId),
        });
        return {
          providerId: item.provider.id,
          exportId: item.exportId,
          exchangeableItemOptionList,
        };
      } else if (providerId !== item.provider.id) {
        exchangeableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
        });
        return {
          providerId: item.provider.id,
          exportId,
          exchangeableItemOptionList,
        };
      } else if (exportId !== item.exportId) {
        exchangeableItemOptionList.push({
          ...item,
          exportGroupRowspan: getExportGroupCount(items, item.exportId),
        });
        return {
          providerId,
          exportId: item.exportId,
          exchangeableItemOptionList,
        };
      } else {
        exchangeableItemOptionList.push({
          ...item,
          providerRowspan: 0,
          exportGroupRowspan: 0,
        });
        return {
          providerId,
          exportId,
          exchangeableItemOptionList,
        };
      }
    },
    { providerId: null, exportId: null, exchangeableItemOptionList: [] },
  ).exchangeableItemOptionList;
};

/**
 * 주문 상품 option item schema list > option list convert
 */
const toGoodsOptions = (items: Array<OrderGoodsOptionItemSchema>, goodsName: string): Array<TOption> => {
  return items.map((item) => {
    // 옵션에 itemList가 빈배열일 경우 상품명으로 대체
    if (item.itemList.length === 0) {
      return {
        label: `${goodsName} [재고: ${item.stock} / 가용:${item.purchasableStock}] ${item.price.toLocaleString()}원`,
        value: item.id,
        readOnly: !item.isExchangeable,
      };
    }
    return {
      label: item.itemList
        .map((option) => {
          return `${option.title}: ${option.value} [재고: ${item.stock} / 가용:${
            item.purchasableStock
          }] ${item.price.toLocaleString()}원`;
        })
        .join(', '),
      value: item.id,
      readOnly: !item.isExchangeable,
    };
  });
};

/**
 * 주문 상품 option item schema list > stock list convert
 */
const toGoodsStockList = (
  items: Array<OrderGoodsOptionItemSchema>,
): Array<{
  id: number;
  purchasableStock: number;
}> => {
  return items.map((item) => {
    return {
      id: item.id,
      purchasableStock: item.purchasableStock,
    };
  });
};

/**
 * 주문 교환신청 가능 item option schema > 주문 교환신청 가능 item option model convert
 */
export const toOrderRequestExchangeableItemOptionModel = (
  item: OrderRequestExchangeableItemOptionSchema,
): OrderRequestExchangeableItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    goodsOptions: toGoodsOptions(item.goodsOptionList, item.goods.name),
    goodsStockList: toGoodsStockList(item.goodsOptionList),
    packageOption: item.packageOption ? toOrderGoodsOptionModel(item.packageOption) : null,
    providerRowspan: null,
    exportGroupRowspan: null,
    rowKey: `${item.id}_${item.goods.option.id}_${item.exportId}`,
  };
};

/**
 * 주문 교환신청 가능 item option schema list > 주문 교환신청 가능 item option model list convert
 */
export const toOrderRequestExchangeableItemOptionModelList = (
  items: Array<OrderRequestExchangeableItemOptionSchema>,
): Array<OrderRequestExchangeableItemOptionModel> => {
  return convertRowExchangeGroup(items.map(toOrderRequestExchangeableItemOptionModel));
};

/**
 * 주문 교환신청 option schema > 주문 교환신청 option model convert
 */
export const toOrderRequestExchangeOptionModel = (
  item: OrderRequestExchangeOptionSchema,
): OrderRequestExchangeOptionModel => {
  return {
    ...item,
    exchangeableItemOptionList: toOrderRequestExchangeableItemOptionModelList(item.exchangeableItemOptionList),
  };
};

/**
 * 주문 반품신청 회수자정보 model > form field convert
 */
export const toOrderRequestExchangeFormField = (
  { name, phone, postCode, address, addressDetail }: OrderRequestReturnSenderModel,
  initialValues: OrderRequestExchangeFormField,
): OrderRequestExchangeFormField => {
  return {
    ...initialValues,
    returnSender: {
      name: name ?? '',
      phone: phone ?? '',
      postCode: postCode ?? '',
      address: address ?? '',
      addressDetail: addressDetail ?? '',
    },
  };
};
