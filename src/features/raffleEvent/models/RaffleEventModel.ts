import { pathConfig } from '@config';
import { UploadFileType } from '@services/useFileUploader';
import { toDateFormat } from '@utils/date';
import {
  AllowDuplicateWinnerType,
  defaultSearchPage,
  defaultSearchSize,
  EnterDrawConditionType,
  EnterDrawPeriodType,
  RaffleEventBroadcastStatus,
  RaffleEventBroadcastStatusLabel,
  RaffleEventListSearchField,
  WinnerConditionType,
} from '../constants';
import {
  ImageSchema,
  LiveSchema,
  MediaSchema,
  RaffleEventDetailItemSchema,
  RaffleEventListItemLiveSchema,
  RaffleEventListItemSchema,
  RaffleEventListItemShowroomSchema,
  RaffleEventTimesSchema,
  ShowroomSchema,
} from '../schemas';
import {
  RaffleEventListQueryState,
  RaffleEventListSearchParams,
  RaffleEventListSearchFormField,
  RaffleEventCreateFormField,
  RaffleEventCreateParams,
  RaffleEventDetailFormField,
  RaffleEventDetailTimesField,
  RaffleEventSaveParams,
  RaffleEventSaveTimesItemParams,
} from '../types';
import { LiveComboItemModel } from './LiveModel';
import { ShowroomComboItemModel } from './ShowroomModel';

/**
 * image model
 */
export interface ImageModel extends ImageSchema {
  fullPath: string;
}

/**
 * image model
 */
export interface MediaModel extends MediaSchema {
  fullPath: string;
  thumbnailImage: ImageModel;
}

/**
 * 래플 이벤트 리스트 item showroom model
 */
export interface RaffleEventListItemShowroomModel extends RaffleEventListItemShowroomSchema {
  primaryImage: ImageModel | null;
  info: string;
}

/**
 * 래플 이벤트 리스트 item live model
 */
export interface RaffleEventListItemLiveModel extends RaffleEventListItemLiveSchema {
  liveStartDateText: string;
  broadcastStatusText: string;
  broadcastStatusClassName: string;
  showRoom: RaffleEventListItemShowroomModel;
}

/**
 * 래플 이벤트 리스트 item model
 */
export interface RaffleEventListItemModel extends RaffleEventListItemSchema {
  live: RaffleEventListItemLiveModel;
  rowKey: string;
  itemCountText: string;
}

/**
 * 쇼룸 model
 */
export interface ShowroomModel extends ShowroomSchema {
  primaryImage: ImageModel;
}

/**
 * 라이브 model
 */
export interface LiveModel extends LiveSchema {
  liveStartDateText: string;
  broadcastStatusText: string;
  showRoom: ShowroomModel;
}

/**
 * 래플 이벤트 회차 model
 */
export interface RaffleEventTimesModel
  extends Omit<RaffleEventTimesSchema, 'allowDuplicateWinner' | 'enterDrawPeriod' | 'showRoomList'> {
  allowDuplicateWinner: AllowDuplicateWinnerType;
  enterDrawEndDateText: string;
  enterDrawPeriod: EnterDrawPeriodType;
  enterDrawStartDateText: string;
  goodsImage: ImageModel;
  goodsMedia: MediaModel;
  fileType: UploadFileType;
  goodsMediaChromaKey: boolean;
  showRoomList: Array<ShowroomComboItemModel>;
}

/**
 * 래플 이벤트 상세 item model
 */
export interface RaffleEventDetailItemModel extends Omit<RaffleEventDetailItemSchema, 'itemList'> {
  itemList: Array<RaffleEventTimesModel>;
  live: LiveModel;
}

/**
 * common convert
 */

/**
 * image schema > image model convert
 */
export const toImageModel = (item: ImageSchema | null): ImageModel => {
  if (item === null) {
    return null;
  }

  return {
    ...item,
    fullPath: item.path ? `${pathConfig.cdnUrl}/${item.path}` : null,
  };
};

/**
 * media schema > media model convert
 */
export const toMediaModel = (item: MediaSchema | null): MediaModel => {
  if (item === null) {
    return null;
  }

  return {
    ...item,
    fullPath: item.path ? `${pathConfig.cdnUrl}/${item.path}` : null,
    thumbnailImage: toImageModel(item.thumbnailImage),
  };
};

/**
 * 래플 이벤트 리스트 convert
 */

/**
 * 래플 이벤트 리스트 item showroom schema > 래플 이벤트 리스트 item showroom model convert
 */
