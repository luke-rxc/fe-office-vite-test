import { toDateFormat } from '@utils/date';
import {
  DiscoverKeywordMappingType,
  DiscoverKeywordStatus,
  DiscoverKeywordStatusLabel,
  DiscoverSectionDisplayType,
  KEYWORD_DEFAULT_LIMIT,
  KEYWORD_DEFAULT_PAGE,
} from '../constants';
import { ContentsSchema, DiscoverKeywordItemSchema, GoodsSchema, ShowroomSchema } from '../schemas';
import {
  DiscoverKeywordModifyFormField,
  DiscoverKeywordModifyParams,
  DiscoverKeywordQueryState,
  DiscoverKeywordRegistResponse,
  DiscoverKeywordSearchParams,
  DiscoverSectionTypeListParams,
} from '../types';
import { ContentsModel, toContentsModel } from './ContentsModel';
import { GoodsModel, toGoodsModel } from './GoodsModel';
import { ShowroomModel, toShowroomModel } from './ShowroomModel';

/**
 * 디스커버 키워드 아이템 model
 */
export interface DiscoverKeywordItemModel extends DiscoverKeywordItemSchema {
  createdDateText: string;
  updatedDateText: string;
  goodsCount: number;
  showRoomCount: number;
  storyCount: number;
  mappingTarget: string;
  statusText: string;
  rowKey: string;
}

/**
 * 디스커버 키워드 일괄등록 summary model
 */
export interface DiscoverKeywordBulkRegistSummaryModel<T> {
  total: number;
  success: number;
  items: Array<DiscoverKeywordRegistResponse<T>>;
}

/**
 * 디스커버 키워드 아이템 schema > 디스커버 키워드 아이템 model convert
 */
export const toDiscoverKeywordItemModel = (item: DiscoverKeywordItemSchema): DiscoverKeywordItemModel => {
  return {
    ...item,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '-',
    updatedDateText: item.updatedDate ? toDateFormat(item.updatedDate) : '-',
    mappingTarget: `상품(${item.goodsCount}) / 쇼룸(${item.showRoomCount}) / 콘텐츠(${item.storyCount})`,
    statusText: item.status ? DiscoverKeywordStatusLabel[item.status] : '',
    rowKey: item.id.toString(),
  };
};

/**
 * 디스커버 키워드 리스트 schema > 디스커버 키워드 리스트 model convert
 */
export const toDiscoverKeywordListModel = (
  items: Array<DiscoverKeywordItemSchema>,
): Array<DiscoverKeywordItemModel> => {
  return items.map(toDiscoverKeywordItemModel);
};

/**
 * 디스커버 키워드 query state > 디스커버 키워드 검색 params convert
 */
export const toDiscoverKeywordSearchParams = (
  item: DiscoverKeywordQueryState,
  status: DiscoverKeywordStatus,
): DiscoverKeywordSearchParams => {
  return {
    page: item.page ?? KEYWORD_DEFAULT_PAGE.toString(),
    size: item.limit ?? KEYWORD_DEFAULT_LIMIT.toString(),
    status: status ? (status === DiscoverKeywordStatus.ALL ? null : status) : null,
  };
};

/**
 * 디스커버 키워드 아이템 model > 디스커버 키워드 수정 form field convert
 */
export const toDiscoverKeywordModifyFormField = (item: DiscoverKeywordItemModel): DiscoverKeywordModifyFormField => {
  return {
    keyword: item.name,
    status: item.status,
  };
};

/**
 * 디스커버 섹션 아이템 model > 디스커버 섹션타입별 리스트 조회 params convert
 */
export const toDiscoverSectionTypeListParamsByKeyword = (
  item: DiscoverKeywordItemModel,
  page: number,
  limit: number,
  requestKeyword: boolean = true,
): DiscoverSectionTypeListParams => {
  if (!item) {
    return null;
  }

  return {
    page,
    size: limit,
    displayType: DiscoverSectionDisplayType.CURATION,
    keywordId: item.id,
    requestKeyword,
  };
};

/**
 * 디스커버 키워드 수정 params convert
 */
export const toDiscoverKeywordModifyParams = (
  keywordId: string,
  item: DiscoverKeywordModifyFormField,
  goodsIdList: Array<number>,
  showRoomIdList: Array<number>,
  storyIdList: Array<number>,
): DiscoverKeywordModifyParams => {
  return {
    keywordId,
    value: item.keyword,
    status: item.status,
    goodsIdList,
    showRoomIdList,
    storyIdList,
  };
};

