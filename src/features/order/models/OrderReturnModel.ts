import { TOption } from '@components/Select';
import {
  OrderGoodsModel,
  OrderGoodsOptionModel,
  OrderRequestReturnSenderModel,
  ProviderComboModel,
  toOrderGoodsModel,
  toOrderGoodsOptionModel,
} from '.';
import {
  ReturnStatusOptions,
  OrderSearchFieldType,
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  OrderSearchReturnType,
  OrderReturnExcelCode,
} from '../constants';
import {
  OrderRequestReturnableItemOptionSchema,
  OrderRequestReturnOptionSchema,
  OrderReturnReasonItemSchema,
  OrderReturnReasonItemListSchema,
  OrderReturnListItemSchema,
  OrderReturnDetailItemSchema,
  OrderReturnItemOptionSchema,
  OrderReturnItemOptionExchangeSchema,
  OrderReturnChangeInfoSchema,
  CodeInfo,
  OrderRequestReturnableItemOptionTicketSchema,
  OrderReturnExcelListItemSchema,
  OrderReturnDetailExportTicketInfoSchema,
} from '../schemas';
import {
  OrderReturnSearchFormField,
  OrderReturnListQueryState,
  OrderReturnListSearchParams,
  OrderReturnDetailFormField,
  OrderRequestReturnFormField,
  OrderReturnExcelItem,
} from '../types';
import { toDateFormat } from '../utils';

/**
 * 주문 반품사유 item model
 */
export interface OrderReturnReasonItemModel {
  label: string;
  value: string;
}

/**
 * 주문 반품사유 item list model
 */
export type OrderReturnReasonItemListModel = Array<OrderReturnReasonItemModel>;

/**
 * 주문 반품신청 가능 item option ticket model
 */
export interface OrderRequestReturnableItemOptionTicketModel extends OrderRequestReturnableItemOptionTicketSchema {
  endDateText: string;
  startDateText: string;
  paymentDateText: string;
  bookingDateText: string;
}

/**
 * 주문 반품신청 가능 item option model
 */
export interface OrderRequestReturnableItemOptionModel extends OrderRequestReturnableItemOptionSchema {
  goods: OrderGoodsModel;
  rowKey: string;
  providerRowspan: number | null;
  exportGroupRowspan: number | null;
  packageOption: OrderGoodsOptionModel;
  ticket: OrderRequestReturnableItemOptionTicketModel | null;
}

/**
 * 주문 반품신청 옵션 model
 */
export interface OrderRequestReturnOptionModel extends OrderRequestReturnOptionSchema {
  // 티켓 상품 여부
  isTicketGoods: boolean;
  returnableItemOptionList: Array<OrderRequestReturnableItemOptionModel>;
  returnSender: OrderRequestReturnSenderModel;
}

/**
 * 주문 반품리스트 item model
 */
export interface OrderReturnListItemModel extends OrderReturnListItemSchema {
  createdDateText: string;
  completedDateText: string;
}

export interface OrderReturnExcelListItemModel extends Omit<OrderReturnExcelListItemSchema, 'itemOptionList'> {
  createdDateText: string;
  completedDateText: string;
  orderPaymentDateText: string;
  itemOptionList: Array<string>;
}

/**
 * 주문 반품 item option exchange model
 */
export interface OrderReturnItemOptionExchangeModel extends OrderReturnItemOptionExchangeSchema {
  goods: OrderGoodsModel;
  exchangeOrderIdText: string;
}

/**
 * 주문 반품 item option model
 */
export interface OrderReturnItemOptionModel extends OrderReturnItemOptionSchema {
  goods: OrderGoodsModel;
  exchange: OrderReturnItemOptionExchangeModel;
  createdDateText: string;
  completedDateText: string;
  statusName: string;
  actorName: string;
  refundStatus: string;
  returnReasonName: string;
  returnReasonText: string;
  returnAutomationStatusName: string;
  returnDeliveryCompanyText: string;
  returnDeliveryNumber: string;
  rowspan: number;
  rowKey: string;
}

/**
 * 주문 반품상세 출고티켓 정보 model
 */
