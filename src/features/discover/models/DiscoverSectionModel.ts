import { toDateFormat } from '@utils/date';
import {
  DiscoverSectionDisplayOption,
  DiscoverSectionDisplayType,
  DiscoverSectionDisplayTypeGoodsOptions,
  DiscoverSectionDisplayTypeLiveOptions,
  DiscoverSectionDisplayTypeModeLabel,
  DiscoverSectionDisplayTypeShowroomOptions,
  DiscoverSectionDisplayTypeStoryOptions,
  DiscoverSectionOpenStatus,
  DiscoverSectionOpenStatusLabel,
  DiscoverSectionType,
  DiscoverSectionTypeLabel,
} from '../constants';
import { DiscoverSectionCreatableTypeSchema, DiscoverSectionItemSchema } from '../schemas';
import {
  DiscoverSectionCreateParams,
  DiscoverSectionCreateFormField,
  DiscoverSectionModifyFormField,
  DiscoverSectionModifyParams,
  DiscoverSectionTypeListParams,
} from '../types';
import { ContentsModel } from './ContentsModel';
import { GoodsModel } from './GoodsModel';
import { KeywordComboItemModel, toKeywordComboItemModel } from './KeywordsModel';
import { ShowroomModel } from './ShowroomModel';
import { PaginationProps } from '@components/table/Table';

/**
 * 디스커버 섹션  타입 item
 */
export type DiscoverSectionTypeItemModel = GoodsModel | ContentsModel | ShowroomModel;

/**
 * 디스커버 섹션 아이템 model
 */
export interface DiscoverSectionItemModel extends Omit<DiscoverSectionItemSchema, 'keyword'> {
  sortNum: number;
  sectionTypeText: string;
  displayTypeText: string;
  createdDateText: string;
  updatedDateText: string;
  openStatus: DiscoverSectionOpenStatus;
  openStatusText: string;
  openStatusClassName: string;
  keyword: KeywordComboItemModel;
  rowKey: string;
}

/**
 * 디스커버 섹션 생성가능 타입 model
 */
export interface DiscoverSectionCreatableTypeModel {
  sectionType: DiscoverSectionType;
  options: Array<DiscoverSectionDisplayOption>;
}

/**
 * 디스커버 섹션 display type option 리턴
 */
export const getDiscoverSectionDisplayTypeOptionsBySectionType = (sectionType: DiscoverSectionType) => {
  switch (sectionType) {
    case DiscoverSectionType.GOODS:
      return DiscoverSectionDisplayTypeGoodsOptions;
    case DiscoverSectionType.SHOWROOM:
      return DiscoverSectionDisplayTypeShowroomOptions;
    case DiscoverSectionType.STORY:
      return DiscoverSectionDisplayTypeStoryOptions;
    case DiscoverSectionType.LIVE:
      return DiscoverSectionDisplayTypeLiveOptions;
  }
};

/**
 * 디스커버 섹션타입에 해당하는 디스플레이 타입 label 리턴
 */
const getDisplayTypeLabelBySectionType = (
  sectionType: DiscoverSectionType,
  displayType: DiscoverSectionDisplayType,
) => {
  const options = getDiscoverSectionDisplayTypeOptionsBySectionType(sectionType);
  const label = options.find((option) => option.value === displayType)?.label;

  return label ? `${label} (${DiscoverSectionDisplayTypeModeLabel[displayType]})` : '-';
};

/**
 * 디스커버 섹션타입에 해당하는 디스플레이 타입 디폴트 value 리턴
 */
export const getDisplayTypeDefaultBySectionType = (
  sectionType: DiscoverSectionType,
  displayType: DiscoverSectionDisplayType,
) => {
  const options = getDiscoverSectionDisplayTypeOptionsBySectionType(sectionType);
  const defaultValue = options.find((option) => option.value === displayType)?.defaultValue ?? '';

  return defaultValue;
};