export const toRaffleEventListItemShowroomModel = (
  item: RaffleEventListItemShowroomSchema,
): RaffleEventListItemShowroomModel => {
  return {
    ...item,
    primaryImage: toImageModel(item.primaryImage),
    info: `${item.name} (${item.id})`,
  };
};

/**
 * 래플 이벤트 리스트 item live schema > 래플 이벤트 리스트 item live model convert
 */
export const toRaffleEventListItemLiveModel = (item: RaffleEventListItemLiveSchema): RaffleEventListItemLiveModel => {
  const isTargetStatus =
    item.broadcastStatus === RaffleEventBroadcastStatus.NONE || item.broadcastStatus === RaffleEventBroadcastStatus.END;
  return {
    ...item,
    liveStartDateText: toDateFormat(item.liveStartDate, 'yyyy/MM/dd HH:mm:ss'),
    broadcastStatusText: isTargetStatus ? RaffleEventBroadcastStatusLabel[item.broadcastStatus] : '진행중',
    broadcastStatusClassName: isTargetStatus ? item.broadcastStatus.toLowerCase() : 'live',
    showRoom: toRaffleEventListItemShowroomModel(item.showRoom),
  };
};

/**
 * 래플 이벤트 리스트 item schema > 래플 이벤트 리스트 item model convert
 */
export const toRaffleEventListItemModel = (item: RaffleEventListItemSchema): RaffleEventListItemModel => {
  return {
    ...item,
    live: toRaffleEventListItemLiveModel(item.live),
    itemCountText: `${item.itemCount}회`,
    rowKey: `raffle-${item.id}`,
  };
};

/**
 * 래플 이벤트 리스트 schema > 래플 이벤트 리스트 model convert
 */
export const toRaffleEventListModel = (items: Array<RaffleEventListItemSchema>): Array<RaffleEventListItemModel> => {
  return items.map(toRaffleEventListItemModel);
};

/**
 * 래플 이벤트 리스트 query string state > 래플 이벤트 검색 form field convert
 */
export const toRaffleEventListSearchFormFieldByQueryState = (
  item: RaffleEventListQueryState,
  defaultFormValues: RaffleEventListSearchFormField,
): RaffleEventListSearchFormField => {
  return {
    searchField: item.searchField ?? defaultFormValues.searchField,
    keyword: item.keyword ?? defaultFormValues.keyword,
    startDate: Number.isInteger(Number(item.startDate)) ? Number(item.startDate) : '',
    endDate: Number.isInteger(Number(item.endDate)) ? Number(item.endDate) : '',
  };
};

/**
 * 래플 이벤트 리스트 query string state > 래플 이벤트 리스트 검색 params convert
 */
export const toRaffleEventListSearchParamsByQueryState = (
  item: RaffleEventListQueryState,
  defaultFormValues: RaffleEventListSearchFormField,
): RaffleEventListSearchParams => {
  const formFiled = toRaffleEventListSearchFormFieldByQueryState(item, defaultFormValues);

  return {
    page: item.page || defaultSearchPage,
    size: item.size || defaultSearchSize,
    searchField: (item.searchField || formFiled.searchField) as unknown as RaffleEventListSearchField,
    keyword: item.keyword || formFiled.keyword,
    startDate: Number.isInteger(Number(item.startDate)) ? Number(item.startDate) : null,
    endDate: Number.isInteger(Number(item.endDate)) ? Number(item.endDate) : null,
  };
};

/**
 * 래플 이벤트 검색 form field > 래플 이벤트 리스트 query string state convert
 */
export const toRaffleEventSearchQueryStateByFormField = (
  formField: RaffleEventListSearchFormField,
  currentQueryState: RaffleEventListQueryState,
): RaffleEventListQueryState => {
  return {
    ...currentQueryState,
    ...formField,
    startDate: formField.startDate ? formField.startDate.toString() : '',
    endDate: formField.endDate ? formField.endDate.toString() : '',
  };
};

/**
 * 래플 이벤트 생성 form field => 래플 이벤트 생성 param convert
 */
export const toRaffleEventCreateParams = ({
  eventName: name,
  liveItem,
}: RaffleEventCreateFormField): RaffleEventCreateParams => {
  return {
    name,
    liveId: Number(liveItem.value),
  };
};

/**
 * 래플 이벤트 상세 convert
 */

/**
 * 쇼룸 schema > 쇼룸 model convert
 */