export interface OrderReturnDetailExportTicketInfoModel extends OrderReturnDetailExportTicketInfoSchema {}

/**
 * 주문 반품상세 item model
 */
export interface OrderReturnDetailItemModel extends Omit<OrderReturnDetailItemSchema, 'changeableStatusList'> {
  itemOptionList: Array<OrderReturnItemOptionModel>;
  changeableStatusList: Array<TOption>;
  tempReturnShippingCostText: string;
  returnShippingCostText: string;
  exportTicketInfo: OrderReturnDetailExportTicketInfoModel | null;
}

export interface OrderReturnDefaultInfo {
  createdDate: number;
  completedDate: number;
  rowspan: number;
}

/**
 * 반품 변경정보 model
 */
export interface OrderReturnChangeInfoModel extends OrderReturnChangeInfoSchema {}

// --------------------------------- convert --------------------------------- //

/**
 * 주문 반품사유 item schema > 주문 반품사유 item model convert
 */
export const toOrderReturnReasonItemModel = (item: OrderReturnReasonItemSchema): OrderReturnReasonItemModel => {
  return {
    label: item.text,
    value: item.code,
  };
};

/**
 * 주문 반품사유 item list schema > 주문 반품사유 item list model convert
 */
export const toOrderReturnReasonItemListModel = (
  items: OrderReturnReasonItemListSchema,
): OrderReturnReasonItemListModel => {
  return items.map(toOrderReturnReasonItemModel);
};

export const toOrderRequestReturnableItemOptionTicketModel = (
  item: OrderRequestReturnableItemOptionTicketSchema | null,
  rootItem: OrderRequestReturnOptionSchema,
): OrderRequestReturnableItemOptionTicketModel => {
  if (item === null) {
    return null;
  }

  return {
    ...item,
    startDateText: item.startDate ? toDateFormat(item.startDate) : '-',
    endDateText: item.endDate ? toDateFormat(item.endDate) : '-',
    bookingDateText: item.bookingDate ? toDateFormat(item.bookingDate) : '-',
    paymentDateText: rootItem.paymentDate ? toDateFormat(rootItem.paymentDate) : '-',
  };
};

/**
 * order request returnable item option schema > order request returnable item option model convert
 */
export const toOrderRequestReturnableItemOptionModel = (
  item: OrderRequestReturnableItemOptionSchema,
  rootItem: OrderRequestReturnOptionSchema,
): OrderRequestReturnableItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    rowKey: `${item.id}_${item.itemId}_${item.exportId}`,
    providerRowspan: null,
    exportGroupRowspan: null,
    packageOption: item.packageOption ? toOrderGoodsOptionModel(item.packageOption) : null,
    ticket: toOrderRequestReturnableItemOptionTicketModel(item.ticket, rootItem),
  };
};

/**
 * 주문 반품리스트 item schema > 주문 반품리스트 item model convert
 */
export const toOrderReturnListItemModel = (item: OrderReturnListItemSchema): OrderReturnListItemModel => {
  return {
    ...item,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '',
    completedDateText: item.completedDate ? toDateFormat(item.completedDate) : '',
  };
};

/**
 * 주문 반품리스트 item schema > 주문 반품리스트 item model convert
 */
export const toOrderReturnListModel = (items: Array<OrderReturnListItemSchema>): Array<OrderReturnListItemModel> => {
  return items.map(toOrderReturnListItemModel);
};

/**
 * 주문 반품 엑셀리스트 item schema > 주문 반품 엑셀리스트 item model convert
 */
export const toOrderReturnExcelListItemModel = (
  item: OrderReturnExcelListItemSchema,
): OrderReturnExcelListItemModel => {
  return {
    ...item,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '',
    completedDateText: item.completedDate ? toDateFormat(item.completedDate) : '',
    orderPaymentDateText: item.orderPaymentDate ? toDateFormat(item.orderPaymentDate) : '',
    itemOptionList: item.itemOptionList
      ? item.itemOptionList.map((item) => {
          return `${item.title}: ${item.value}`;
        })
      : null,
  };
};

