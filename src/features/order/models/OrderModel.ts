import { pathConfig } from '@config';
import concat from 'lodash/concat';
import {
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  GoodsType,
  OrderExcelCode,
  OrderSearchFieldType,
  OrderStatusAfterExportOptions,
  OrderStatusBeforeExportOptions,
  OrderStatusExportableOptions,
} from '../constants';
import {
  OrderDetailCommonExportItemSchema,
  ExportItemTicketSchema,
  OrderDetailCommonItemOptionSchema,
  OrderDetailCommonOrderItemSchema,
  OrderDetailCommonRefundItemSchema,
  OrderDetailCommonReturnItemSchema,
  OrderDetailCommonSchema,
  OrderGoodsOptionSchema,
  OrderGoodsSchema,
  OrderItemOptionSchema,
  OrderItemOptionShippingSchema,
  OrderRequestReturnSenderSchema,
  OrderSchema,
} from '../schemas';
import { OrderExcelItem, OrderListQueryState, OrderListSearchParams, OrderSearchFormField } from '../types';
import { toDateFormat } from '../utils';
import { BrandComboModel } from './BrandModel';
import { ComboMDModel } from './CommonModel';
import { ProviderComboModel } from './ProviderModel';

/**
 * Order model
 */
export interface OrderModel extends OrderSchema {
  createdDateText: string;
  paymentDateText: string;
  rowKey: string;
}

/**
 * 주문 상품 option model
 */
export interface OrderGoodsOptionModel extends OrderGoodsOptionSchema {
  optionLabel: string;
  priceText: string;
  stockText: string;
  purchasableStockText: string;
}

/**
 * 주문 상품 model
 */
export interface OrderGoodsModel extends OrderGoodsSchema {
  option: OrderGoodsOptionModel;
}

/**
 * 주문 상세 공통 order item model
 */
export interface OrderDetailCommonOrderItemModel extends OrderDetailCommonOrderItemSchema {
  createdDateText: string;
  paymentDateText: string;
  amountText: string;
  totalShippingCostText: string;
  totalUsedCouponSaleText: string;
  usedPointText: string;
  hasZendeskTicketText: string;
  blacklistLabel: string;
}

/**
 * 주문 상세 공통 item option shipping model
 */
export interface OrderItemOptionShippingModel extends OrderItemOptionShippingSchema {
  costText: string;
  addCostText: string;
}

/**
 * 주문 상세 공통 item option model
 */
export interface OrderItemOptionModel extends OrderItemOptionSchema {
  goods: OrderGoodsModel;
  shipping: OrderItemOptionShippingModel;
  shippingRowspan: number | null;
  itemRowspan: number | null;
}

/**
 * 주문 상세 공통 item option model
 */
export interface OrderDetailCommonItemOptionModel extends OrderDetailCommonItemOptionSchema {
  itemOptionList: Array<OrderItemOptionModel>;
  totalPriceText: string;
  totalShippingCostText: string;
  totalUsedCouponSaleText: string;
  usedPointText: string;
  amountText: string;
}

/**
 * 출고 item ticket model
 */
export interface ExportItemTicketModel extends ExportItemTicketSchema {
  endDateText: string;
  startDateText: string;
  usedDateText: string;
}

/**
 * 주문 상세 공통 출고 item model
 */
export interface OrderDetailCommonExportItemModel extends Omit<OrderDetailCommonExportItemSchema, 'goods'> {
  exportedDateText: string;
  confirmDateText: string;
  inShippingDateText: string;
  shippingIngDateText: string;
  completeDateText: string;
  goods: OrderGoodsModel;
  idRowspan: number | null;
  rowKey: string;
  ticket: ExportItemTicketModel;
}

/**
 * 주문 상세 공통 반품 item model
 */
export interface OrderDetailCommonReturnItemModel extends OrderDetailCommonReturnItemSchema {
  createdDateText: string;
  completedDateText: string;
  goods: OrderGoodsModel;
  idRowspan: number | null;
  rowKey: string;
}

/**
 * 주문 상세 공통 환불 item model
 */
export interface OrderDetailCommonRefundItemModel extends OrderDetailCommonRefundItemSchema {
  createdDateText: string;
  refundPriceText: string;
  refundPointText: string;
  completedDateText: string;
  goods: OrderGoodsModel;
  idRowspan: number | null;
  rowKey: string;
}

