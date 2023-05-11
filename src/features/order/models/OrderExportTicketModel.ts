import { toDateFormat } from '@utils/date';
import {
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  ExportTicketGoodsKindOptions,
  OrderSearchFieldType,
  ExportTicketStatusOptions,
  OrderExportTicketExcelCode,
  OrderExportTicketGoodsKind,
  OrderExportTicketStatus,
} from '../constants';
import { OrderExportTicketItemSchema } from '../schemas';
import {
  OrderExportBookingDateChangeResponse,
  OrderExportStatusChangeResponse,
  OrderExportTicketBulkUsedParams,
  OrderExportTicketExcelItem,
  OrderExportTicketListQueryState,
  OrderExportTicketListSearchParams,
  OrderExportTicketSearchFormField,
} from '../types';
import { ComboMDModel } from './CommonModel';
import { ProviderComboModel } from './ProviderModel';
import { TicketComboModel } from './TicketModel';

/**
 * 주문 출고(티켓)리스트 item model
 */
export interface OrderExportTicketItemModel extends Omit<OrderExportTicketItemSchema, 'itemOptionList'> {
  itemOptionList: Array<string>;
  orderPaymentDateText: string;
  usableStartDateText: string;
  usableEndDateText: string;
  usedDateText: string;
  returnStatusName: string;
  bookingDateText: string;
}

/**
 * 주문 티켓 상태변경 summary model
 */
export interface OrderExportTicketBulkStatusSummaryModel {
  total: number;
  success: number;
  items: Array<OrderExportStatusChangeResponse>;
}

/**
 * 주문 티켓 투숙일지정 summary model
 */
export interface OrderExportTicketBulkBookingDateSummaryModel {
  total: number;
  success: number;
  items: Array<OrderExportBookingDateChangeResponse>;
}

/**
 * 주문 출고(티켓)리스트 item schema > 주문 출고(티켓)리스트 item model convert
 */
export const toOrderExportTicketListItemModel = (item: OrderExportTicketItemSchema): OrderExportTicketItemModel => {
  return {
    ...item,
    itemOptionList: item.itemOptionList.map((item) => `${item.title}: ${item.value}`),
    orderPaymentDateText: item.orderPaymentDate ? toDateFormat(item.orderPaymentDate) : '-',
    usableStartDateText: item.usableStartDate ? toDateFormat(item.usableStartDate) : '-',
    usableEndDateText: item.usableEndDate ? toDateFormat(item.usableEndDate) : '-',
    usedDateText: item.usedDate ? toDateFormat(item.usedDate) : '-',
    returnStatusName: item.returnStatus?.name ?? '-',
    bookingDateText: item.bookingDate ? toDateFormat(item.bookingDate, 'yyyy/MM/dd') : '-',
  };
};

/**
 * 주문 출고(티켓)리스트 item list schema > 주문 출고(티켓)리스트 item list model convert
 */
export const toOrderExportTicketListModel = (
  items: Array<OrderExportTicketItemSchema>,
): Array<OrderExportTicketItemModel> => {
  return items.map(toOrderExportTicketListItemModel);
};

/**
 * export ticket goodsKind 해당되는 export ticket goodsKind 선택 배열 리턴
 */
export const toExportTicketGoodsKindSelectList = (exportGoodsKindListString: string = '') => {
  const exportGoodsKinds = exportGoodsKindListString.split(',');

  return ExportTicketGoodsKindOptions.map((item) => exportGoodsKinds.includes(item));
};

/**
 * export ticket goodsKind 선택 배열에 해당하는 export ticket goodsKind value 배열 리턴
 */
export const toExportTicketGoodsKindValueList = (exportGoodsKindList: Array<boolean>) => {
  return exportGoodsKindList
    .map((item, index) => (item ? ExportTicketGoodsKindOptions[index] : null))
    .filter((item) => !!item);
};

/**
 * export ticket status 해당되는 export ticket status 선택 배열 리턴
 */
export const toExportTicketStatusSelectList = (exportStatusListString: string = '') => {
  const exportStatuses = exportStatusListString.split(',');

  return ExportTicketStatusOptions.map((item) => exportStatuses.includes(item));
};