export const toShowroomModel = (item: ShowroomSchema): ShowroomModel => {
  return {
    ...item,
    primaryImage: toImageModel(item.primaryImage),
  };
};

/**
 * 쇼룸 list schema > 쇼룸 list model convert
 */
export const toShowroomListModel = (items: Array<ShowroomSchema>): Array<ShowroomModel> => {
  return items.map(toShowroomModel);
};

/**
 * 래플 이벤트 상세 convert
 */

/**
 * 쇼룸 list schema > 쇼룸 combo list model convert
 */
export const toShowroomComboListModel = (items: Array<ShowroomSchema>): Array<ShowroomComboItemModel> => {
  return items.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
};

/**
 * 쇼룸 schema > 쇼룸 model convert
 */
export const toLiveModel = (item: LiveSchema): LiveModel => {
  const isTargetStatus =
    item.broadcastStatus === RaffleEventBroadcastStatus.NONE || item.broadcastStatus === RaffleEventBroadcastStatus.END;
  return {
    ...item,
    liveStartDateText: item.liveStartDate ? toDateFormat(item.liveStartDate, 'yyyy-MM-dd HH:mm') : '',
    broadcastStatusText: isTargetStatus ? RaffleEventBroadcastStatusLabel[item.broadcastStatus] : '진행중',
    showRoom: toShowroomModel(item.showRoom),
  };
};

/**
 * 래플 이벤트 회차 schema > 래플 이벤트 회차 model convert
 */
export const toRaffleEventTimesModel = (item: RaffleEventTimesSchema): RaffleEventTimesModel => {
  const fileType = item.goodsMedia ? UploadFileType.VIDEO : item.goodsImage ? UploadFileType.IMAGE : UploadFileType.ETC;
  return {
    ...item,
    allowDuplicateWinner: item.allowDuplicateWinner ? AllowDuplicateWinnerType.ALLOW : AllowDuplicateWinnerType.DENY,
    enterDrawPeriod: item.enterDrawPeriod ? EnterDrawPeriodType.SETUP : EnterDrawPeriodType.NOTSET,
    fileType,
    goodsImage: toImageModel(item.goodsImage),
    goodsMedia: toMediaModel(item.goodsMedia),
    enterDrawEndDateText: item.enterDrawEndDate ? toDateFormat(item.enterDrawEndDate, 'yyyy-MM-dd HH:mm') : '',
    enterDrawStartDateText: item.enterDrawStartDate ? toDateFormat(item.enterDrawStartDate, 'yyyy-MM-dd HH:mm') : '',
    showRoomList: toShowroomComboListModel(item.showRoomList),
    goodsMediaChromaKey: Boolean(item.goodsMediaChromaKey),
  };
};

/**
 * 래플 이벤트 회차 list schema > 래플 이벤트 회차 list model convert
 */
export const toRaffleEventTimesListModel = (items: Array<RaffleEventTimesSchema>): Array<RaffleEventTimesModel> => {
  return items.map(toRaffleEventTimesModel);
};

/**
 * 래플 이벤트 상세 item schema > 래플 이벤트 상세 item model convert
 */
export const toRaffleEventDetailItemModel = (item: RaffleEventDetailItemSchema): RaffleEventDetailItemModel => {
  return {
    ...item,
    itemList: toRaffleEventTimesListModel(item.itemList),
    live: toLiveModel(item.live),
  };
};

/**
 * 래플 이벤트 회차 model > 래플 이벤트 회차 form field convert
 */
export const toRaffleEventDetailTimesField = (item: RaffleEventTimesModel): RaffleEventDetailTimesField => {
  const mediaId = item.goodsMedia
    ? item.goodsMedia.id.toString()
    : item.goodsImage
    ? item.goodsImage.id.toString()
    : '';

  return {
    enterDrawConditionType: item.enterDrawConditionType || EnterDrawConditionType.SHOW_ROOM_FOLLOWER,
    winnerConditionType: item.winnerConditionType || WinnerConditionType.LIVE_AUDIENCE,
    allowDuplicateWinner: item.allowDuplicateWinner || AllowDuplicateWinnerType.DENY,
    winnerCount: item.winnerCount || 0,
    mediaId,
    fileType: item.fileType,
    itemId: item.id,
    targetUserCount: item.targetUserCount,
    showRoomIdList: item.showRoomList,
    enterDrawPeriod: item.enterDrawPeriod,
    enterDrawStartDate: item.enterDrawStartDateText || undefined,
    enterDrawEndDate: item.enterDrawEndDateText || undefined,
    mediaChromakey: item.goodsMediaChromaKey,
    landingUrl: item.landingUrl || '',
  };
};