/**
 * 주문 상세 공통 출고 리스트 model
 */
export interface OrderDetailCommonExportListModal {
  real: Array<OrderDetailCommonExportItemModel>;
  ticket: Array<OrderDetailCommonExportItemModel>;
}

/**
 * 주문 상세 공통 model
 */
export interface OrderDetailCommonModel extends Omit<OrderDetailCommonSchema, 'exportList'> {
  order: OrderDetailCommonOrderItemModel;
  itemOption: OrderDetailCommonItemOptionModel;
  exportItem: OrderDetailCommonExportListModal;
  returnList: Array<OrderDetailCommonReturnItemModel>;
  refundList: Array<OrderDetailCommonRefundItemModel>;
}

/**
 * 주문 반품신청 회수자정보 model
 */
export interface OrderRequestReturnSenderModel extends OrderRequestReturnSenderSchema {}

/**
 * OrderSchema > OrderModel convert
 */
export const toOrderModel = (item: OrderSchema, isManager: boolean): OrderModel => {
  return {
    ...item,
    createdDateText: toDateFormat(item.createdDate),
    paymentDateText: toDateFormat(item.paymentDate),
    rowKey: isManager ? item.orderId.toString() : `${item.orderId.toString()}_${item.itemId}_${item.orderStatus.step}`,
  };
};

/**
 * OrderSchema list > OrderModel list convert
 */
export const toOrderModelList = (items: Array<OrderSchema>, isManager: boolean): Array<OrderModel> => {
  return items.map((item) => toOrderModel(item, isManager));
};

/**
 * order step에 해당되는 order step 선택 배열 리턴
 */
export const toOrderStepSelectList = (orderStepListString: string = '', isPrepare?: boolean) => {
  const orderStatusList = isPrepare
    ? OrderStatusExportableOptions
    : concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions);
  const orderSteps = orderStepListString.split(',');

  return orderStatusList.map((item) => orderSteps.includes(item));
};

/**
 * order step 선택 배열에 해당하는 order step value 배열 리턴
 */
export const toOrderStepValueList = (orderStepList: Array<boolean>, isPrepare?: boolean) => {
  const orderStatusList = isPrepare
    ? OrderStatusExportableOptions
    : concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions);
  return orderStepList.map((item, index) => (item ? orderStatusList[index] : null)).filter((item) => !!item);
};

/**
 * order step 선택 배열에 해당하는 status 리턴
 */
export const toOrderStepStatus = (orderStepList: Array<boolean>, isPrepare?: boolean) => {
  const orderStatusAllList = isPrepare
    ? OrderStatusExportableOptions
    : concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions);
  const orderStepValueList = orderStepList
    .map((item, index) => (item ? orderStatusAllList[index] : null))
    .filter((item) => !!item);

  // 주문 출고가능하지 않은 주문상태 count
  const nonExportableStatusCount = orderStepValueList.filter(
    (status) => !OrderStatusExportableOptions.includes(status),
  ).length;

  switch (orderStepValueList.length) {
    case orderStatusAllList.length:
      return 'ALL';
    case 1:
      return orderStepValueList[0];

    default:
      if (nonExportableStatusCount === 0) {
        return 'EXPORTABLE';
      }
      return 'IGNORE';
  }
};

/**
 * order query state > form field convert
 */
export const toOrderSearchFormFieldByQueryState = (
  item: OrderListQueryState,
  defaultFormValues: OrderSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
  brandCombo: Array<BrandComboModel>,
  isPrepare?: boolean,
): OrderSearchFormField => {
  return {
    fromDate: item.fromDate
      ? item.fromDate === 'ALL'
        ? null
        : toDateFormat(Number(item.fromDate))
      : defaultFormValues.fromDate,
    goodsType: item.goodsType || defaultFormValues.goodsType,
    keyword: item.keyword || defaultFormValues.keyword,
    orderStepList: item.orderStepList
      ? toOrderStepSelectList(item.orderStepList, isPrepare)
      : defaultFormValues.orderStepList,
    searchType: item.searchType || defaultFormValues.searchType,
    toDate: item.toDate ? (item.toDate === 'ALL' ? null : toDateFormat(Number(item.toDate))) : defaultFormValues.toDate,
    shippingMethod: item.shippingMethod || defaultFormValues.shippingMethod,
    provider:
      item.providerId && providerCombo
        ? providerCombo.find((provider) => provider.value === Number(item.providerId))
        : defaultFormValues.provider,
    md: item.mdId && mdCombo ? mdCombo.find((md) => md.value === Number(item.mdId)) : defaultFormValues.md,
    brand:
      item.brandId && brandCombo
        ? brandCombo.find((brand) => brand.value === Number(item.brandId))
        : defaultFormValues.brand,
  };
};

