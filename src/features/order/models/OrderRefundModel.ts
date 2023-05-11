import { TOption } from '@components/Select';
import {
  OrderGoodsModel,
  OrderGoodsOptionModel,
  OrderItemOptionShippingModel,
  ProviderComboModel,
  toOrderGoodsModel,
  toOrderGoodsOptionModel,
} from '.';
import {
  RefundStatusOptions,
  OrderSearchFieldType,
  OrderPaymentType,
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  OrderSearchRefundType,
  OrderRefundExcelCode,
} from '../constants';
import {
  OrderRequestRefundableItemOptionSchema,
  OrderRequestRefundOptionSchema,
  OrderRefundReasonItemSchema,
  OrderRefundReasonItemListSchema,
  OrderRefundListItemSchema,
  OrderRefundDetailItemSchema,
  OrderRefundItemOptionSchema,
  OrderRefundAccountInfoSchema,
  OrderRefundBankInfoSchema,
  OrderRefundPriceInfoItemOptionSchema,
  OrderRefundPriceInfoSchema,
  RefundStatusInfoSchema,
  RefundMethodInfoSchema,
  OrderRefundPriceSchema,
  OrderRefundStatusSchema,
} from '../schemas';
import {
  OrderRefundSearchFormField,
  OrderRefundListQueryState,
  OrderRefundListSearchParams,
  OrderRefundExcelItem,
} from '../types';
import { toDateFormat } from '../utils';

/**
 * 주문 취소요청 가능 item option model
 */
export interface OrderRequestRefundableItemOptionModel extends OrderRequestRefundableItemOptionSchema {
  goods: OrderGoodsModel;
  key: string;
  packageOption: OrderGoodsOptionModel;
  shipping: OrderItemOptionShippingModel;
  providerRowspan: number | null;
  shippingRowspan: number | null;
}

/**
 * 주문 취소요청 옵션 model
 */
export interface OrderRequestRefundOptionModel extends OrderRequestRefundOptionSchema {
  refundableItemOptionList: Array<OrderRequestRefundableItemOptionModel>;
}

/**
 * 주문 취소사유 item model
 */
export interface OrderRefundReasonItemModel {
  label: string;
  value: string;
}

/**
 * 주문 취소사유 item list model
 */
export type OrderRefundReasonItemListModel = Array<OrderRefundReasonItemModel>;

/**
 * 주문 환불리스트 item model
 */
export interface OrderRefundListItemModel extends OrderRefundListItemSchema {
  createdDateText: string;
  completedDateText: string;
  refundPriceText: string;
}

/**
 * 주문 환불 상세 item option model
 */
export interface OrderRefundItemOptionModel extends OrderRefundItemOptionSchema {
  goods: OrderGoodsModel;
  createdDateText: string;
  completedDateText: string;
  actorName: string;
  statusName: string;
  returnStatusName: string;
  refundReasonName: string;
  refundReasonText: string;
  rowKey: string;
}

export interface OrderRefundAccountInfoModel extends OrderRefundAccountInfoSchema {}

/**
 * 주문 환불 상세 item model
 */
export interface OrderRefundDetailItemModel extends OrderRefundDetailItemSchema {
  itemOptionList: Array<OrderRefundItemOptionModel>;
  userRefundAccount: OrderRefundAccountInfoModel;
  refundBankInfo: OrderRefundAccountInfoModel;
}

/**
 * 주문 환불 은행정보 model
 */
export interface OrderRefundBankInfoModel {
  userRefundAccount: OrderRefundAccountInfoModel;
  refundBankInfo: OrderRefundAccountInfoModel;
}

/**
 * 주문 환불처리 금액정보 item option model
 */
export interface OrderRefundPriceInfoItemOptionModel extends OrderRefundPriceInfoItemOptionSchema {
  goods: OrderGoodsModel;
  refundGoodsPriceText: string;
  usedCouponPriceText: string;
  totalUsedCouponPriceText: string;
  shippingCostText: string;
  orderShippingCostText: string;
  orderAddShippingCostText: string;
  returnShippingCostText: string;
  returnAddShippingCostText: string;
  refundPointText: string;
  usedCartCouponPriceText: string;
  tempShippingCostText: string;
  providerRowspan: number | null;
  shippingRowspan: number | null;
  goodsOptionRowSpan: number | null;
  rowspan: number | null;
  shippingIndex: number;
  rowKey: string;
}