/**
 * export ticket status 선택 배열에 해당하는 export ticket status value 배열 리턴
 */
export const toExportTicketStatusValueList = (exportStatusList: Array<boolean>) => {
  return exportStatusList
    .map((item, index) => (item ? ExportTicketStatusOptions[index] : null))
    .filter((item) => !!item);
};

/**
 * order export ticket query state > form field convert
 */
export const toOrderExportTicketSearchFormFieldByQueryState = (
  item: OrderExportTicketListQueryState,
  defaultFormValues: OrderExportTicketSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
  ticketCombo: Array<TicketComboModel>,
): OrderExportTicketSearchFormField => {
  return {
    fromDate: item.fromDate
      ? item.fromDate === 'ALL'
        ? ''
        : toDateFormat(Number(item.fromDate), `yyyy-MM-dd'T'HH:mm`)
      : defaultFormValues.fromDate,
    provider:
      item.providerId && providerCombo
        ? providerCombo.find((provider) => provider.value === Number(item.providerId))
        : defaultFormValues.provider,
    md: item.mdId && mdCombo ? mdCombo.find((md) => md.value === Number(item.mdId)) : defaultFormValues.md,
    keyword: item.keyword || defaultFormValues.keyword,
    goodsKindList: item.goodsKindList
      ? toExportTicketGoodsKindSelectList(item.goodsKindList)
      : defaultFormValues.goodsKindList,
    ticketStatusList: item.ticketStatusList
      ? toExportTicketStatusSelectList(item.ticketStatusList)
      : defaultFormValues.ticketStatusList,
    searchType: item.searchType || defaultFormValues.searchType,
    toDate: item.toDate
      ? item.toDate === 'ALL'
        ? ''
        : toDateFormat(Number(item.toDate), `yyyy-MM-dd'T'HH:mm`)
      : defaultFormValues.toDate,
    returnedYN: item.returnedYN === 'Y',
    ticket:
      item.ticketId && ticketCombo
        ? ticketCombo.find((ticket) => ticket.value === Number(item.ticketId))
        : defaultFormValues.ticket,
  };
};

/**
 * order export ticket query state > search params convert
 */
export const toOrderExportTicketSearchParamsByQueryState = (
  item: OrderExportTicketListQueryState,
  defaultFormValues: OrderExportTicketSearchFormField,
  providerCombo: Array<ProviderComboModel>,
  mdCombo: Array<ComboMDModel>,
  ticketCombo: Array<TicketComboModel>,
): OrderExportTicketListSearchParams => {
  const formFiled = toOrderExportTicketSearchFormFieldByQueryState(
    item,
    defaultFormValues,
    providerCombo,
    mdCombo,
    ticketCombo,
  );

  return {
    page: item.page || OrderDefaultSearchPage,
    size: item.size || OrderDefaultSearchSize,
    fromDate: formFiled.fromDate ? new Date(formFiled.fromDate).getTime() : null,
    providerId: formFiled.provider?.value ? String(formFiled.provider.value) : '',
    mdId: formFiled.md?.value ? String(formFiled.md.value) : '',
    keyword: formFiled.keyword || defaultFormValues.keyword,
    goodsKindList: toExportTicketGoodsKindValueList(formFiled.goodsKindList),
    ticketStatusList: toExportTicketStatusValueList(formFiled.ticketStatusList),
    searchType: formFiled.searchType as OrderSearchFieldType,
    toDate: formFiled.toDate ? new Date(formFiled.toDate).getTime() : null,
    time: item.time,
    returnedYN: item.returnedYN,
    ticketId: formFiled.ticket?.value ? String(formFiled.ticket.value) : '',
  };
};

/**
 * order export ticket form field > query state convert
 */