/**
 * order query state > search params convert
 */
export const toOrderSearchParamsByQueryState = (
  item: OrderListQueryState,
  defaultFormValues: OrderSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
  brandCombo: Array<BrandComboModel>,
  isPrepare?: boolean,
): OrderListSearchParams => {
  const formFiled = toOrderSearchFormFieldByQueryState(
    item,
    defaultFormValues,
    providerCombo,
    mdCombo,
    brandCombo,
    isPrepare,
  );
  return {
    page: item.page || OrderDefaultSearchPage,
    size: item.size || OrderDefaultSearchSize,
    fromDate: formFiled.fromDate ? new Date(formFiled.fromDate).getTime() : null,
    goodsType: formFiled.goodsType as GoodsType,
    keyword: formFiled.keyword || '',
    orderStepList: toOrderStepValueList(formFiled.orderStepList, isPrepare),
    searchType: formFiled.searchType as OrderSearchFieldType,
    toDate: formFiled.toDate ? new Date(formFiled.toDate).getTime() : null,
    shippingMethod: formFiled.shippingMethod || '',
    providerId: formFiled.provider?.value ? String(formFiled.provider.value) : '',
    mdId: formFiled.md?.value ? String(formFiled.md.value) : '',
    time: item.time,
    brandId: formFiled.brand?.value ? String(formFiled.brand.value) : '',
    ...(isPrepare && { availableForExport: 'Y' }),
  };
};

/**
 * order form field > query state convert
 */
export const toOrderQueryStateBySearchFormField = (
  item: OrderSearchFormField,
  currentQueryState?: OrderListQueryState,
  isPrepare?: boolean,
): OrderListQueryState => {
  return {
    ...currentQueryState,
    fromDate: item.fromDate ? new Date(item.fromDate).getTime().toString() : 'ALL',
    goodsType: item.goodsType,
    keyword: item.keyword || '',
    orderStepList: toOrderStepValueList(item.orderStepList, isPrepare).join(','),
    searchType: item.searchType,
    toDate: item.toDate ? new Date(item.toDate).getTime().toString() : 'ALL',
    shippingMethod: item.shippingMethod || '',
    providerId: item.provider?.value ? String(item.provider.value) : '',
    mdId: item.md?.value ? String(item.md.value) : '',
    brandId: item.brand?.value ? String(item.brand.value) : '',
  };
};

/**
 * order detail common order item schema > order detail common order item model convert
 */
export const toOrderDetailCommonOrderItemModel = (
  item: OrderDetailCommonOrderItemSchema,
): OrderDetailCommonOrderItemModel => {
  return {
    ...item,
    createdDateText: toDateFormat(item.createdDate),
    paymentDateText: toDateFormat(item.createdDate),
    amountText: item.amount ? item.amount.toLocaleString() : '0',
    totalShippingCostText: item.totalShippingCost ? item.totalShippingCost.toLocaleString() : '0',
    totalUsedCouponSaleText: item.totalUsedCouponSale ? item.totalUsedCouponSale.toLocaleString() : '0',
    usedPointText: item.usedPoint ? item.usedPoint.toLocaleString() : '0',
    hasZendeskTicketText: item.hasZendeskTicket ? '등록됨' : '-',
    blacklistLabel: item.isBlack ? 'Y' : 'N',
  };
};

/**
 * order detail common order item option schema > order detail common order item option model convert
 */
export const toOrderItemOptionModel = (item: OrderItemOptionSchema): OrderItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    shipping: {
      ...item.shipping,
      costText: item.shipping.cost.toLocaleString(),
      addCostText: item.shipping.addCost.toLocaleString(),
    },
    shippingRowspan: null,
    itemRowspan: null,
  };
};

/**
 * 배송그룹 count 조회
 */