/**
 * 주문 반품 엑셀리스트 item schema > 주문 반품 엑셀리스트 item model convert
 */
export const toOrderReturnExcelListModel = (
  items: Array<OrderReturnExcelListItemSchema>,
): Array<OrderReturnExcelListItemModel> => {
  return items.map(toOrderReturnExcelListItemModel);
};

/**
 * 주문 반품 item schema > 반품 excel item convert
 */
export const toOrderReturnExcelItem = (item: OrderReturnExcelListItemSchema, index: number): OrderReturnExcelItem => {
  const convertItem = toOrderReturnExcelListItemModel(item);
  const excelKeys = Object.keys(OrderReturnExcelCode);
  const exportItem = excelKeys.reduce<OrderReturnExcelItem>((target, key) => {
    if (key === 'status') {
      target[key] = convertItem.status.name ?? '';
      return target;
    } else if (key === 'type') {
      target[key] = convertItem.type.name ?? '';
      return target;
    } else if (key === 'itemOptionList') {
      target[key] = convertItem.itemOptionList.join(', ');
      return target;
    } else if (key.match(/^(price)$/)) {
      target[key] = typeof convertItem[key] === 'number' ? Number(convertItem[key]).toLocaleString() : '';
      return target;
    }

    target[key] = convertItem[key] ? String(convertItem[key]) : '';
    return target;
  }, {} as OrderReturnExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 반품 item list schema > 반품 excel item list convert
 */
export const toOrderReturnExcelItems = (items: Array<OrderReturnExcelListItemSchema>): Array<OrderReturnExcelItem> => {
  return items.map(toOrderReturnExcelItem);
};

/**
 * 입점사그룹 count 조회
 */
const getProviderGroupCount = (items: Array<OrderRequestReturnableItemOptionModel>, providerId: number): number => {
  return items.filter((item) => item.provider.id === providerId).length;
};

/**
 * 출고그룹 count 조회
 */
const getExportGroupCount = (items: Array<OrderRequestReturnableItemOptionModel>, exportId: number): number => {
  return items.filter((item) => item.exportId === exportId).length;
};

/**
 * rowspan 처리를 위한 설정
 */
export const convertRowGroup = (
  items: Array<OrderRequestReturnableItemOptionModel>,
): Array<OrderRequestReturnableItemOptionModel> => {
  return items.reduce<{
    providerId: number | null;
    exportId: number | null;
    returnableItemOptionList: Array<OrderRequestReturnableItemOptionModel>;
  }>(
    ({ providerId, exportId, returnableItemOptionList }, item) => {
      if (providerId !== item.provider.id && exportId !== item.exportId) {
        returnableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
          exportGroupRowspan: getExportGroupCount(items, item.exportId),
        });
        return {
          providerId: item.provider.id,
          exportId: item.exportId,
          returnableItemOptionList,
        };
      } else if (providerId !== item.provider.id) {
        returnableItemOptionList.push({
          ...item,
          providerRowspan: getProviderGroupCount(items, item.provider.id),
        });
        return {
          providerId: item.provider.id,
          exportId,
          returnableItemOptionList,
        };
      } else if (exportId !== item.exportId) {
        returnableItemOptionList.push({
          ...item,
          exportGroupRowspan: getExportGroupCount(items, item.exportId),
        });
        return {
          providerId,
          exportId: item.exportId,
          returnableItemOptionList,
        };
      } else {
        returnableItemOptionList.push({
          ...item,
          providerRowspan: 0,
          exportGroupRowspan: 0,
        });
        return {
          providerId,
          exportId,
          returnableItemOptionList,
        };
      }
    },
    { providerId: null, exportId: null, returnableItemOptionList: [] },
  ).returnableItemOptionList;
};

/**
 * order request returnable item option list schema > order request returnable item option list model convert
 */
export const toOrderRequestReturnableItemOptionModelList = (
  items: Array<OrderRequestReturnableItemOptionSchema>,
  rootItem: OrderRequestReturnOptionSchema,
): Array<OrderRequestReturnableItemOptionModel> => {
  return convertRowGroup(items.map((item) => toOrderRequestReturnableItemOptionModel(item, rootItem)));
};