/**
 * 주문 환불처리 금액정보 model
 */
export interface OrderRefundPriceInfoModel
  extends Omit<OrderRefundPriceInfoSchema, 'changeableStatusList' | 'refundableMethods'> {
  changeableStatusList: Array<TOption>;
  refundItemOptionList: Array<OrderRefundPriceInfoItemOptionModel>;
  refundPriceText: string;
  refundPointText: string;
  usedCartCouponPriceText: string;
  refundableMethods: Array<TOption>;
  totalRefundGoodsPriceText: string;
  totalUsedCouponPriceText: string;
  totalRefundShippingCostText: string;
}

/**
 * 주문 환불 금액 계산 model
 */
export interface OrderRefundPriceModel extends Omit<OrderRefundPriceSchema, 'refundableMethods'> {
  refundPriceText: string;
  refundPointText: string;
  refundableMethods: Array<TOption>;
  totalRefundGoodsPriceText: string;
  totalRefundShippingCostText: string;
  totalUsedCouponPriceText: string;
}

/**
 * 주문 환불 상태변경 model
 */
export interface OrderRefundStatusModel extends OrderRefundStatusSchema {}

// --------------------------------- convert --------------------------------- //

/**
 * order request refundable item option schema > order request refundable item option model convert
 */
export const toOrderRequestRefundableItemOptionModel = (
  item: OrderRequestRefundableItemOptionSchema,
): OrderRequestRefundableItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    key: `${item.id}_${item.goods.option.id}`,
    packageOption: item.packageOption ? toOrderGoodsOptionModel(item.packageOption) : null,
    shipping: {
      ...item.shipping,
      costText: item.shipping.cost.toLocaleString(),
      addCostText: item.shipping.addCost.toLocaleString(),
    },
    providerRowspan: null,
    shippingRowspan: null,
  };
};

/**
 * 입접사그룹 rowspan 처리를 위한 rowspan 설정
 */
export const convertProviderGroup = (
  items: Array<OrderRequestRefundableItemOptionModel>,
): Array<OrderRequestRefundableItemOptionModel> => {
  /**
   * 입점사그룹 count 조회
   */
  const getProviderGroupCount = (items: Array<OrderRequestRefundableItemOptionModel>, providerId: number): number => {
    return items.filter((item) => item.provider.id === providerId).length;
  };

  /**
   * 배송그룹 count 조회
   */
  const getShippingGroupCount = (items: Array<OrderRequestRefundableItemOptionModel>, shippingId: number): number => {
    return items.filter((item) => item.shipping.id === shippingId).length;
  };

  return items.reduce<{
    shippingId: number | null;
    providerId: number | null;
    refundableItemOptionList: Array<OrderRequestRefundableItemOptionModel>;
  }>(
    ({ shippingId, providerId, refundableItemOptionList }, item, index) => {
      if (providerId !== item.provider.id && shippingId !== item.shipping.id) {
        refundableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
          shippingRowspan: getShippingGroupCount(items, item.shipping.id),
        });
        return {
          shippingId: item.shipping.id,
          providerId: item.provider.id,
          refundableItemOptionList,
        };
      } else if (providerId !== item.provider.id) {
        refundableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
        });
        return {
          shippingId,
          providerId: item.provider.id,
          refundableItemOptionList,
        };
      } else if (shippingId !== item.shipping.id) {
        refundableItemOptionList.push({
          ...item,
          shippingRowspan: getShippingGroupCount(items, item.shipping.id),
        });
        return {
          shippingId: item.shipping.id,
          providerId,
          refundableItemOptionList,
        };
      } else {
        refundableItemOptionList.push({
          ...item,
          providerRowspan: 0,
        });
        return {
          providerId,
          shippingId,
          refundableItemOptionList,
        };
      }
    },
    { shippingId: null, providerId: null, refundableItemOptionList: [] },
  ).refundableItemOptionList;
};

/**
 * order request refundable item option list schema > order request refundable item option list model convert
 */
export const toOrderRequestRefundableItemOptionModelList = (
  items: Array<OrderRequestRefundableItemOptionSchema>,
): Array<OrderRequestRefundableItemOptionModel> => {
  return convertProviderGroup(items.map(toOrderRequestRefundableItemOptionModel));
};