export const toOrderExportTicketQueryStateBySearchFormField = (
  item: OrderExportTicketSearchFormField,
  currentQueryState?: OrderExportTicketListQueryState,
): OrderExportTicketListQueryState => {
  return {
    ...currentQueryState,
    fromDate: item.fromDate
      ? new Date(`${toDateFormat(item.fromDate, 'yyyy/MM/dd HH:mm')}:00`).getTime().toString()
      : 'ALL',
    providerId: item.provider?.value ? String(item.provider.value) : '',
    mdId: item.md?.value ? String(item.md.value) : '',
    keyword: item.keyword || '',
    goodsKindList: toExportTicketGoodsKindValueList(item.goodsKindList).join(','),
    ticketStatusList: toExportTicketStatusValueList(item.ticketStatusList).join(','),
    searchType: item.searchType,
    toDate: item.toDate ? new Date(`${toDateFormat(item.toDate, 'yyyy/MM/dd HH:mm')}:59`).getTime().toString() : 'ALL',
    returnedYN: item.returnedYN ? 'Y' : 'N',
    ticketId: item.ticket?.value ? String(item.ticket.value) : '',
  };
};

/**
 * 주문 출고(티켓) item schema > 출고(티켓) excel item convert
 */
export const toOrderExportTicketExcelItem = (
  item: OrderExportTicketItemSchema,
  index: number,
): OrderExportTicketExcelItem => {
  const convertItem = toOrderExportTicketListItemModel(item);
  const excelKeys = Object.keys(OrderExportTicketExcelCode);
  const exportItem = excelKeys.reduce<OrderExportTicketExcelItem>((target, key) => {
    if (key === 'exportTicketStatus') {
      target[key] = convertItem.exportTicketStatus.name ?? '';
      return target;
    } else if (key === 'goodsKind') {
      target[key] = convertItem.goodsKind.name ?? '';
      return target;
    } else if (key === 'itemOptionList') {
      target[key] = convertItem.itemOptionList.join(', ');
      return target;
    } else if (key.match(/^(price|goodsCouponSale|cartCouponSale|priceExcludeCouponSale|commissionPrice)$/)) {
      target[key] = typeof convertItem[key] === 'number' ? Number(convertItem[key]).toLocaleString() : '';
      return target;
    }

    target[key] = convertItem[key] ? String(convertItem[key]) : '';
    return target;
  }, {} as OrderExportTicketExcelItem);
  return {
    ...exportItem,
    index: index + 1,
  };
};

/**
 * 주문 출고(티켓) item list schema > 출고(티켓) excel item list convert
 */
export const toOrderExportTicketExcelItems = (
  items: Array<OrderExportTicketItemSchema>,
): Array<OrderExportTicketExcelItem> => {
  return items.map(toOrderExportTicketExcelItem);
};

/**
 * order export ticket form field > 티켓 일괄 사용처리 params convert
 */
export const toOrderExportTicketBulkUsedParamsBySearchFormField = (
  item: OrderExportTicketSearchFormField,
  defaultFormValues: OrderExportTicketSearchFormField,
): OrderExportTicketBulkUsedParams => {
  return {
    fromDate: item.fromDate ? new Date(item.fromDate).getTime() : null,
    keyword: item.keyword || defaultFormValues.keyword,
    goodsKind: OrderExportTicketGoodsKind.TICKET_NORMAL,
    ticketStatus: OrderExportTicketStatus.ISSUED,
    toDate: item.toDate ? new Date(item.toDate).getTime() : null,
    ticketId: item.ticket?.value ? String(item.ticket.value) : '',
  };
};

/**
 * 주문 상태변경 결과 list => 주문 상태변경 summary model convert
 */
export const toOrderExportTicketSummaryModel = (
  items: Array<OrderExportStatusChangeResponse>,
): OrderExportTicketBulkStatusSummaryModel => {
  return {
    total: items.length,
    success: items.filter((item) => item.success).length,
    items,
  };
};

/**
 * 주문 투숙일지정 결과 list => 주문 투숙일지정 summary model convert
 */
export const toOrderExportTicketBulkBookingDateSummaryModel = (
  items: Array<OrderExportBookingDateChangeResponse>,
): OrderExportTicketBulkBookingDateSummaryModel => {
  return {
    total: items.length,
    success: items.filter((item) => item.success).length,
    items,
  };
};