const getShippingGroupCount = (items: Array<OrderItemOptionModel>, shippingId: number): number => {
  return items.filter((item) => item.shipping.id === shippingId).length;
};

/**
 * item 그룹 count 조회
 */
const getItemGroupCount = (items: Array<OrderItemOptionModel>, itemId: number): number => {
  return items.filter((item) => item.itemId === itemId).length;
};

/**
 * 배송그룹 rowspan 처리를 위한 shippingRowspan 설정
 */
export const convertShippingGroup = (items: Array<OrderItemOptionModel>): Array<OrderItemOptionModel> => {
  return items.reduce<{
    shippingId: number | null;
    itemId: number | null;
    itemOptionList: Array<OrderItemOptionModel>;
  }>(
    ({ shippingId, itemId, itemOptionList }, item, index) => {
      if (shippingId !== item.shipping.id && itemId !== item.itemId) {
        itemOptionList.push({
          ...item,
          shippingRowspan: getShippingGroupCount(items, item.shipping.id),
          itemRowspan: getItemGroupCount(items, item.itemId),
        });
        return {
          shippingId: item.shipping.id,
          itemId: item.itemId,
          itemOptionList,
        };
      } else if (shippingId !== item.shipping.id) {
        itemOptionList.push({
          ...item,
          shippingRowspan: getShippingGroupCount(items, item.shipping.id),
        });
        return {
          shippingId: item.shipping.id,
          itemId,
          itemOptionList,
        };
      } else if (itemId !== item.itemId) {
        itemOptionList.push({
          ...item,
          itemRowspan: getItemGroupCount(items, item.itemId),
        });
        return {
          shippingId,
          itemId: item.itemId,
          itemOptionList,
        };
      } else {
        itemOptionList.push({
          ...item,
          shippingRowspan: 0,
          itemRowspan: 0,
        });
        return {
          shippingId,
          itemId,
          itemOptionList,
        };
      }
    },
    { shippingId: null, itemId: null, itemOptionList: [] },
  ).itemOptionList;
};

/**
 * order detail common order item option list schema > order detail common order item option list model convert
 */
export const toOrderItemOptionModelList = (items: Array<OrderItemOptionSchema>): Array<OrderItemOptionModel> => {
  return convertShippingGroup(items.map(toOrderItemOptionModel));
};

/**
 * order detail common item option schema > order detail common item option model convert
 */
export const toOrderDetailCommonItemOptionModel = (
  item: OrderDetailCommonItemOptionSchema,
): OrderDetailCommonItemOptionModel => {
  return {
    ...item,
    itemOptionList: toOrderItemOptionModelList(item.itemOptionList),
    totalPriceText: item.totalPrice ? item.totalPrice.toLocaleString() : '0',
    totalShippingCostText: item.totalShippingCost ? item.totalShippingCost.toLocaleString() : '0',
    totalUsedCouponSaleText: item.totalUsedCouponSale ? item.totalUsedCouponSale.toLocaleString() : '0',
    usedPointText: item.usedPoint ? item.usedPoint.toLocaleString() : '0',
    amountText: item.amount ? item.amount.toLocaleString() : '0',
  };
};

/**
 * id그룹 count 조회
 */
const getExportIDGroupCount = (items: Array<OrderDetailCommonExportItemModel>, id: number): number => {
  return items.filter((item) => item.id === id).length;
};

/**
 * id그룹 rowspan 처리를 위한 shippingRowspan 설정
 */
export const convertExportIDGroup = (
  items: Array<OrderDetailCommonExportItemModel>,
): Array<OrderDetailCommonExportItemModel> => {
  return items.reduce<{ id: number | null; exportList: Array<OrderDetailCommonExportItemModel> }>(
    ({ id, exportList }, item, index) => {
      if (id !== item.id) {
        exportList.push({
          ...item,
          idRowspan: getExportIDGroupCount(items, item.id),
        });
        return {
          id: item.id,
          exportList,
        };
      } else {
        exportList.push({
          ...item,
          idRowspan: 0,
        });
        return {
          id,
          exportList,
        };
      }
    },
    { id: null, exportList: [] },
  ).exportList;
};

/**
 * order goods option schema > order goods option model convert
 */