/**
 * order request refund option schema > order request refund option model convert
 */
export const toOrderRequestRefundOptionModel = (
  item: OrderRequestRefundOptionSchema,
): OrderRequestRefundOptionModel => {
  return {
    ...item,
    refundableItemOptionList: toOrderRequestRefundableItemOptionModelList(item.refundableItemOptionList),
  };
};

/**
 * 주문 취소사유 item schema > 주문 취소사유 item model convert
 */
export const toOrderRefundReasonItemModel = (item: OrderRefundReasonItemSchema): OrderRefundReasonItemModel => {
  return {
    label: item.text,
    value: item.code,
  };
};

/**
 * 주문 취소사유 item list schema > 주문 취소사유 item list model convert
 */
export const toOrderRefundReasonItemListModel = (
  items: OrderRefundReasonItemListSchema,
): OrderRefundReasonItemListModel => {
  return items.map(toOrderRefundReasonItemModel);
};

/**
 * 주문 환불리스트 item schema > 주문 환불리스트 item model convert
 */
export const toOrderRefundListItemModel = (item: OrderRefundListItemSchema): OrderRefundListItemModel => {
  return {
    ...item,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '',
    completedDateText: item.completedDate ? toDateFormat(item.completedDate) : '',
    refundPriceText: item.refundPrice ? item.refundPrice.toLocaleString() : '',
  };
};

/**
 * 주문 환불리스트 schema > 주문 환불리스트 model convert
 */
export const toOrderRefundListModel = (items: Array<OrderRefundListItemSchema>): Array<OrderRefundListItemModel> => {
  return items.map(toOrderRefundListItemModel);
};

/**
 * refund status 해당되는 refund status 선택 배열 리턴
 */
export const toRefundStatusSelectList = (exportStatusListString: string = '') => {
  const exportStatuses = exportStatusListString.split(',');

  return RefundStatusOptions.map((item) => exportStatuses.includes(item));
};

/**
 * refund status 선택 배열에 해당하는 refund status value 배열 리턴
 */
export const toRefundStatusValueList = (exportStatusList: Array<boolean>) => {
  return exportStatusList.map((item, index) => (item ? RefundStatusOptions[index] : null)).filter((item) => !!item);
};

/**
 * order refund query state > form field convert
 */
export const toOrderRefundSearchFormFieldByQueryState = (
  item: OrderRefundListQueryState,
  defaultFormValues: OrderRefundSearchFormField,
  providerCombo: Array<ProviderComboModel>,
): OrderRefundSearchFormField => {
  return {
    fromDate: item.fromDate
      ? item.fromDate === 'ALL'
        ? null
        : toDateFormat(Number(item.fromDate))
      : defaultFormValues.fromDate,
    provider:
      item.providerId && providerCombo
        ? providerCombo.find((provider) => provider.value === Number(item.providerId))
        : defaultFormValues.provider,
    keyword: item.keyword || defaultFormValues.keyword,
    refundStatusList: item.refundStatusList
      ? toRefundStatusSelectList(item.refundStatusList)
      : defaultFormValues.refundStatusList,
    searchType: item.searchType || defaultFormValues.searchType,
    refundType: item.refundType || defaultFormValues.refundType,
    toDate: item.toDate ? (item.toDate === 'ALL' ? null : toDateFormat(Number(item.toDate))) : defaultFormValues.toDate,
  };
};

/**
 * order refund query state > search params convert
 */
export const toOrderRefundSearchParamsByQueryState = (
  item: OrderRefundListQueryState,
  defaultFormValues: OrderRefundSearchFormField,
  providerCombo: Array<ProviderComboModel>,
): OrderRefundListSearchParams => {
  const formFiled = toOrderRefundSearchFormFieldByQueryState(item, defaultFormValues, providerCombo);

  return {
    page: item.page || OrderDefaultSearchPage,
    size: item.size || OrderDefaultSearchSize,
    fromDate: formFiled.fromDate ? new Date(formFiled.fromDate).getTime() : null,
    providerId: formFiled.provider?.value ? String(formFiled.provider.value) : '',
    keyword: formFiled.keyword || '',
    refundStatusList: toRefundStatusValueList(formFiled.refundStatusList),
    searchType: formFiled.searchType as OrderSearchFieldType,
    refundType: formFiled.refundType as OrderSearchRefundType,
    toDate: formFiled.toDate ? new Date(formFiled.toDate).getTime() : null,
    time: item.time,
  };
};