/**
 * 래플 이벤트 회차 model list > 래플 이벤트 회차 list form field convert
 */
export const toRaffleEventDetailTimesFieldList = (items: Array<RaffleEventTimesModel>) => {
  return items.map(toRaffleEventDetailTimesField);
};

/**
 * 래플 이벤트 상세 item model > 래플 이벤트 상세 form field convert
 */
export const toRaffleEventDetailFormFieldByItemModel = (
  item: RaffleEventDetailItemModel,
  liveComboList: Array<LiveComboItemModel>,
): RaffleEventDetailFormField => {
  const {
    id,
    name,
    live: { id: liveId },
    itemList,
  } = item;
  return {
    id,
    name,
    liveItem: liveComboList.find((item) => Number(item.value) === liveId),
    itemList: toRaffleEventDetailTimesFieldList(itemList),
  };
};

/**
 * 래플 이벤트 회차 form field > 래플 이벤트 저장 회차 item params convert (by EnterDrawConditionType)
 */
export const toRaffleEventSaveTimesItemParamsByEnterDrawConditionType = ({
  enterDrawConditionType,
  showRoomIdList,
  enterDrawPeriod,
  enterDrawStartDate,
  enterDrawEndDate,
}: RaffleEventDetailTimesField): Pick<
  RaffleEventSaveTimesItemParams,
  'showRoomIdList' | 'enterDrawPeriod' | 'enterDrawStartDate' | 'enterDrawEndDate'
> => {
  switch (enterDrawConditionType) {
    case EnterDrawConditionType.SHOW_ROOM_FOLLOWER:
      return {
        showRoomIdList: showRoomIdList.map((item) => Number(item.value)),
        enterDrawPeriod: enterDrawPeriod === EnterDrawPeriodType.SETUP,
        ...(enterDrawPeriod === EnterDrawPeriodType.SETUP
          ? {
              enterDrawStartDate: new Date(enterDrawStartDate).getTime(),
              enterDrawEndDate: new Date(enterDrawEndDate).getTime(),
            }
          : {
              enterDrawStartDate: null,
              enterDrawEndDate: null,
            }),
      };

    default:
      return {
        showRoomIdList: null,
        enterDrawPeriod: null,
        enterDrawStartDate: null,
        enterDrawEndDate: null,
      };
  }
};

/**
 * 래플 이벤트 회차 form field > 래플 이벤트 저장 회차 item params convert
 */
export const toRaffleEventSaveTimesItemParams = (
  item: RaffleEventDetailTimesField,
  index: number,
): RaffleEventSaveTimesItemParams => {
  const {
    itemId,
    allowDuplicateWinner,
    mediaChromakey,
    enterDrawConditionType,
    mediaId,
    fileType,
    winnerConditionType,
    winnerCount,
    landingUrl,
  } = item;
  return {
    allowDuplicateWinner: allowDuplicateWinner === AllowDuplicateWinnerType.ALLOW,
    goodsMediaChromaKey: fileType === UploadFileType.VIDEO ? mediaChromakey : false,
    enterDrawConditionType: enterDrawConditionType as EnterDrawConditionType,
    goodsImageId: fileType === UploadFileType.IMAGE ? Number(mediaId) : null,
    goodsMediaId: fileType === UploadFileType.VIDEO ? Number(mediaId) : null,
    id: itemId,
    winnerCount,
    winnerConditionType: winnerConditionType as WinnerConditionType,
    landingUrl,
    ...toRaffleEventSaveTimesItemParamsByEnterDrawConditionType(item),
    sortNum: index + 1,
  };
};

/**
 * 래플 이벤트 회차 form field list > 래플 이벤트 저장 회차 list params convert
 */
export const toRaffleEventSaveTimesParamsList = (
  items: Array<RaffleEventDetailTimesField>,
): Array<RaffleEventSaveTimesItemParams> => {
  return items.map(toRaffleEventSaveTimesItemParams);
};

/**
 * 래플 이벤트 상세 form field > 래플 이벤트 저장 params convert
 */
export const toRaffleEventSaveParams = ({
  id,
  liveItem,
  itemList,
  name,
}: RaffleEventDetailFormField): RaffleEventSaveParams => {
  return {
    id,
    liveId: Number(liveItem.value),
    name,
    itemList: toRaffleEventSaveTimesParamsList(itemList),
  };
};