/**
 * order request return option schema > order request return option model convert
 */
export const toOrderRequestReturnOptionModel = (
  item: OrderRequestReturnOptionSchema,
): OrderRequestReturnOptionModel => {
  return {
    ...item,
    isTicketGoods: item.returnableItemOptionList.findIndex((item) => item.ticket !== null) > -1,
    returnableItemOptionList: toOrderRequestReturnableItemOptionModelList(item.returnableItemOptionList, item),
  };
};

/**
 * 주문 반품신청 회수자정보 model > form field convert
 */
export const toOrderRequestReturnFormField = (
  { name, phone, postCode, address, addressDetail }: OrderRequestReturnSenderModel,
  initialValues: OrderRequestReturnFormField,
): OrderRequestReturnFormField => {
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

/**
 * return status 해당되는 return status 선택 배열 리턴
 */
export const toReturnStatusSelectList = (exportStatusListString: string = '') => {
  const exportStatuses = exportStatusListString.split(',');

  return ReturnStatusOptions.map((item) => exportStatuses.includes(item));
};

/**
 * return status 선택 배열에 해당하는 return status value 배열 리턴
 */
export const toReturnStatusValueList = (exportStatusList: Array<boolean>) => {
  return exportStatusList.map((item, index) => (item ? ReturnStatusOptions[index] : null)).filter((item) => !!item);
};

/**
 * order return query state > form field convert
 */
export const toOrderReturnSearchFormFieldByQueryState = (
  item: OrderReturnListQueryState,
  defaultFormValues: OrderReturnSearchFormField,
  providerCombo: Array<ProviderComboModel>,
): OrderReturnSearchFormField => {
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
    returnStatusList: item.returnStatusList
      ? toReturnStatusSelectList(item.returnStatusList)
      : defaultFormValues.returnStatusList,
    searchType: item.searchType || defaultFormValues.searchType,
    returnType: item.returnType || defaultFormValues.returnType,
    toDate: item.toDate ? (item.toDate === 'ALL' ? null : toDateFormat(Number(item.toDate))) : defaultFormValues.toDate,
  };
};

/**
 * order return query state > search params convert
 */
export const toOrderReturnSearchParamsByQueryState = (
  item: OrderReturnListQueryState,
  defaultFormValues: OrderReturnSearchFormField,
  providerCombo: Array<ProviderComboModel>,
): OrderReturnListSearchParams => {
  const formFiled = toOrderReturnSearchFormFieldByQueryState(item, defaultFormValues, providerCombo);

  return {
    page: item.page || OrderDefaultSearchPage,
    size: item.size || OrderDefaultSearchSize,
    fromDate: formFiled.fromDate ? new Date(formFiled.fromDate).getTime() : null,
    providerId: formFiled.provider?.value ? String(formFiled.provider.value) : '',
    keyword: formFiled.keyword || '',
    returnStatusList: toReturnStatusValueList(formFiled.returnStatusList),
    searchType: formFiled.searchType as OrderSearchFieldType,
    returnType: formFiled.returnType as OrderSearchReturnType,
    toDate: formFiled.toDate ? new Date(formFiled.toDate).getTime() : null,
    time: item.time,
  };
};

/**
 * order return form field > query state convert
 */
export const toOrderReturnQueryStateBySearchFormField = (
  item: OrderReturnSearchFormField,
  currentQueryState?: OrderReturnListQueryState,
): OrderReturnListQueryState => {
  return {
    ...currentQueryState,
    fromDate: item.fromDate ? new Date(item.fromDate).getTime().toString() : 'ALL',
    providerId: item.provider?.value ? String(item.provider.value) : '',
    keyword: item.keyword || '',
    returnStatusList: toReturnStatusValueList(item.returnStatusList).join(','),
    searchType: item.searchType,
    returnType: item.returnType,
    toDate: item.toDate ? new Date(item.toDate).getTime().toString() : 'ALL',
  };
};

/**
 * 주문 반품 item option exchange schema > 주문 반품 item option exchange model convert
 */
