import { toDateFormat } from '@utils/date';
import {
  MainShortcutLandingTypeLabel,
  SHORTCUT_DEFAULT_LIMIT,
  SHORTCUT_DEFAULT_PAGE,
  MainShortcutLandingSubTypeLabel,
  MainShortcutLandingMainType,
  MainShortcutLandingMainTypeLabel,
  PublishStatusLabel,
  MainShortcutDescriptionType,
  MainShortcutTitleType,
  MainShortcutVideoPlayType,
} from '../constants';
import { MainShortcutDetailSchema, MainShortcutLandingSchema, MainShortcutSchema } from '../schemas';
import {
  MainShortcutInfoParams,
  MainShortcutFormField,
  MainShortcutLandingInfoQueryParams,
  MainShortcutQueryState,
  MainShortcutListParams,
} from '../types';
import { ImageModel, MediaModel, toImageModel, toMediaModel } from './CommonModel';

/**
 * 숏컷 배너 랜딩정보 model
 */
export interface MainShortcutLandingModel extends MainShortcutLandingSchema {
  typeText: string;
  idText: string;
}

/**
 * 숏컷 배너 model
 */
export interface MainShortcutModel extends Omit<MainShortcutSchema, 'media' | 'landingInfo'> {
  publishStartDateText: string;
  publishEndDateText: string;
  media: MediaModel;
  landingInfo: MainShortcutLandingModel;
  statusText: string;
  contentsLink: string;
}

/**
 * 숏컷 배너 랜딩정보 model
 */
export interface MainShortcutLandingInfoModel {
  label: string;
  success: boolean;
  referenceId: number;
}

/**
 * 숏컷 배너 랜딩정보 schema => 숏컷 배너 랜딩정보 model convert
 */
export const toMainShortcutLandingModel = (item: MainShortcutLandingSchema): MainShortcutLandingModel => {
  if (!item) {
    return null;
  }
  const idText = item.referenceId ? ` (ID: ${item.referenceId})` : '';
  return {
    ...item,
    typeText: MainShortcutLandingTypeLabel[item.type],
    idText,
  };
};

/**
 * 숏컷 배너 schema => 숏컷 배너 model convert
 */
export const toMainShortcutModel = (item: MainShortcutSchema): MainShortcutModel => {
  return {
    ...item,
    publishStartDateText: item.publishStartDate ? toDateFormat(item.publishStartDate) : '-',
    publishEndDateText: item.publishEndDate ? toDateFormat(item.publishEndDate) : '-',
    media: toMediaModel(item.media),
    landingInfo: toMainShortcutLandingModel(item.landingInfo),
    statusText: PublishStatusLabel[item.status],
    contentsLink: item.id ? `/display/home/shortcut/${item.id}` : null,
  };
};

/**
 * 숏컷 배너 랜딩정보 schema => 숏컷 배너 랜딩정보 model convert
 */
export const toMainShortcutLandingInfoModel = (item: MainShortcutLandingSchema): MainShortcutLandingInfoModel => {
  const [landingType, landingSubType] = item.type.split('_');
  const landingSubTypeLabel = landingSubType ? `(${MainShortcutLandingSubTypeLabel[landingSubType]})` : '';
  const showroomLabel = item.showRoomName ? ` (쇼룸: ${item.showRoomName})` : '';
  return {
    label: `[${MainShortcutLandingMainTypeLabel[landingType]}${landingSubTypeLabel}] ${item.name}${showroomLabel}`,
    success: true,
    referenceId: item.referenceId,
  };
};

/**
 * 숏컷 배너 리스트 schema => 숏컷 배너 리스트 model convert
 */
export const toMainShortcutListModel = (items: Array<MainShortcutSchema>): Array<MainShortcutModel> => {
  return items.map(toMainShortcutModel);
};

/**
 * 숏컷 배너 query state => 숏컷 배너 list params convert
 */
export const toMainShortcutListParams = (item: MainShortcutQueryState): MainShortcutListParams => {
  return {
    page: item.page ?? SHORTCUT_DEFAULT_PAGE.toString(),
    limit: item.limit ?? SHORTCUT_DEFAULT_LIMIT.toString(),
  };
};

/**
 * 숏컷 배너 상세 model
 */
