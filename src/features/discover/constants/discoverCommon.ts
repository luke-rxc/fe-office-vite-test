import { DiscoverSectionTypeListParams } from '../types';

export const GOODS_DEFAULT_PAGE = 1;
export const GOODS_DEFAULT_LIMIT = 10;

export const DiscoverCommonQueryKeys = {
  all: [{ scope: 'discover-common' }] as const,
  lists: () => [{ ...DiscoverCommonQueryKeys.all[0], entity: 'list' }] as const,
  comboLists: () => [{ ...DiscoverCommonQueryKeys.all[0], entity: 'combo-list' }] as const,
  goodsList: (params: DiscoverSectionTypeListParams) =>
    [{ ...DiscoverCommonQueryKeys.lists()[0], subEntity: 'goods-list', params }] as const,
  contentsList: (params: DiscoverSectionTypeListParams) =>
    [{ ...DiscoverCommonQueryKeys.lists()[0], subEntity: 'contents-list', params }] as const,
  showroomList: (params: DiscoverSectionTypeListParams) =>
    [{ ...DiscoverCommonQueryKeys.lists()[0], subEntity: 'showroom-list', params }] as const,
  providerComboList: () => [{ ...DiscoverCommonQueryKeys.comboLists()[0], subEntity: 'provider-combo-list' }] as const,
  brandComboList: (providerId: number) =>
    [{ ...DiscoverCommonQueryKeys.comboLists()[0], subEntity: 'brand-combo-list', providerId }] as const,
  showroomComboList: () => [{ ...DiscoverCommonQueryKeys.comboLists()[0], subEntity: 'showroom-combo-list' }] as const,
  keywordComboList: () => [{ ...DiscoverCommonQueryKeys.comboLists()[0], subEntity: 'keyword-combo-list' }] as const,
} as const;
