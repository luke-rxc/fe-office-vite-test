import flatMap from 'lodash/flatMap';
import { toDateFormat } from '@utils/date';
import { ComboMDModel, OrderGoodsModel, ProviderComboModel, toOrderGoodsModel } from '.';
import {
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  OrderExportExcelCode,
  OrderExportPrepareExcelCode,
  OrderSearchFieldType,
  OrderStatusExportOptions,
} from '../constants';
import {
  OrderExportableItemSchema,
  OrderExportDetailSchema,
  OrderExportItemOptionSchema,
  OrderExportListItemSchema,
  OrderExportRegistSchema,
  StatusSchema,
} from '../schemas';
import {
  OrderExportListQueryState,
  OrderExportListSearchParams,
  OrderExportSearchFormField,
  OrderExportUploadOptionParams,
  OrderExportExcelItem,
  OrderExportDeliveryInfoParams,
  OrderExportDeliveryInfoFormField,
} from '../types';
import { toConvertExceptSpecialCharacter } from '../utils';
import { ExportItemTicketModel, toExportItemTicketModal } from './OrderModel';

/**
 * 주문 출고리스트 item model
 */
export interface OrderExportListItemModel extends OrderExportListItemSchema {
  exportedDateText: string;
  inShippingDateText: string;
  shippingIngDateText: string;
  completeDateText: string;
  confirmDateText: string;
}

/**
 * 주문 출고 item option model
 */
export interface OrderExportItemOptionModel extends OrderExportItemOptionSchema {
  status: StatusSchema;
  delivery: {
    company: string;
    number: string;
    trackingUrl: string;
  };
  exportedDateText: string;
  inShippingDateText: string;
  shippingIngDateText: string;
  completeDateText: string;
  goods: OrderGoodsModel;
  shippingGroupRowspan: number | null;
  ticket: ExportItemTicketModel;
}

/**
 * 주문 일괄출고 결과 model
 */
export interface OrderExportRegistModel {
  isSuccess: boolean;
  orderId: string;
  optionId: string;
  message: string;
  rowKey: string;
}

/**
 * 주문 일괄출고 summary model
 */
export interface OrderExportSummaryModel {
  total: number;
  success: number;
  items: Array<OrderExportRegistModel>;
}

/**
 * 주문 출고 상세 model
 */
export interface OrderExportDetailModel extends OrderExportDetailSchema {
  itemOptionList: Array<OrderExportItemOptionModel>;
}

/**
 * 주문 출고리스트 item schema > 주문 출고리스트 item model convert
 */
export const toOrderExportListItemModel = (item: OrderExportListItemSchema): OrderExportListItemModel => {
  return {
    ...item,
    exportedDateText: item.exportedDate ? toDateFormat(item.exportedDate) : '-',
    inShippingDateText: item.inShippingDate ? toDateFormat(item.inShippingDate) : '-',
    shippingIngDateText: item.shippingIngDate ? toDateFormat(item.shippingIngDate) : '-',
    completeDateText: item.completeDate ? toDateFormat(item.completeDate) : '-',
    confirmDateText: item.confirmDate ? toDateFormat(item.confirmDate) : '-',
  };
};

/**
 * 주문 출고리스트 item list schema > 주문 출고리스트 item list model convert
 */
export const toOrderExportListModel = (items: Array<OrderExportListItemSchema>): Array<OrderExportListItemModel> => {
  return items.map(toOrderExportListItemModel);
};

/**
 * export status 해당되는 export status 선택 배열 리턴
 */
export const toExportStatusSelectList = (exportStatusListString: string = '') => {
  const exportStatuses = exportStatusListString.split(',');

  return OrderStatusExportOptions.map((item) => exportStatuses.includes(item));
};

/**
 * export status 선택 배열에 해당하는 export status value 배열 리턴
 */
export const toExportStatusValueList = (exportStatusList: Array<boolean>) => {
  return exportStatusList
    .map((item, index) => (item ? OrderStatusExportOptions[index] : null))
    .filter((item) => !!item);
};

/**
 * order export query state > form field convert
 */
export const toOrderExportSearchFormFieldByQueryState = (
  item: OrderExportListQueryState,
  defaultFormValues: OrderExportSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
): OrderExportSearchFormField => {
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
    md: item.mdId && mdCombo ? mdCombo.find((md) => md.value === Number(item.mdId)) : defaultFormValues.md,
    keyword: item.keyword || defaultFormValues.keyword,
    exportStatusList: item.exportStatusList
      ? toExportStatusSelectList(item.exportStatusList)
      : defaultFormValues.exportStatusList,
    searchType: item.searchType || defaultFormValues.searchType,
    toDate: item.toDate ? (item.toDate === 'ALL' ? null : toDateFormat(Number(item.toDate))) : defaultFormValues.toDate,
    purchaseConfirmYN: item.purchaseConfirmYN === 'Y',
  };
};

