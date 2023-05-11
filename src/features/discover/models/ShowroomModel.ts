import { toDateFormat } from '@utils/date';
import { ShowroomStatus, ShowroomStatusLabel, ShowroomTypeLabel } from '../constants';
import { ShowroomComboListSchema, ShowroomComboSchema, ShowroomSchema } from '../schemas';
import { ShowroomSearchFormField, ShowroomSearchParams } from '../types';
import { ImageModel, toImageModel } from './CommonModel';
import { DiscoverKeywordItemModel, toDiscoverKeywordListModel } from './DiscoverKeywordModel';

/**
 * 쇼룸 model
 */
export interface ShowroomModel extends Omit<ShowroomSchema, 'keyword'> {
  sortNum: number;
  keyword: Array<DiscoverKeywordItemModel>;
  keywordLabel: string;
  statusText: string;
  statusClassName: string;
  primaryImage: ImageModel;
  typeText: string;
  rowKey: string;
  createdDateText: string;
  lastUpdatedDateText: string;
}

/**
 * 쇼룸 combo schema
 */
export interface ShowroomComboModel {
  label: string;
  value: number;
}

/**
 * 쇼룸 schema > 쇼룸 model convert
 */
export const toShowroomModel = (item: ShowroomSchema, index: number): ShowroomModel => {
  return {
    ...item,
    keyword: item.keyword ? toDiscoverKeywordListModel(item.keyword) : [],
    keywordLabel: item.keyword
      ? toDiscoverKeywordListModel(item.keyword)
          .map((item) => item.name)
          .join(', ')
      : '',
    statusText: ShowroomStatusLabel[item.status] ?? item.status,
    statusClassName: item.status ? item.status.toLowerCase() : '',
    sortNum: index + 1,
    primaryImage: toImageModel(item.primaryImage),
    typeText: item.type ? ShowroomTypeLabel[item.type] : '',
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '-',
    lastUpdatedDateText: item.lastUpdatedDate ? toDateFormat(item.lastUpdatedDate) : '-',
    rowKey: item.id.toString(),
  };
};

/**
 * 쇼룸 schema list > 쇼룸 model list covert
 */
export const toShowroomListModel = (items: Array<ShowroomSchema>): Array<ShowroomModel> => {
  return items.map(toShowroomModel);
};

/**
 * 쇼룸 combo schema > 쇼룸 combo model convert
 */
export const toShowroomComboModel = (item: ShowroomComboSchema): ShowroomComboModel => {
  return {
    label: item.name,
    value: item.id,
  };
};

/**
 * 쇼룸 combo list schema > 쇼룸 combo list model convert
 */
export const toShowroomComboListModel = (item: ShowroomComboListSchema): Array<ShowroomComboModel> => {
  return item.items.map(toShowroomComboModel);
};

/**
 * 쇼룸 검색 form field > 쇼룸 검색 params covert
 */
export const toShowroomSearchParams = (
  item: ShowroomSearchFormField,
  addedShowroomList: Array<ShowroomModel>,
  page: number,
  size: number,
): ShowroomSearchParams => {
  return {
    searchType: item.searchType,
    keyword: item.searchValue,
    providerId: item.provider ? item.provider.value : null,
    brandId: item.brand ? item.brand.value : null,
    keywordIds: [],
    periodDateType: 'ALL',
    startDate: null,
    endDate: null,
    exceptShowRoomIds: addedShowroomList ? addedShowroomList.map((item) => item.id) : [],
    status: ShowroomStatus.PUBLIC,
    page,
    size,
  };
};
