import { toDateFormat } from '@utils/date';
import { ContentsStatusLabel, ContentsTypeLabel } from '../constants';
import { ContentsSchema } from '../schemas';
import { ContentsSearchFormField, ContentsSearchParams } from '../types';
import { ImageModel, toImageModel } from './CommonModel';
import { DiscoverKeywordItemModel, toDiscoverKeywordListModel } from './DiscoverKeywordModel';

/**
 * 콘텐츠 model
 */
export interface ContentsModel extends Omit<ContentsSchema, 'keyword'> {
  sortNum: number;
  primaryImage: ImageModel;
  keyword: Array<DiscoverKeywordItemModel>;
  keywordLabel: string;
  publicStartDateText: string;
  publicEndDateText: string;
  typeText: string;
  statusText: string;
  statusClassName: string;
  rowKey: string;
}

/**
 * 콘텐츠 schema > 콘텐츠 model covert
 */
export const toContentsModel = (item: ContentsSchema, index: number): ContentsModel => {
  return {
    ...item,
    primaryImage: toImageModel(item.primaryImage),
    keyword: item.keyword ? toDiscoverKeywordListModel(item.keyword) : [],
    keywordLabel: item.keyword
      ? toDiscoverKeywordListModel(item.keyword)
          .map((item) => item.name)
          .join(', ')
      : '',
    publicStartDateText: item.publicStartDate ? toDateFormat(item.publicStartDate) : '-',
    publicEndDateText: item.publicEndDate ? toDateFormat(item.publicEndDate) : '-',
    typeText: ContentsTypeLabel[item.type] ?? item.type,
    statusText: ContentsStatusLabel[item.status] ?? item.status,
    statusClassName: item.status ? item.status.toLowerCase() : '',
    sortNum: index + 1,
    rowKey: item.id.toString(),
  };
};

/**
 * 콘텐츠 schema list > 콘텐츠 model list covert
 */
export const toContentsListModel = (items: Array<ContentsSchema>): Array<ContentsModel> => {
  return items.map(toContentsModel);
};

/**
 * 콘텐츠 검색 form field > 콘텐츠 검색 params covert
 */
export const toContentsSearchParams = (
  item: ContentsSearchFormField,
  addedContentsList: Array<ContentsModel>,
  page: number,
  size: number,
): ContentsSearchParams => {
  return {
    searchType: item.searchType,
    searchValue: item.searchValue,
    providerId: item.provider ? item.provider.value : null,
    showRoomId: item.showroom ? item.showroom.value : null,
    keywordIds: [],
    searchDateType: 'ALL',
    searchEndDate: null,
    searchStartDate: null,
    statusList: ['PUBLIC'],
    exceptStoryIds: addedContentsList ? addedContentsList.map((item) => item.id) : [],
    page,
    size,
  };
};