/**
 * order export query state > search params convert
 */
export const toOrderExportSearchParamsByQueryState = (
  item: OrderExportListQueryState,
  defaultFormValues: OrderExportSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
): OrderExportListSearchParams => {
  const formFiled = toOrderExportSearchFormFieldByQueryState(item, defaultFormValues, providerCombo, mdCombo);

  return {
    page: item.page || OrderDefaultSearchPage,
    size: item.size || OrderDefaultSearchSize,
    fromDate: formFiled.fromDate ? new Date(formFiled.fromDate).getTime() : null,
    providerId: formFiled.provider?.value ? String(formFiled.provider.value) : '',
    mdId: formFiled.md?.value ? String(formFiled.md.value) : '',
    keyword: formFiled.keyword || '',
    exportStatusList: toExportStatusValueList(formFiled.exportStatusList),
    searchType: formFiled.searchType as OrderSearchFieldType,
    toDate: formFiled.toDate ? new Date(formFiled.toDate).getTime() : null,
    time: item.time,
    purchaseConfirmYN: item.purchaseConfirmYN ?? '',
  };
};

/**
 * order export form field > query state convert
 */
export const toOrderExportQueryStateBySearchFormField = (
  item: OrderExportSearchFormField,
  currentQueryState?: OrderExportListQueryState,
): OrderExportListQueryState => {
  return {
    ...currentQueryState,
    fromDate: item.fromDate ? new Date(item.fromDate).getTime().toString() : 'ALL',
    providerId: item.provider?.value ? String(item.provider.value) : '',
    mdId: item.md?.value ? String(item.md.value) : '',
    keyword: item.keyword || '',
    exportStatusList: toExportStatusValueList(item.exportStatusList).join(','),
    searchType: item.searchType,
    toDate: item.toDate ? new Date(item.toDate).getTime().toString() : 'ALL',
    purchaseConfirmYN: item.purchaseConfirmYN ? 'Y' : '',
  };
};

/**
 * 주문 출고 item option schema > 주문 출고 item option model
 */
export const toOrderExportItemOptionModel = (
  item: OrderExportItemOptionSchema,
  exportItemDetail: OrderExportDetailSchema,
  shippingGroupRowspan: number,
): OrderExportItemOptionModel => {
  return {
    ...item,
    goods: toOrderGoodsModel(item.goods),
    status: exportItemDetail.status,
    delivery: exportItemDetail.delivery,
    exportedDateText: exportItemDetail.exportedDate ? toDateFormat(exportItemDetail.exportedDate) : '-',
    inShippingDateText: exportItemDetail.inShippingDate ? toDateFormat(exportItemDetail.inShippingDate) : '-',
    shippingIngDateText: exportItemDetail.shippingIngDate ? toDateFormat(exportItemDetail.shippingIngDate) : '-',
    completeDateText: exportItemDetail.completeDate ? toDateFormat(exportItemDetail.completeDate) : '-',
    ticket: toExportItemTicketModal(exportItemDetail.ticket),
    partnerExportCode: item.partnerExportCode || '-',
    shippingGroupRowspan,
  };
};

/**
 * 주문 출고 item option list schema > 주문 출고 item option list model
 */
export const toOrderExportItemOptionListModel = (
  items: Array<OrderExportItemOptionSchema>,
  exportItemDetail: OrderExportDetailSchema,
): Array<OrderExportItemOptionModel> => {
  return items.map((item, index) =>
    toOrderExportItemOptionModel(item, exportItemDetail, index === 0 ? items.length : 0),
  );
};

/**
 * 주문 출고 상세 schema > 주문 출고 상세 model
 */
export const toOrderExportDetailModel = (item: OrderExportDetailSchema): OrderExportDetailModel => {
  return {
    ...item,
    itemOptionList: toOrderExportItemOptionListModel(item.itemOptionList, item),
  };
};

/**
 * 주문 출고가능 item schema > 출고 excel item convert
 */
