import { pathConfig } from '@config';
import { toDateFormat } from '@utils/date';
import { getDay } from 'date-fns';
import { LiveContentsTypeLabel, PrizmBaseScheme, SchedulingStatus, DayTitles } from '../constants';
import {
  ContentsImageSchema,
  LiveContentsDetailSchema,
  ScheduleTableDetailBannerGoodsSchema,
  ScheduleTableDetailItemSchema,
  ScheduleTableItemSchema,
  ShowRoomSchema,
} from '../schemas';
import { ScheduleModifyForm, ScheduleModifyParams } from '../types';

export interface ContentsImageModel extends ContentsImageSchema {
  fullPath: string;
}

export interface ShowRoomModel extends ShowRoomSchema {}

/**
 * 편성표 item model
 */
export interface ScheduleTableItemModel extends ScheduleTableItemSchema {
  scheduleDateText: string;
  scheduleWeekday: number;
  showRoom: ShowRoomModel;
  liveInfo: string;
}

/**
 * 편성표 요일 model
 */
export interface ScheduleTableWeekDayModel {
  title: string;
  weekdayText: string;
  items: Array<ScheduleTableItemModel>;
}

export interface LiveContentsDetailModel extends LiveContentsDetailSchema {
  contentsTypeText: string;
  liveStartDateText: string;
  liveContentsPath: string;
  showRoomName: string;
  guestShowRoomNames: string;
}

export interface ScheduleTableDetailBannerGoodsModel extends ScheduleTableDetailBannerGoodsSchema {
  consumerPriceText: string;
  priceText: string;
  primaryImage: ContentsImageModel;
}

/**
 * 편성표 상세 item model
 */
export interface ScheduleTableDetailItemModel extends ScheduleTableDetailItemSchema {
  liveContents: LiveContentsDetailModel;
  bannerGoodsList: Array<ScheduleTableDetailBannerGoodsModel>;
  bgImage: ContentsImageModel;
  chromakeyImage: ContentsImageModel;
  bannerImage1: ContentsImageModel;
  bannerImage2: ContentsImageModel;
  bannerImage3: ContentsImageModel;
  followerCountText: string;
}

/**
 * 쇼룸 schema > 쇼룸 model convert
 */
export const toShowRoomModel = (item: ShowRoomSchema): ShowRoomModel => {
  return {
    ...item,
    primaryImage: item.primaryImage
      ? {
          ...item.primaryImage,
          path: `${pathConfig.cdnUrl}/${item.primaryImage.path}?im=Resize,width=192`,
        }
      : null,
  };
};

/**
 * 편성표 item schema > 편성표 item model convert
 */
export const toScheduleTableItemModel = (item: ScheduleTableItemSchema): ScheduleTableItemModel => {
  return {
    ...item,
    showRoom: toShowRoomModel(item.showRoom),
    scheduleDateText: toDateFormat(item.scheduleDate, 'a h:mm').replace('AM', '오전').replace('PM', '오후'),
    scheduleWeekday: getDay(item.scheduleDate),
    liveInfo: `${item.liveContents.id} | ${LiveContentsTypeLabel[item.liveContents.contentsType]}`,
  };
};

/**
 * 편성표 items schema > 편성표 items model convert
 */
export const toScheduleTableItemsModel = (items: Array<ScheduleTableItemSchema>): Array<ScheduleTableItemModel> => {
  return items.map(toScheduleTableItemModel);
};

/**
 * 편성표 items schema > 편성표 요일 model convert
 */
export const toScheduleTableWeekDaysModel = (
  items: Array<ScheduleTableItemSchema>,
  weekDates: Array<string>,
): Array<ScheduleTableWeekDayModel> => {
  const convertItems = toScheduleTableItemsModel(items);
  return DayTitles.reduce<Array<ScheduleTableWeekDayModel>>((target, { title, weekday }, index) => {
    const items = convertItems.filter((item) => item.scheduleWeekday === weekday);
    target.push({
      title,
      weekdayText: weekDates[index],
      items,
    });
    return target;
  }, [] as Array<ScheduleTableWeekDayModel>);
};

/**
 * 라이브 콘텐츠 상세 schema > 라이브 콘텐츠 상세  model convert
 */
export const toLiveContentsDetailModel = (item: LiveContentsDetailSchema): LiveContentsDetailModel => {
  return {
    ...item,
    contentsTypeText: LiveContentsTypeLabel[item.contentsType],
    liveStartDateText: toDateFormat(item.liveStartDate),
    liveContentsPath: `/showtime/contents/${item.id}`,
    showRoomName: `${item.showRoom.name} (${item.showRoom.id})`,
    guestShowRoomNames: item.guestShowRoomList.map((item) => `${item.name}(${item.id})`).join(', '),
  };
};

/**
 * ContentsImage convert
 */
