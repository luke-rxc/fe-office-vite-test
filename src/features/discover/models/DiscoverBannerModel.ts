import { toDateFormat } from '@utils/date';
import {
  BANNER_DEFAULT_LIMIT,
  BANNER_DEFAULT_PAGE,
  DiscoverLandingSubTypeLabel,
  DiscoverLandingType,
  DiscoverLandingTypeLabel,
  PublishStatusLabel,
} from '../constants';
import { DiscoverBannerDetailSchema, DiscoverBannerLandingInfoSchema, DiscoverBannerSchema } from '../schemas';
import {
  DiscoverBannerInfoParams,
  DiscoverBannerFormField,
  DiscoverBannerLandingInfoQueryParams,
  DiscoverBannerQueryState,
  DiscoverBannerListParams,
} from '../types';
import { ImageModel, toImageModel } from './CommonModel';
import { GoodsModel, toGoodsListModel } from './GoodsModel';

/**
 * 디스커버 배너 model
 */
export interface DiscoverBannerModel extends DiscoverBannerSchema {
  publishStartDateText: string;
  publishEndDateText: string;
  primaryImageFile: ImageModel;
  statusText: string;
  contentsLink: string;
  landingTypeText: string;
}

/**
 * 디스커버 배너 랜딩정보 model
 */
export interface DiscoverBannerLandingInfoModel {
  label: string;
  success: boolean;
  referenceId: number;
}

/**
 * 디스커버 배너 상세 model
 */
export interface DiscoverBannerDetailModel
  extends Omit<DiscoverBannerDetailSchema, 'publishStartDate' | 'publishEndDate' | 'items'> {
  publishStartDate: string;
  publishEndDate: string;
  primaryImageFile: ImageModel;
  items: Array<GoodsModel>;
}

/**
 * 디스커버 배너 schema => 디스커버 배너 model convert
 */
export const toDiscoverBannerModel = (item: DiscoverBannerSchema): DiscoverBannerModel => {
  const [landingType, landingSubType = null] = item.landingType.split('_');
  const landingSubTypeLabel = landingSubType ? `(${DiscoverLandingSubTypeLabel[landingSubType]})` : '';

  return {
    ...item,
    publishStartDateText: item.publishStartDate ? toDateFormat(item.publishStartDate) : '-',
    publishEndDateText: item.publishEndDate ? toDateFormat(item.publishEndDate) : '-',
    primaryImageFile: toImageModel(item.primaryImageFile),
    statusText: PublishStatusLabel[item.status],
    contentsLink: item.id ? `/display/discover/banner/${item.id}` : null,
    landingTypeText: `${DiscoverLandingTypeLabel[landingType]}${landingSubTypeLabel}`,
  };
};

/**
 * 디스커버 배너 리스트 schema => 디스커버 배너 리스트 model convert
 */
export const toDiscoverBannerListModel = (items: Array<DiscoverBannerSchema>): Array<DiscoverBannerModel> => {
  return items.map(toDiscoverBannerModel);
};

/**
 * 디스커버 배너 랜딩정보 schema => 디스커버 배너 랜딩정보 model convert
 */
export const toDiscoverBannerLandingInfoModel = (
  item: DiscoverBannerLandingInfoSchema,
): DiscoverBannerLandingInfoModel => {
  const [landingType, landingSubType] = item.type.split('_');
  const landingSubTypeLabel = landingSubType ? `(${DiscoverLandingSubTypeLabel[landingSubType]})` : '';
  const showroomLabel = item.showRoomName ? ` (쇼룸: ${item.showRoomName})` : '';
  return {
    label: `[${DiscoverLandingTypeLabel[landingType]}${landingSubTypeLabel}] ${item.name}${showroomLabel}`,
    success: true,
    referenceId: item.referenceId,
  };
};

/**
 * 랜딩타입 리턴
 */
const getLandingType = (item: DiscoverBannerFormField) => {
  switch (item.landingType) {
    case DiscoverLandingType.CONTENTS:
      return `${DiscoverLandingType.CONTENTS}_${item.landingSubType}`;

    default:
      return item.landingType;
  }
};

/**
 * 디스커버 배너 form field => 디스커버 배너 랜딩정보 조회 params convert
 */
export const toDiscoverBannerLandingInfoQueryParams = (
  item: DiscoverBannerFormField,
): DiscoverBannerLandingInfoQueryParams => {
  return {
    landingType: getLandingType(item),
    referenceId: Number(item.landingRefId),
  };
};

/**
 * 디스커버 배너 form field => 디스커버 배너 랜딩정보 등록 params convert
 */
export const toDiscoverBannerInfoParams = (
  item: DiscoverBannerFormField,
  goodsList: Array<GoodsModel>,
): DiscoverBannerInfoParams => {
  return {
    landingRefId: Number(item.landingRefId),
    landingType: getLandingType(item),
    primaryImageFileId: Number(item.primaryImageFileId),
    publishEndDate: new Date(item.publishEndDate).getTime(),
    publishStartDate: new Date(item.publishStartDate).getTime(),
    subTitle: item.subTitle,
    title: item.title,
    items: goodsList.map(({ goodsId, sortNum }) => {
      return {
        goodsId,
        sortNum,
      };
    }),
  };
};

/**
 * 디스커버 배너 상세 schema => 디스커버 배너 상세 model convert
 */
export const toDiscoverBannerDetailModel = (item: DiscoverBannerDetailSchema): DiscoverBannerDetailModel => {
  return {
    ...item,
    publishStartDate: item.publishStartDate ? toDateFormat(Number(item.publishStartDate), `yyyy-MM-dd'T'HH:mm`) : null,
    publishEndDate: item.publishEndDate ? toDateFormat(Number(item.publishEndDate), `yyyy-MM-dd'T'HH:mm`) : null,
    primaryImageFile: toImageModel(item.primaryImageFile),
    items: item.items ? toGoodsListModel(item.items) : null,
  };
};

/**
 * 디스커버 배너 상세 model => 디스커버 배너 form field convert
 */
export const toDiscoverBannerFormField = (item: DiscoverBannerDetailModel): DiscoverBannerFormField => {
  const [landingType, landingSubType = ''] = item.landingType.split('_');
  return {
    landingRefId: item.landingRefId ? item.landingRefId.toString() : '',
    landingType,
    landingSubType,
    publishStartDate: item.publishStartDate,
    publishEndDate: item.publishEndDate,
    primaryImageFileId: item.primaryImageFile ? item.primaryImageFile.id.toString() : '',
    subTitle: item.subTitle,
    title: item.title,
  };
};

export const toDiscoverBannerListParams = (item: DiscoverBannerQueryState): DiscoverBannerListParams => {
  return {
    page: item.page ?? BANNER_DEFAULT_PAGE.toString(),
    limit: item.limit ?? BANNER_DEFAULT_LIMIT.toString(),
  };
};