/**
 * 디스커버 키워드 일괄등록 결과 list => 디스커버 키워드 일괄등록 summary model convert
 */
export const toDiscoverKeywordBulkRegistSummaryModel = (
  items: Array<DiscoverKeywordRegistResponse<GoodsSchema | ShowroomSchema | ContentsSchema>>,
  mappingType: DiscoverKeywordMappingType,
  addedIds: Array<number>,
) => {
  switch (mappingType) {
    case DiscoverKeywordMappingType.GOODS:
      return toDiscoverKeywordBulkRegistGoodsSummaryModel(
        items as Array<DiscoverKeywordRegistResponse<GoodsSchema>>,
        addedIds,
      );
    case DiscoverKeywordMappingType.SHOWROOM:
      return toDiscoverKeywordBulkRegistShowroomSummaryModel(
        items as Array<DiscoverKeywordRegistResponse<ShowroomSchema>>,
        addedIds,
      );
    case DiscoverKeywordMappingType.CONTENTS:
      return toDiscoverKeywordBulkRegistContentsSummaryModel(
        items as Array<DiscoverKeywordRegistResponse<ContentsSchema>>,
        addedIds,
      );
  }
};

/**
 * 디스커버 키워드 일괄등록 결과 list => 디스커버 키워드 일괄등록 goods summary model convert
 */
export const toDiscoverKeywordBulkRegistGoodsSummaryModel = (
  items: Array<DiscoverKeywordRegistResponse<GoodsSchema>>,
  addedIds: Array<number>,
): DiscoverKeywordBulkRegistSummaryModel<GoodsModel> => {
  const validItems = items.map<DiscoverKeywordRegistResponse<GoodsModel>>((resultItem) => {
    if (resultItem.success) {
      if (addedIds.includes(resultItem.item.goodsId)) {
        return {
          success: false,
          id: resultItem.id,
          message: '이미 맵핑 등록된 중복 ID 입니다.',
        };
      }
      resultItem.item = toGoodsModel(resultItem.item, 0);
    }
    return resultItem as DiscoverKeywordRegistResponse<GoodsModel>;
  });
  return {
    total: items.length,
    success: validItems.filter((item) => item.success).length,
    items: validItems,
  };
};
/**
 * 디스커버 키워드 일괄등록 결과 list => 디스커버 키워드 일괄등록 showroom summary model convert
 */
export const toDiscoverKeywordBulkRegistShowroomSummaryModel = (
  items: Array<DiscoverKeywordRegistResponse<ShowroomSchema>>,
  addedIds: Array<number>,
): DiscoverKeywordBulkRegistSummaryModel<ShowroomModel> => {
  const validItems = items.map<DiscoverKeywordRegistResponse<ShowroomModel>>((resultItem) => {
    if (resultItem.success) {
      if (addedIds.includes(resultItem.item.id)) {
        return {
          success: false,
          id: resultItem.id,
          message: '이미 맵핑 등록된 중복 ID 입니다.',
        };
      }
      resultItem.item = toShowroomModel(resultItem.item, 0);
    }
    return resultItem as DiscoverKeywordRegistResponse<ShowroomModel>;
  });
  return {
    total: items.length,
    success: validItems.filter((item) => item.success).length,
    items: validItems,
  };
};
/**
 * 디스커버 키워드 일괄등록 결과 list => 디스커버 키워드 일괄등록 contents summary model convert
 */
export const toDiscoverKeywordBulkRegistContentsSummaryModel = (
  items: Array<DiscoverKeywordRegistResponse<ContentsSchema>>,
  addedIds: Array<number>,
): DiscoverKeywordBulkRegistSummaryModel<ContentsModel> => {
  const validItems = items.map<DiscoverKeywordRegistResponse<ContentsModel>>((resultItem) => {
    if (resultItem.success) {
      if (addedIds.includes(resultItem.item.id)) {
        return {
          success: false,
          id: resultItem.id,
          message: '이미 맵핑 등록된 중복 ID 입니다.',
        };
      }
      resultItem.item = toContentsModel(resultItem.item, 0);
    }
    return resultItem as DiscoverKeywordRegistResponse<ContentsModel>;
  });
  return {
    total: items.length,
    success: validItems.filter((item) => item.success).length,
    items: validItems,
  };
};