export const toContentImageModel = (item: ContentsImageSchema): ContentsImageModel => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    fullPath: item.path ? `${pathConfig.cdnUrl}/${item.path}` : '',
  };
};

/**
 * 편성표 상세 배너상품 schema > 편성표 상세 배너상품 model convert
 */
export const toScheduleTableDetailBannerGoodsModel = (
  item: ScheduleTableDetailBannerGoodsSchema,
): ScheduleTableDetailBannerGoodsModel => {
  return {
    ...item,
    consumerPriceText: `${item.consumerPrice.price.toLocaleString()} 원`,
    priceText: `${item.price.price.toLocaleString()} 원`,
    primaryImage: toContentImageModel(item.primaryImage),
  };
};

/**
 * 편성표 상세 배너상품 schema list > 편성표 상세 배너상품 model list convert
 */
export const toScheduleTableDetailBannerGoodsModelList = (
  items: Array<ScheduleTableDetailBannerGoodsSchema>,
): Array<ScheduleTableDetailBannerGoodsModel> => {
  return items.map(toScheduleTableDetailBannerGoodsModel);
};

/**
 * 편성표 상세 item schema > 편성표 상세 item model convert
 */
export const toScheduleTableDetailItemModel = (item: ScheduleTableDetailItemSchema): ScheduleTableDetailItemModel => {
  return {
    ...item,
    liveContents: toLiveContentsDetailModel(item.liveContents),
    bannerGoodsList: toScheduleTableDetailBannerGoodsModelList(item.bannerGoodsList),
    bgImage: toContentImageModel(item.bgImage),
    chromakeyImage: toContentImageModel(item.chromakeyImage),
    bannerImage1: toContentImageModel(item.bannerImage1),
    bannerImage2: toContentImageModel(item.bannerImage2),
    bannerImage3: toContentImageModel(item.bannerImage3),
    bannerScheme: item.bannerScheme ? item.bannerScheme.replace(PrizmBaseScheme, '') : null,
    followerCountText: `${item.followerCount.toLocaleString()} 명`,
  };
};

/**
 * 편성표 상세 item model > 편성표 수정 form convert
 */
export const toScheduleModifyForm = (
  item: ScheduleTableDetailItemModel,
  defaultFormValues: ScheduleModifyForm,
): ScheduleModifyForm => {
  return {
    title: item.title ?? defaultFormValues.title,
    subtitle: item.subtitle ?? defaultFormValues.subtitle,
    bgColor: item.bgColor ?? defaultFormValues.bgColor,
    landingType: item.landingType ?? defaultFormValues.landingType,
    landingStoryId: item.landingStoryId ? String(item.landingStoryId) : defaultFormValues.landingStoryId,
    benefits: item.benefits ?? defaultFormValues.benefits,
    bannerType: item.bannerType ?? defaultFormValues.bannerType,
    scheduling: item.scheduled ? SchedulingStatus.OPENED : SchedulingStatus.CLOSED,
    bgImageId: item.bgImage?.id?.toString() ?? defaultFormValues.bgImageId,
    chromakeyImageId: item.chromakeyImage?.id?.toString() ?? defaultFormValues.chromakeyImageId,
    bannerButtonText: item.bannerButtonText ?? defaultFormValues.bannerButtonText,
    bannerScheme: item.bannerScheme ?? defaultFormValues.bannerScheme,
    bannerImageId: item.bannerImage1?.id ? String(item.bannerImage1.id) : defaultFormValues.bannerImageId,
    bannerImage1Id: item.bannerImage1?.id ? String(item.bannerImage1.id) : defaultFormValues.bannerImage1Id,
    bannerImage2Id: item.bannerImage2?.id ? String(item.bannerImage2.id) : defaultFormValues.bannerImage2Id,
    bannerImage3Id: item.bannerImage3?.id ? String(item.bannerImage3.id) : defaultFormValues.bannerImage3Id,
  };
};

/**
 * 편성표 수정 form > 편성표 수정 params convert
 */
export const toScheduleModifyParams = (id: number, item: ScheduleModifyForm): ScheduleModifyParams => {
  return {
    ...item,
    bgImageId: item.bgImageId ? Number(item.bgImageId) : null,
    chromakeyImageId: item.chromakeyImageId ? Number(item.chromakeyImageId) : null,
    landingStoryId: item.landingStoryId ? Number(item.landingStoryId) : null,
    scheduling: item.scheduling === SchedulingStatus.OPENED,
    bannerButtonText: item.bannerButtonText ?? null,
    bannerImage1Id: item.bannerImage1Id ? Number(item.bannerImage1Id) : null,
    bannerImage2Id: item.bannerImage2Id ? Number(item.bannerImage2Id) : null,
    bannerImage3Id: item.bannerImage3Id ? Number(item.bannerImage3Id) : null,
    bannerScheme: item.bannerScheme ? `${PrizmBaseScheme}${item.bannerScheme}` : null,
    id,
  };
};