export const toOrderGoodsOptionModel = (item: OrderGoodsOptionSchema): OrderGoodsOptionModel => {
  return {
    ...item,
    optionLabel:
      (item.itemList || []).length > 0
        ? item.itemList
            .map((option) => {
              return `${option.title}: ${option.value}`;
            })
            .join(', ')
        : '-',
    priceText: item.price.toLocaleString(),
    stockText: item.stock.toLocaleString(),
    purchasableStockText: item.purchasableStock.toLocaleString(),
  };
};

/**
 * order goods schema > order goods model convert
 */
export const toOrderGoodsModel = (item: OrderGoodsSchema): OrderGoodsModel => {
  return {
    ...item,
    primaryImage: item.primaryImage
      ? {
          ...item.primaryImage,
          path: `${pathConfig.cdnUrl}/${item.primaryImage.path}?im=Resize,width=192`,
        }
      : null,
    option: toOrderGoodsOptionModel(item.option),
  };
};

/**
 * export item ticket schema > export item ticket model convert
 */
export const toExportItemTicketModal = (item: ExportItemTicketSchema): ExportItemTicketModel => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    endDateText: item.endDate ? toDateFormat(item.endDate) : '-',
    startDateText: item.startDate ? toDateFormat(item.startDate) : '-',
    usedDateText: item.usedDate ? toDateFormat(item.usedDate) : '-',
  };
};

/**
 * order detail common export item schema > order detail common export item model convert
 */
export const toOrderDetailCommonExportItemModel = (
  item: OrderDetailCommonExportItemSchema,
  index: number,
): OrderDetailCommonExportItemModel => {
  return {
    ...item,
    exportedDateText: item.exportedDate ? toDateFormat(item.exportedDate) : '-',
    confirmDateText: item.confirmDate ? toDateFormat(item.confirmDate) : '-',
    inShippingDateText: item.inShippingDate ? toDateFormat(item.inShippingDate) : '-',
    shippingIngDateText: item.shippingIngDate ? toDateFormat(item.shippingIngDate) : '-',
    completeDateText: item.completeDate ? toDateFormat(item.completeDate) : '-',
    goods: toOrderGoodsModel(item.goods),
    idRowspan: null,
    rowKey: `${item.id}_${index}`,
    ticket: toExportItemTicketModal(item.ticket),
  };
};

/**
 * order detail common export item list schema > order detail common export item model list convert
 */
export const toOrderDetailCommonExportItemModelList = (
  items: Array<OrderDetailCommonExportItemSchema>,
): Array<OrderDetailCommonExportItemModel> => {
  return convertExportIDGroup(items.map(toOrderDetailCommonExportItemModel));
};

/**
 * 반품/교환 id그룹 count 조회
 */
const getReturnIDGroupCount = (items: Array<OrderDetailCommonReturnItemModel>, id: number): number => {
  return items.filter((item) => item.id === id).length;
};

/**
 * 반품/교환 id그룹 rowspan 처리를 위한 shippingRowspan 설정
 */
export const convertReturnIDGroup = (
  items: Array<OrderDetailCommonReturnItemModel>,
): Array<OrderDetailCommonReturnItemModel> => {
  return items.reduce<{ id: number | null; returnList: Array<OrderDetailCommonReturnItemModel> }>(
    ({ id, returnList }, item, index) => {
      if (id !== item.id) {
        returnList.push({
          ...item,
          idRowspan: getReturnIDGroupCount(items, item.id),
        });
        return {
          id: item.id,
          returnList,
        };
      } else {
        returnList.push({
          ...item,
          idRowspan: 0,
        });
        return {
          id,
          returnList,
        };
      }
    },
    { id: null, returnList: [] },
  ).returnList;
};

/**
 * order detail common return item schema > order detail common return item model convert
 */
export const toOrderDetailCommonReturnItemModel = (
  item: OrderDetailCommonReturnItemSchema,
  index: number,
): OrderDetailCommonReturnItemModel => {
  return {
    ...item,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '-',
    completedDateText: item.completedDate ? toDateFormat(item.completedDate) : '-',
    goods: toOrderGoodsModel(item.goods),
    idRowspan: null,
    rowKey: `${item.id}_${item.packageGroupId}_${index}`,
  };
};

/**
 * order detail common return item list schema > order detail common return item model list convert
 */