/**
 * order refund form field > query state convert
 */
export const toOrderRefundQueryStateBySearchFormField = (
  item: OrderRefundSearchFormField,
  currentQueryState?: OrderRefundListQueryState,
): OrderRefundListQueryState => {
  return {
    ...currentQueryState,
    fromDate: item.fromDate ? new Date(item.fromDate).getTime().toString() : 'ALL',
    providerId: item.provider?.value ? String(item.provider.value) : '',
    keyword: item.keyword || '',
    refundStatusList: toRefundStatusValueList(item.refundStatusList).join(','),
    searchType: item.searchType,
    refundType: item.refundType,
    toDate: item.toDate ? new Date(item.toDate).getTime().toString() : 'ALL',
  };
};

/**
 * 주문 환불 상세 item option schema > 주문 환불 상세 item option model convert
 */
export const toOrderRefundDetailItemOptionModel = (
  item: OrderRefundItemOptionSchema,
  refundItem: OrderRefundDetailItemSchema,
): OrderRefundItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    createdDateText: toDateFormat(refundItem.createdDate, 'yyyy/MM/dd HH:mm', '-'),
    completedDateText: toDateFormat(refundItem.completedDate, 'yyyy/MM/dd HH:mm', '-'),
    actorName: refundItem.actorName ?? '-',
    statusName: refundItem.status.name,
    returnStatusName: refundItem.returnInfo ? refundItem.returnInfo.returnStatus.name : '',
    refundReasonName: refundItem.refundReason ? refundItem.refundReason.reason.name : '',
    refundReasonText: refundItem.refundReason ? refundItem.refundReason.reasonText : '',
    rowKey: `${refundItem.id}`,
  };
};

/**
 * 주문 환불 상세 item option list schema > 주문 환불 상세 item option list model convert
 */
export const toOrderRefundDetailItemOptionListModel = (
  items: Array<OrderRefundItemOptionSchema>,
  refundItem: OrderRefundDetailItemSchema,
): Array<OrderRefundItemOptionModel> => {
  return items.map((item) => toOrderRefundDetailItemOptionModel(item, refundItem));
};

/**
 * 주문 환불 상세 item schema > 주문 환불 상세 item model convert
 */
export const toOrderRefundDetailItemModel = (item: OrderRefundDetailItemSchema): OrderRefundDetailItemModel => {
  return {
    ...item,
    itemOptionList: toOrderRefundDetailItemOptionListModel(item.itemOptionList, item),
  };
};

/**
 * 주문 환불 은행정보 schema > 주문 환불 은행정보 model convert
 */
export const toOrderRefundBankInfoModel = (item: OrderRefundBankInfoSchema): OrderRefundBankInfoModel => {
  return {
    userRefundAccount: item.userRefundAccount as OrderRefundAccountInfoModel,
    refundBankInfo: item.refundBankInfo as OrderRefundAccountInfoModel,
  };
};

/**
 * 주문 환불처리 금액정보 rowspan 설정
 */