/**
 * 디스커버 섹션 아이템 schema > 디스커버 섹션 아이템 model convert
 */
export const toDiscoverSectionItemModel = (
  item: DiscoverSectionItemSchema,
  index: number = 0,
): DiscoverSectionItemModel => {
  const openStatus = item.isOpen ? DiscoverSectionOpenStatus.OPEN : DiscoverSectionOpenStatus.CLOSE;
  return {
    ...item,
    sectionTypeText: DiscoverSectionTypeLabel[item.sectionType],
    displayTypeText: getDisplayTypeLabelBySectionType(item.sectionType, item.displayType),
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : '-',
    updatedDateText: item.updatedDate ? toDateFormat(item.updatedDate) : '-',
    openStatus,
    openStatusText: DiscoverSectionOpenStatusLabel[openStatus],
    openStatusClassName: openStatus.toLowerCase(),
    keyword: item.keyword ? toKeywordComboItemModel(item.keyword) : null,
    sortNum: index + 1,
    rowKey: item.id.toString(),
  };
};

/**
 * 디스커버 섹션 아이템 schema list => 디스커버 섹션 아이템 model list convert
 */
export const toDiscoverSectionListModel = (
  items: Array<DiscoverSectionItemSchema>,
): Array<DiscoverSectionItemModel> => {
  return items.map(toDiscoverSectionItemModel);
};

/**
 * 디스커버 섹션 form field > 디스커버 섹션 아이템 model list convert
 */
export const toDiscoverSectionCreateParams = ({
  title,
  sectionType,
  displayType,
  keyword,
}: DiscoverSectionCreateFormField): DiscoverSectionCreateParams => {
  return {
    title,
    sectionType: sectionType as DiscoverSectionType,
    displayType: displayType as DiscoverSectionDisplayType,
    keywordId: keyword ? keyword.value : null,
  };
};

/**
 * 디스커버 섹션 아이템 model => 디스커버 섹션 수정 form field convert
 */
export const toDiscoverSectionModifyFormField = (item: DiscoverSectionItemModel): DiscoverSectionModifyFormField => {
  return {
    isOpen: item.openStatus,
    keyword: item.keyword,
    title: item.title,
  };
};

/**
 * 디스커버 섹션 수정 form field > 디스커버 섹션 수정 params convert
 */
export const toDiscoverSectionModifyParams = (
  sectionId: string,
  item: DiscoverSectionModifyFormField,
): DiscoverSectionModifyParams => {
  return {
    sectionId,
    isOpen: item.isOpen === DiscoverSectionOpenStatus.OPEN,
    keywordId: item.keyword ? item.keyword.value : null,
    title: item.title,
  };
};

/**
 * 디스커버 섹션 아이템 model > 디스커버 섹션타입별 리스트 조회 params convert
 */
export const toDiscoverSectionTypeListParams = (
  item: DiscoverSectionItemModel,
  { page, limit }: PaginationProps,
): DiscoverSectionTypeListParams => {
  if (!item) {
    return null;
  }

  return {
    page,
    size: limit,
    displayType: item.displayType,
    keywordId: item.keyword ? item.keyword.value : null,
  };
};

/**
 * 디스커버 섹션 생성가능 타입 schema list > 디스커버 섹션 생성가능 타입 model list convert
 */
export const toDiscoverSectionCreatableTypeModelList = (items: Array<DiscoverSectionCreatableTypeSchema>) => {
  return items.reduce<Array<DiscoverSectionCreatableTypeModel>>((target, item) => {
    const options = getDiscoverSectionDisplayTypeOptionsBySectionType(item.sectionType);

    target.push({
      sectionType: item.sectionType,
      options: options.filter(
        (option) =>
          option.value === DiscoverSectionDisplayType.CURATION ||
          item.displayType.includes(option.value as DiscoverSectionDisplayType),
      ),
    });

    return target;
  }, []);
};