export const toOrderDetailCommonReturnItemModelList = (
  items: Array<OrderDetailCommonReturnItemSchema>,
): Array<OrderDetailCommonReturnItemModel> => {
  return convertReturnIDGroup(items.map(toOrderDetailCommonReturnItemModel));
};

/**
 * 반품/교환 id그룹 count 조회
 */
const getRefundIDGroupCount = (items: Array<OrderDetailCommonRefundItemModel>, id: number): number => {
  return items.filter((item) => item.id === id).length;
};

/**
 * 반품/교환 id그룹 rowspan 처리를 위한 shippingRowspan 설정
 */
export const convertRefundIDGroup = (
  items: Array<OrderDetailCommonRefundItemModel>,
): Array<OrderDetailCommonRefundItemModel> => {
  return items.reduce<{ id: number | null; refundList: Array<OrderDetailCommonRefundItemModel> }>(
    ({ id, refundList }, item, index) => {
      if (id !== item.id) {
        refundList.push({
          ...item,
          idRowspan: getRefundIDGroupCount(items, item.id),
        });
        return {
          id: item.id,
          refundList,
        };
      } else {
        refundList.push({
          ...item,
          idRowspan: 0,
        });
        return {
          id,
          refundList,
        };
      }
    },
    { id: null, refundList: [] },
  ).refundList;
};

/**
 * order detail common refund item schema > order detail common refund item model convert
 */
export const toOrderDetailCommonRefundItemModel = (
  item: OrderDetailCommonRefundItemSchema,
): OrderDetailCommonRefundItemModel => {
  return {
    ...item,
    actorName: item.actorName ?? '-',
    createdDateText: toDateFormat(item.createdDate),
    refundPriceText: item.refundPrice.toLocaleString(),
    refundPointText: item.refundPoint ? item.refundPoint.toLocaleString() : '-',
    completedDateText: item.completedDate ? toDateFormat(item.completedDate) : '-',
    goods: toOrderGoodsModel(item.goods),
    idRowspan: null,
    rowKey: `${item.id}_${item.packageGroupId}_${item.goods.id}_${item.goods.option.id}`,
  };
};

/**
 * order detail common refund item list schema > order detail common refund item model list convert
 */
export const toOrderDetailCommonRefundItemModelList = (
  items: Array<OrderDetailCommonRefundItemSchema>,
): Array<OrderDetailCommonRefundItemModel> => {
  return convertRefundIDGroup(items.map(toOrderDetailCommonRefundItemModel));
};

/**
 * order detail common schema > order detail common model convert
 */
export const toOrderDetailCommonModel = (item: OrderDetailCommonSchema): OrderDetailCommonModel => {
  const exportList = toOrderDetailCommonExportItemModelList(item.exportList);
  return {
    order: toOrderDetailCommonOrderItemModel(item.order),
    itemOption: toOrderDetailCommonItemOptionModel(item.itemOption),
    exportItem: {
      real: exportList.filter((item) => item.ticket === null),
      ticket: exportList.filter((item) => item.ticket !== null),
    },
    returnList: toOrderDetailCommonReturnItemModelList(item.returnList),
    refundList: toOrderDetailCommonRefundItemModelList(item.refundList),
  };
};

/**
 * 주문 item schema > 주문 excel item convert
 */
export const toOrderExcelItem = (item: OrderSchema, isManager: boolean, index: number): OrderExcelItem => {
  const convertItem = toOrderModel(item, isManager);
  const excelKeys = Object.keys(OrderExcelCode);
  const exportItem = excelKeys.reduce<OrderExcelItem>((target, key) => {
    switch (key) {
      case 'paymentTypeName':
        target[key] = convertItem.paymentType.name ?? '';
        return target;
      case 'orderStatus':
        target[key] = convertItem.orderStatus.name ?? '';
        return target;
      case 'paymentDate':
        target[key] = convertItem.paymentDateText ?? '';
        return target;
      case 'amount':
        target[key] = typeof convertItem[key] === 'number' ? Number(convertItem[key]).toLocaleString() : '';
        return target;
    }

    target[key] = convertItem[key] ? String(convertItem[key]) : '';
    return target;
  }, {} as OrderExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 item list schema > 주문 excel item list convert
 */
export const toOrderExcelItems = (items: Array<OrderSchema>, isManager: boolean): Array<OrderExcelItem> => {
  return items.map((item, index) => toOrderExcelItem(item, isManager, index));
};