export const toOrderExportUploadItem = (item: OrderExportableItemSchema, index: number): OrderExportExcelItem => {
  const excelKeys = Object.keys(OrderExportPrepareExcelCode);
  const exportItem = excelKeys.reduce<OrderExportExcelItem>((target, key) => {
    if (key === 'paymentDate') {
      target[key] = item[key] ? toDateFormat(item[key]) : '';
      return target;
    }

    target[key] = item[key] ? String(item[key]) : '';
    return target;
  }, {} as OrderExportExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 출고가능 item list schema > 출고 excel item list convert
 */
export const toOrderExportUploadItemList = (items: Array<OrderExportableItemSchema>): Array<OrderExportExcelItem> => {
  return items.map(toOrderExportUploadItem);
};

/**
 * 주문 출고 excel item > 주문 출고 업로드 params convert
 */
export const toOrderExportUploadOptionParam = ({
  deliveryCompanyName,
  deliveryNumber,
  exportEa,
  orderId,
  orderItemOptionId,
  shippingId,
  shippingMethod,
}: OrderExportExcelItem): OrderExportUploadOptionParams => {
  return {
    deliveryCompanyName,
    deliveryNumber: toConvertExceptSpecialCharacter(String(deliveryNumber)),
    exportEa: Number(exportEa),
    orderId: Number(orderId),
    orderItemOptionId: Number(orderItemOptionId),
    orderShippingId: Number(shippingId),
    shippingMethod,
  };
};

/**
 * 주문 출고 excel item list > 주문 출고 업로드 params list convert
 */
export const toOrderExportUploadOptionParams = (
  items: Array<OrderExportExcelItem>,
): Array<OrderExportUploadOptionParams> => {
  return items.map(toOrderExportUploadOptionParam);
};

/**
 * 주문 일괄출고 결과 schema list => 주문 일괄출고 결과 model list convert
 */
export const toOrderExportRegistModelList = (items: Array<OrderExportRegistSchema>): Array<OrderExportRegistModel> => {
  return flatMap(items, (item) =>
    item.messages.map<OrderExportRegistModel>(({ optionId, message }) => {
      return {
        isSuccess: item.isSuccess,
        orderId: item.orderId.toString(),
        optionId,
        message,
        rowKey: `${item.orderId}_${optionId}_${message}`,
      };
    }),
  ).filter((item) => !item.isSuccess);
};

/**
 * 주문 일괄출고 결과 schema list => 주문 일괄출고 summary model convert
 */
export const toOrderExportSummaryModel = (items: Array<OrderExportRegistSchema>): OrderExportSummaryModel => {
  return {
    total: items.length,
    success: items.filter((item) => item.isSuccess).length,
    items: toOrderExportRegistModelList(items),
  };
};

/**
 * 출고 운송정보 form field => 출고 운송정보 params convert
 */
export const toOrderExportDeliveryInfoParams = (
  { deliveryCompany, deliveryNumber }: OrderExportDeliveryInfoFormField,
  exportId: string,
): OrderExportDeliveryInfoParams => {
  return {
    exportId,
    deliveryCompanyCode: deliveryCompany.value,
    deliveryNumber: deliveryNumber,
  };
};

/**
 * 주문 출고 item schema > 출고 excel item convert
 */
export const toOrderExportExcelItem = (item: OrderExportListItemSchema, index: number): OrderExportExcelItem => {
  const convertItem = toOrderExportListItemModel(item);
  const excelKeys = Object.keys(OrderExportExcelCode);
  const exportItem = excelKeys.reduce<OrderExportExcelItem>((target, key) => {
    switch (key) {
      case 'exportStatus':
        target[key] = convertItem.exportStatus.name ?? '';
        return target;
      case 'exportedDate':
        target[key] =
          convertItem.exportedDateText && convertItem.exportedDateText !== '-' ? convertItem.exportedDateText : '';
        return target;
      case 'inShippingDate':
        target[key] =
          convertItem.inShippingDateText && convertItem.inShippingDateText !== '-'
            ? convertItem.inShippingDateText
            : '';
        return target;
      case 'completeDate':
        target[key] =
          convertItem.completeDateText && convertItem.completeDateText !== '-' ? convertItem.completeDateText : '';
        return target;
      case 'confirmDate':
        target[key] =
          convertItem.confirmDateText && convertItem.confirmDateText !== '-' ? convertItem.confirmDateText : '';
        return target;
    }

    target[key] = convertItem[key] ? String(convertItem[key]) : '';
    return target;
  }, {} as OrderExportExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 출고 item list schema > 출고 excel item list convert
 */
export const toOrderExportExcelItems = (items: Array<OrderExportListItemSchema>): Array<OrderExportExcelItem> => {
  return items.map(toOrderExportExcelItem);
};