export const toOrderReturnItemOptionExchangeModel = (
  item: OrderReturnItemOptionExchangeSchema,
): OrderReturnItemOptionExchangeModel => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    exchangeOrderIdText: item.exchangeOrderId ? item.exchangeOrderId.toString() : '-',
  };
};

/**
 * 주문 반품 item option schema > 주문 반품 item option model convert
 */
export const toOrderReturnItemOptionModel = (
  item: OrderReturnItemOptionSchema,
  returnItem: OrderReturnDetailItemSchema,
  rowspan: number,
  index: number,
): OrderReturnItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    exchange: toOrderReturnItemOptionExchangeModel(item.exchange),
    createdDateText: returnItem.createdDate ? toDateFormat(returnItem.createdDate) : '-',
    completedDateText: returnItem.completedDate ? toDateFormat(returnItem.completedDate) : '-',
    statusName: returnItem.status.name ?? '-',
    actorName: returnItem.actorName ?? '-',
    refundStatus: returnItem.refund?.refundStatus ?? '-',
    returnReasonName: returnItem.returnReason ? returnItem.returnReason.reason.name : '',
    returnReasonText: returnItem.returnReason ? returnItem.returnReason.reasonText : '',
    returnAutomationStatusName: returnItem.returnAutomationStatus?.name ?? '-',
    returnDeliveryCompanyText: returnItem.returnDeliveryCompanyText ?? null,
    returnDeliveryNumber: returnItem.returnDeliveryNumber ?? null,
    rowKey: `${item.id}_${index}`,
    rowspan,
  };
};

/**
 * 주문 반품 item option list schema > 주문 반품 item option list model convert
 */
export const toOrderReturnItemOptionListModel = (
  items: Array<OrderReturnItemOptionSchema>,
  returnItem: OrderReturnDetailItemSchema,
): Array<OrderReturnItemOptionModel> => {
  return items.map((item, index) =>
    toOrderReturnItemOptionModel(item, returnItem, index === 0 ? items.length : 0, index),
  );
};

export const toTOption = (item: CodeInfo): TOption => {
  return {
    value: item.code,
    label: item.name,
  };
};

export const toTOptionList = (items: Array<CodeInfo>): Array<TOption> => {
  return items.map(toTOption);
};

/**
 * 주문 반품상세 item schema > 주문 반품상세 item model convert
 */
export const toOrderReturnDetailItemModel = (item: OrderReturnDetailItemSchema): OrderReturnDetailItemModel => {
  return {
    ...item,
    itemOptionList: toOrderReturnItemOptionListModel(item.itemOptionList, item),
    changeableStatusList: toTOptionList(item.changeableStatusList),
    tempReturnShippingCostText:
      item.tempReturnShippingCost !== null ? item.tempReturnShippingCost.toLocaleString() : null,
    returnShippingCostText: item.returnShippingCost !== null ? item.returnShippingCost.toLocaleString() : null,
  };
};

/**
 * 주문 반품상세 item model > 주문 반품상세 회수정보 form field convert
 */
export const toOrderReturnDetailFormField = (
  { returnSender, returnMethod, returnReason }: OrderReturnDetailItemModel,
  initialValues: OrderReturnDetailFormField,
): OrderReturnDetailFormField => {
  return {
    name: returnSender?.name || initialValues.name,
    phone: returnSender?.phone || initialValues.phone,
    postCode: returnSender?.postCode || initialValues.postCode,
    address: returnSender?.address || initialValues.address,
    addressDetail: returnSender?.addressDetail || initialValues.addressDetail,
    returnMethod: returnMethod?.code || initialValues.returnMethod,
    // refundReason: returnReason?.reason?.code || initialValues.refundReason,
    // refundReasonText: returnReason?.reasonText || initialValues.refundReasonText,
  };
};

/**
 * 주문 반품 변경정보 schema > 주문 반품 변경정보 model convert
 */
export const toOrderReturnChangeInfoModel = (item: OrderReturnChangeInfoSchema): OrderReturnChangeInfoModel => {
  return {
    ...item,
  };
};