export interface MainShortcutDetailModel
  extends Omit<
    MainShortcutDetailSchema,
    'publishStartDate' | 'publishEndDate' | 'items' | 'media' | 'mediaThumbnail' | 'titleImage'
  > {
  publishStartDate: string;
  publishEndDate: string;
  media: MediaModel;
  mediaThumbnail: ImageModel;
  titleImage: ImageModel;
}

/**
 * 랜딩타입 리턴
 */
const getLandingType = (item: MainShortcutFormField) => {
  switch (item.landingType) {
    case MainShortcutLandingMainType.CONTENTS:
      return `${MainShortcutLandingMainType.CONTENTS}_${item.landingSubType}`;

    default:
      return item.landingType;
  }
};

/**
 * 타이틀 이미지 id 리턴
 */
const getTitleImageId = (item: MainShortcutFormField) => {
  switch (item.titleType) {
    case MainShortcutTitleType.SVG:
      return Number(item.titleImageSvgId);
    case MainShortcutTitleType.LOTTIE:
      return Number(item.titleImageLottieId);

    default:
      return null;
  }
};

/**
 * 숏컷 배너 form field => 숏컷 배너 랜딩정보 조회 params convert
 */
export const toMainShortcutLandingInfoQueryParams = (
  item: MainShortcutFormField,
): MainShortcutLandingInfoQueryParams => {
  return {
    landingType: getLandingType(item),
    referenceId: Number(item.referenceId),
  };
};

/**
 * 숏컷 배너 form field => 숏컷 배너 랜딩정보 등록 params convert
 */
export const toMainShortcutInfoParams = (
  item: MainShortcutFormField,
  isVideoMediaType: boolean,
): MainShortcutInfoParams => {
  return {
    referenceId: Number(item.referenceId),
    landingType: getLandingType(item),
    mediaId: Number(item.mediaId),
    mediaThumbnailId: isVideoMediaType ? Number(item.mediaThumbnailId) : null,
    publishEndDate: new Date(item.publishEndDate).getTime(),
    publishStartDate: new Date(item.publishStartDate).getTime(),
    description: item.descriptionType === MainShortcutDescriptionType.TEXT ? item.description : null,
    openDescription: item.descriptionType === MainShortcutDescriptionType.TEXT,
    title: item.title,
    titleType: item.titleType as MainShortcutTitleType,
    titleImageId: getTitleImageId(item),
    videoRepeatType: isVideoMediaType
      ? (item.videoRepeatType as MainShortcutVideoPlayType)
      : MainShortcutVideoPlayType.ONCE,
    sortNum: Number(item.sortNum),
  };
};

/**
 * 숏컷 배너 상세 schema => 숏컷 배너 상세 model convert
 */
export const toMainShortcutDetailModel = (item: MainShortcutDetailSchema): MainShortcutDetailModel => {
  return {
    ...item,
    publishStartDate: item.publishStartDate ? toDateFormat(Number(item.publishStartDate), `yyyy-MM-dd'T'HH:mm`) : null,
    publishEndDate: item.publishEndDate ? toDateFormat(Number(item.publishEndDate), `yyyy-MM-dd'T'HH:mm`) : null,
    media: toMediaModel(item.media),
    mediaThumbnail: toImageModel(item.mediaThumbnail),
    titleImage: toImageModel(item.titleImage),
  };
};

/**
 * 숏컷 배너 상세 model => 숏컷 배너 form field convert
 */
export const toMainShortcutFormField = (item: MainShortcutDetailModel): MainShortcutFormField => {
  const [landingType, landingSubType = ''] = item.landingInfo.type.split('_');
  return {
    referenceId: item.landingInfo.referenceId ? item.landingInfo.referenceId.toString() : '',
    landingType,
    landingSubType,
    publishStartDate: item.publishStartDate,
    publishEndDate: item.publishEndDate,
    mediaId: item.media ? item.media.id.toString() : '',
    description: item.description,
    descriptionType: item.openDescription ? MainShortcutDescriptionType.TEXT : MainShortcutDescriptionType.NONE,
    title: item.title,
    sortNum: String(item.sortNum),
    titleImageSvgId:
      item.titleImage && item.titleType === MainShortcutTitleType.SVG ? item.titleImage.id.toString() : '',
    titleImageLottieId:
      item.titleImage && item.titleType === MainShortcutTitleType.LOTTIE ? item.titleImage.id.toString() : '',
    titleType: item.titleType,
    videoRepeatType: item.videoRepeatType,
    mediaThumbnailId: item.mediaThumbnail ? item.mediaThumbnail.id.toString() : '',
  };
};