export const convertGroupByRefundPriceInfo = (
  items: Array<OrderRefundPriceInfoItemOptionModel>,
): Array<OrderRefundPriceInfoItemOptionModel> => {
  /**
   * 입점사그룹 count 조회
   */
  const getProviderGroupCount = (items: Array<OrderRefundPriceInfoItemOptionModel>, providerId: number): number => {
    return items.filter((item) => item.provider.id === providerId).length;
  };

  /**
   * 배송그룹 count 조회
   */
  const getShippingGroupCount = (items: Array<OrderRefundPriceInfoItemOptionModel>, shippingId: number): number => {
    return items.filter((item) => item.shippingId === shippingId).length;
  };

  /**
   * 상품옵션 count 조회
   */
  const getGoodsOptionGroupCount = (
    items: Array<OrderRefundPriceInfoItemOptionModel>,
    goodsOptionId: number,
  ): number => {
    return items.filter((item) => item.goods.option.id === goodsOptionId).length;
  };

  return items.reduce<{
    shippingId: number | null;
    providerId: number | null;
    goodsOptionId: number | null;
    refundableItemOptionList: Array<OrderRefundPriceInfoItemOptionModel>;
  }>(
    ({ shippingId, providerId, goodsOptionId, refundableItemOptionList }, item, index) => {
      if (providerId !== item.provider.id || shippingId !== item.shippingId || goodsOptionId !== item.goods.option.id) {
        const itemOption = {
          ...item,
          providerRowspan: providerId !== item.provider.id ? getProviderGroupCount(items, item.provider.id) : null,
          shippingRowspan: shippingId !== item.shippingId ? getShippingGroupCount(items, item.shippingId) : null,
          goodsOptionRowSpan:
            goodsOptionId !== item.goods.option.id ? getGoodsOptionGroupCount(items, item.goods.option.id) : null,
        };

        if (shippingId !== item.shippingId) {
          itemOption.shippingIndex = index;
        }

        refundableItemOptionList.push(itemOption);
        return {
          shippingId: providerId !== item.provider.id ? item.shippingId : shippingId,
          providerId: providerId !== item.provider.id ? item.provider.id : providerId,
          goodsOptionId: goodsOptionId !== item.goods.option.id ? item.goods.option.id : goodsOptionId,
          refundableItemOptionList,
        };
      } else {
        refundableItemOptionList.push({
          ...item,
          providerRowspan: 0,
        });
        return {
          providerId,
          shippingId,
          goodsOptionId,
          refundableItemOptionList,
        };
      }
    },
    { shippingId: null, providerId: null, goodsOptionId: null, refundableItemOptionList: [] },
  ).refundableItemOptionList;
};

const toTOptionByStatus = (item: RefundStatusInfoSchema, refundStatus: string): TOption => {
  return {
    value: item.refundStatus,
    label: item.refundStatusText,
    readOnly: item.refundStatus === refundStatus,
  };
};

const toTOptionListByStatus = (items: Array<RefundStatusInfoSchema>, refundStatus: string): Array<TOption> => {
  return items.map((item) => toTOptionByStatus(item, refundStatus));
};

const toTOptionByMethod = (item: RefundMethodInfoSchema, refundMethod: OrderPaymentType): TOption => {
  return {
    value: item.refundMethod,
    label: item.refundMethodText,
    readOnly: item.refundMethod === refundMethod,
  };
};

const toTOptionListByMethod = (
  items: Array<RefundMethodInfoSchema>,
  refundMethod: OrderPaymentType,
): Array<TOption> => {
  return items.map((item) => toTOptionByMethod(item, refundMethod));
};

/**
 * 주문 환불처리 금액정보 item option schema > 주문 환불처리 금액정보 item option model convert
 */
export const toOrderRefundInfoItemOptionModel = (
  item: OrderRefundPriceInfoItemOptionSchema,
  index: number,
  refundPriceInfo: OrderRefundPriceInfoSchema,
): OrderRefundPriceInfoItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    refundGoodsPriceText: item.refundGoodsPrice?.toLocaleString() ?? '',
    usedCouponPriceText: item.usedCouponPrice?.toLocaleString() ?? '',
    totalUsedCouponPriceText: item.totalUsedCouponPrice?.toLocaleString() ?? '',
    shippingCostText: item.shippingCost?.toLocaleString() ?? '',
    orderShippingCostText: item.orderShippingCost?.toLocaleString() ?? '',
    orderAddShippingCostText: item.orderAddShippingCost?.toLocaleString() ?? '',
    returnShippingCostText: item.returnShippingCost?.toLocaleString() ?? '',
    returnAddShippingCostText: item.returnAddShippingCost?.toLocaleString() ?? '',
    tempShippingCostText: item.tempShippingCost !== null ? item.tempShippingCost.toLocaleString() : null,
    refundPointText: refundPriceInfo.refundPoint?.toLocaleString() ?? '',
    usedCartCouponPriceText: refundPriceInfo.usedCartCouponPrice?.toLocaleString() ?? '',
    providerRowspan: null,
    shippingRowspan: null,
    goodsOptionRowSpan: null,
    shippingIndex: null,
    rowspan: index === 0 ? refundPriceInfo.refundItemOptionList.length : null,
    rowKey: `${item.id}_${item.orderItemId}`,
  };
};

/**
 * 주문 환불처리 금액정보 item option schema list > 주문 환불처리 금액정보 item option model list convert
 */
export const toOrderRefundInfoItemOptionListModel = (
  items: Array<OrderRefundPriceInfoItemOptionSchema>,
  refundPriceInfo: OrderRefundPriceInfoSchema,
): Array<OrderRefundPriceInfoItemOptionModel> => {
  return convertGroupByRefundPriceInfo(
    items.map((item, index) => toOrderRefundInfoItemOptionModel(item, index, refundPriceInfo)),
  );
};

/**
 * 주문 환불처리 금액정보 schema >  주문 환불처리 금액정보 model convert
 */
export const toOrderRefundInfoModel = (item: OrderRefundPriceInfoSchema): OrderRefundPriceInfoModel => {
  return {
    ...item,
    changeableStatusList: toTOptionListByStatus(item.changeableStatusList, item.refundStatusInfo.refundStatus),
    refundItemOptionList: toOrderRefundInfoItemOptionListModel(item.refundItemOptionList, item),
    refundPriceText: item.refundPrice?.toLocaleString() ?? '',
    refundPointText: item.refundPoint?.toLocaleString() ?? '',
    refundableMethods: toTOptionListByMethod(item.refundableMethods, item.refundMethod),
    totalRefundGoodsPriceText: item.totalRefundGoodsPrice.toLocaleString() ?? '',
    totalRefundShippingCostText: (item.totalRefundShippingCost >= 0
      ? item.totalRefundShippingCost
      : item.totalRefundShippingCost * -1
    ).toLocaleString(),
    totalUsedCouponPriceText: item.totalUsedCouponPrice.toLocaleString() ?? '',
    usedCartCouponPriceText: item.usedCartCouponPrice.toLocaleString() ?? '',
  };
};

/**
 * 주문 환불처리 금액정보 schema >  주문 환불처리 금액정보 model convert
 */
export const toOrderRefundPriceModel = (item: OrderRefundPriceSchema): OrderRefundPriceModel => {
  return {
    ...item,
    refundPriceText: item.refundPrice?.toLocaleString() ?? '',
    refundPointText: item.refundPoint?.toLocaleString() ?? '',
    refundableMethods: toTOptionListByMethod(item.refundableMethods, item.refundMethod),
    totalRefundGoodsPriceText: item.totalRefundGoodsPrice.toLocaleString() ?? '',
    totalRefundShippingCostText: (item.totalRefundShippingCost >= 0
      ? item.totalRefundShippingCost
      : item.totalRefundShippingCost * -1
    ).toLocaleString(),
    totalUsedCouponPriceText: item.totalUsedCouponPrice.toLocaleString() ?? '',
  };
};

/**
 * 주문 환불 상태변경 schema > 주문 환불 상태변경 model convert
 */
export const toOrderRefundStatusModel = (item: OrderRefundStatusSchema): OrderRefundStatusModel => {
  return { ...item };
};

/**
 * 주문 환불 item schema > 환불 excel item convert
 */
export const toOrderRefundExcelItem = (item: OrderRefundListItemSchema, index: number): OrderRefundExcelItem => {
  const convertItem = toOrderRefundListItemModel(item);
  const excelKeys = Object.keys(OrderRefundExcelCode);
  const exportItem = excelKeys.reduce<OrderRefundExcelItem>((target, key) => {
    switch (key) {
      case 'paymentType':
        target[key] = convertItem.paymentType.name ?? '';
        return target;
      case 'type':
        target[key] = convertItem.type.name ?? '';
        return target;
      case 'refundMethod':
        target[key] = convertItem.refundMethod.name ?? '';
        return target;
      case 'status':
        target[key] = convertItem.status.name ?? '';
        return target;
      case 'completedDate':
        target[key] = convertItem.completedDateText ?? '';
        return target;
      case 'createdDate':
        target[key] = convertItem.createdDateText ?? '';
        return target;
      case 'refundPrice':
        target[key] =
          !!convertItem[key] && typeof convertItem[key] === 'number' ? Number(convertItem[key]).toLocaleString() : '';
        return target;
    }

    target[key] = convertItem[key] ? String(convertItem[key]) : '';
    return target;
  }, {} as OrderRefundExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 환불 item list schema > 환불 excel item list convert
 */
export const toOrderRefundExcelItems = (items: Array<OrderRefundListItemSchema>): Array<OrderRefundExcelItem> => {
  return items.map(toOrderRefundExcelItem);
};
