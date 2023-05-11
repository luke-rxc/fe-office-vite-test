import {
  AnchorPointImageType,
  AuctionGoodsType,
  AuctionStatus,
  AuctionStatusLabel,
  AuctionStatusMessage,
  ContentsType,
  ContentsTypeLabel,
  EnterDrawConditionTypesLabel,
  LiveStatus,
  LiveStatusLabel,
  LiveStatusMessage,
  liveStatusOptions,
  OpenStatus,
  OpenStatusLabel,
  PIPMode,
  RaffleEventStatus,
  RaffleEventStatusInfoText,
  RaffleEventStatusLabel,
  RaffleEventWinnerExcelCode,
  RehearsalStatus,
  RehearsalStatusLabel,
  RehearsalStatusMessage,
  SendbirdNoticeMessageType,
  StreamStatus,
  StreamStatusMessage,
} from '../constants';
import {
  ShowtimeAnchorPointItemSchema,
  ShowtimeAuctionBidderSchema,
  ShowtimeAuctionBidSchema,
  ShowtimeAuctionOrderSchema,
  ShowtimeChatChannelSchema,
  ShowtimeContentsItemAuctionGoodsSchema,
  ShowtimeContentsItemGoodsSchema,
  ShowtimeContentsItemSchema,
  ShowtimeContentsSchema,
  ShowtimeLiveChannelSchema,
  ShowtimeManageItemAuctionGoodsSchema,
  ShowtimeRaffleEventDetailItemSchema,
  ShowtimeRaffleEventDetailItemWinnerSchema,
  ShowtimeRaffleEventDetailSchema,
  ShowtimeRaffleEventItemSchema,
} from '../schemas';
import {
  ShowtimeContentsAuctionGoodsFormField,
  ShowtimeContentsItemFormField,
  ShowtimeContentsListQueryState,
  AuctionGoodsItem,
  ShowtimeContentsRequestParamItem,
  ShowtimeListFormField,
  GoodsItem,
  AuctionGoodsRequestParamItem,
  ShowtimeAnchorPointFormField,
  ShowtimeAnchorPointRegistRequestParamItem,
  ShowtimeChatStatusNoticeMessageRegistRequestParamItem,
  ShowtimeChatStatusNoticeMessageFormField,
  ShowtimeContentsFileItem,
  ShowtimeRaffleEventWinnerExcelItem,
} from '../types';
import { RequestParams } from '../apis';
import { toDateFormat } from '@utils/date';
import { pathConfig } from '@config';
import { KeywordComboItemModel, ShowroomComboItemModel, toKeywordComboListModel } from '.';
import { openStatusOptions } from '../constants';
import { toCamelCase } from '../utils';
import { OrderStepLabel } from '@constants/order';
import { TOption } from '@components/Select';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadFileType } from '@services/useFileUploader';

/**
 * Showtime 콘텐츠 schema
 */
export interface ShowtimeContentsModel extends ShowtimeContentsSchema {
  contentsTypeText: string;
  goodsCountText: string;
  liveStartDateText: string;
  liveStatusText: string;
  openStatusText: string;
}

/**
 * Showtime contents model convert
 */
export const toShowtimeContentsModel = (item: ShowtimeContentsSchema): ShowtimeContentsModel => {
  return {
    ...item,
    contentsTypeText: ContentsTypeLabel[item.contentsType],
    goodsCountText: item.goodsCount > 1 ? ` 외 ${item.goodsCount - 1}건` : null,
    liveStartDateText: toDateFormat(item.liveStartDate, 'yyyy/MM/dd HH:mm:ss'),
    liveStatusText: LiveStatusLabel[item.liveStatus],
    openStatusText: OpenStatusLabel[item.openStatus],
  };
};

/**
 * Showtime contents model list convert
 */
export const toShowtimeContentsModelList = (items: Array<ShowtimeContentsSchema>): Array<ShowtimeContentsModel> => {
  return items.map(toShowtimeContentsModel);
};

/**
 * Query State -> FormField 로 convert
 */
export const toFormField = (
  queryState: ShowtimeContentsListQueryState,
  defaultFormValues: ShowtimeListFormField,
  showroomComboList: Array<ShowroomComboItemModel>,
  keywordComboList: Array<KeywordComboItemModel>,
): ShowtimeListFormField => {
  const { liveStartDate, liveEndDate, showRoomIds, liveStatuses, openStatuses } = queryState;
  const showRoomIdsArray = typeof showRoomIds === 'string' ? [showRoomIds] : showRoomIds;
  const liveStatusesArray = typeof liveStatuses === 'string' ? [liveStatuses] : liveStatuses;
  const openStatusesArray = typeof openStatuses === 'string' ? [openStatuses] : openStatuses;
  return {
    ...defaultFormValues,
    ...queryState,
    liveStartDate: Number.isInteger(Number(liveStartDate)) ? Number(liveStartDate) : '',
    liveEndDate: Number.isInteger(Number(liveEndDate)) ? Number(liveEndDate) : '',
    showRoomIds: showroomComboList.filter(({ value }) => (showRoomIdsArray || []).indexOf(value.toString()) > -1),
    liveStatuses: liveStatusOptions.map((item) => !!(liveStatusesArray ?? []).find((status) => status === item)),
    openStatuses: openStatusOptions.map((item) => !!(openStatusesArray ?? []).find((status) => status === item)),
  };
};

/**
 * Query State -> FormField 로 convert
 */
export const toQueryParams = (queryState: ShowtimeContentsListQueryState): RequestParams => {
  const { liveStartDate, liveEndDate, keywordIds = [], showRoomIds, liveStatuses, openStatuses } = queryState;

  return {
    ...queryState,
    liveStartDate: Number.isInteger(Number(liveStartDate)) ? Number(liveStartDate) : null,
    liveEndDate: Number.isInteger(Number(liveEndDate)) ? Number(liveEndDate) : null,
    keywordIds: typeof keywordIds === 'string' ? [Number(keywordIds)] : keywordIds.map((item) => Number(item)),
    showRoomIds: typeof showRoomIds === 'string' ? [showRoomIds] : showRoomIds,
    liveStatuses: typeof liveStatuses === 'string' ? [liveStatuses] : liveStatuses,
    openStatuses: typeof openStatuses === 'string' ? [openStatuses] : openStatuses,
  };
};

/**
 * FormField -> Query State 로 convert
 */
export const toQueryState = (
  formField: ShowtimeListFormField,
  currentQueryState?: ShowtimeContentsListQueryState,
): ShowtimeContentsListQueryState => {
  const { liveStartDate, liveEndDate, showRoomIds, liveStatuses, openStatuses } = formField;
  return {
    ...currentQueryState,
    ...formField,
    showRoomIds: showRoomIds.map(({ value }) => value.toString()),
    liveStartDate: liveStartDate ? liveStartDate.toString() : '',
    liveEndDate: liveEndDate ? liveEndDate.toString() : '',
    openStatuses: openStatuses
      .map((item, index) => (!!item ? openStatusOptions[index] : undefined))
      .filter((item) => !!item),
    liveStatuses: liveStatuses
      .map((item, index) => (!!item ? liveStatusOptions[index] : undefined))
      .filter((item) => !!item),
  };
};

/**
 * FormField -> RequestParamItem 으로 convert
 */
export const toShowtimeContentsRequestParamItem = (
  item: ShowtimeContentsItemFormField,
  contentsType: ContentsType,
): ShowtimeContentsRequestParamItem => {
  return {
    contentsType,
    title: item.title,
    description: item.description,
    primaryImageId: Number(item.primaryImageId) ?? null,
    showRoomId: Number(item.showRoomId.value),
    normalGoodsIds: null,
    auctionGoodsList: null,
    liveStartDate: item.liveStartDate ? new Date(item.liveStartDate).getTime() : null,
    livePlayTime: Number(item.livePlayTime),
    openStatus: item.openStatus as OpenStatus,
    guestShowRoomIds: item.guestShowRoomIds.map((showroom) => showroom.value),
    pushTitle: item.pushTitle || null,
    pushContents: item.pushContents || null,
    pipMode: item.pipMode === PIPMode.ON,
  };
};

/**
 * UploadShowtimeFileInfo -> ShowtimeContentsFileItem 으로 convert
 */
export const toShowtimeContentsFileItem = (item: UploadFileInfo): ShowtimeContentsFileItem => {
  return {
    file: {
      extension: item.extension,
      height: item.height,
      id: item.id,
      path: item.path,
      width: item.width,
    },
    fileType: item.fileType,
    videoPlayType: item.videoPlayType,
  };
};

/**
 * UploadFileInfo list -> ShowtimeContentsFileItem list 으로 convert
 */
export const toShowtimeContentsFileItemList = (items: Array<UploadFileInfo>): Array<ShowtimeContentsFileItem> => {
  return items.map(toShowtimeContentsFileItem);
};

/**
 * 경매상품 FormField -> 경매상품 item 으로 convert
 */
export const toShowtimeContentsRequestParamActionGoods = (
  item: ShowtimeContentsAuctionGoodsFormField,
  fileInfo: UploadFileInfo,
  goodsFileInfo: Array<UploadFileInfo>,
  keywords: Array<KeywordComboItemModel>,
  ticketName: string,
  ticketExpiredInfo: string,
): AuctionGoodsItem => {
  return {
    ...item,
    startPrice: Number(item.startPrice),
    startPriceText: `${Number(item.startPrice).toLocaleString()} 원`,
    bidUnitPrice: Number(item.bidUnitPrice),
    bidUnitPriceText: `${Number(item.bidUnitPrice).toLocaleString()} 원`,
    primaryImageId: Number(item.primaryImageId),
    primaryImagePath: fileInfo ? `${pathConfig.cdnUrl}/${fileInfo.path}` : '',
    primaryImage: {
      extension: fileInfo.extension,
      height: fileInfo.height,
      id: fileInfo.id,
      path: fileInfo.path,
      width: fileInfo.width,
    },
    goodsFileIds: item.goodsFileIds.split(',').map((id) => Number(id)),
    goodsFiles: toShowtimeContentsFileItemList(goodsFileInfo),
    displayStartDate: item.displayStartDate ? new Date(item.displayStartDate).getTime() : null,
    id: null,
    goodsId: null,
    keywordList: keywords,
    maximumBidPrice: item.usedMaximumBidPrice ? Number(item.maximumBidPrice) : 0,
    maximumBidPriceText: item.usedMaximumBidPrice ? `${Number(item.maximumBidPrice).toLocaleString()} 원` : '미사용',
    itemType: item.itemType as AuctionGoodsType,
    ticketId: item.itemType === AuctionGoodsType.TICKET ? Number(item.ticketId) ?? null : null,
    ticketName,
    ticketExpiredInfo,
  };
};

/**
 * 쇼타임 콘텐츠 아이템 model
 */
export interface ShowtimeContentsItemModel
  extends Omit<ShowtimeContentsItemSchema, 'auctionGoodsList' | 'contentsGoodsList' | 'pipMode'> {
  auctionGoodsList: Array<AuctionGoodsItem>;
  contentsGoodsList: Array<GoodsItem>;
  goodsName: string;
  openStatusText: string;
  guestShowRoomIds: Array<number>;
  pipMode: string;
}

/**
 * ShowtimeContentsItemAuctionGoodsSchema => AuctionGoodsItem converter
 */
export const toAuctionGoodsItem = (item: ShowtimeContentsItemAuctionGoodsSchema): AuctionGoodsItem => {
  return {
    name: item.name,
    startPrice: item.startPrice,
    bidUnitPrice: item.bidUnitPrice,
    goodsFiles: item.goodsFiles,
    description: item.description,
    startPriceText: `${item.startPrice.toLocaleString()} 원`,
    bidUnitPriceText: `${item.bidUnitPrice.toLocaleString()} 원`,
    primaryImageId: item.primaryImage.id,
    primaryImagePath: item.primaryImage.path ? `${pathConfig.cdnUrl}/${item.primaryImage.path}` : '',
    primaryImage: item.primaryImage,
    goodsFileIds: item.goodsFiles.map((item) => item.file.id),
    displayStartDate: item.displayStartDate,
    id: item.id,
    goodsId: item.goodsId,
    disabledModify: item.status !== AuctionStatus.WAITING,
    keywordList: item.keywordList ? toKeywordComboListModel(item.keywordList) : [],
    maximumBidPrice: item.maximumBidPrice,
    maximumBidPriceText: item.maximumBidPrice > 0 ? `${item.maximumBidPrice.toLocaleString()} 원` : '미사용',
    itemType: item.itemType,
    ticketId: item.ticket?.id ?? null,
    ticketName: item.ticket?.name ?? '',
    ticketExpiredInfo: getTicketExpiredInfo(item),
    searchTags: item.searchTags ? item.searchTags.map((searchTag) => searchTag.value).join(',') : '',
    vatCode: item.vatCode,
  };
};

/**
 * ShowtimeContentsItemAuctionGoodsSchema list => AuctionGoodsItem list converter
 */
export const toAuctionGoodsItemList = (
  items: Array<ShowtimeContentsItemAuctionGoodsSchema>,
): Array<AuctionGoodsItem> => {
  return items.map(toAuctionGoodsItem);
};

/**
 * ShowtimeContentsItemGoodsSchema => GoodsItem converter
 */
export const toContentsGoods = (item: ShowtimeContentsItemGoodsSchema): GoodsItem => {
  return {
    consumerPrice: item.consumerPrice.price,
    consumerPriceText: `${item.consumerPrice.price.toLocaleString()} 원`,
    id: item.id,
    name: item.name,
    price: item.price.price,
    priceText: `${item.price.price.toLocaleString()} 원`,
    primaryImagePath: item.primaryImage.path ? `${pathConfig.cdnUrl}/${item.primaryImage.path}` : '',
  };
};

/**
 * ShowtimeContentsItemGoodsSchema list => GoodsItem list converter
 */
export const toContentsGoodsList = (items: Array<ShowtimeContentsItemGoodsSchema>): Array<GoodsItem> => {
  return items.map(toContentsGoods);
};

/**
 * ShowtimeContentsItemGoodsSchema => TOption converter
 */
export const toContentsGoodsOption = (item: ShowtimeContentsItemGoodsSchema): TOption => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * ShowtimeContentsItemGoodsSchema list => TOption list converter
 */
export const toContentsGoodsOptionList = (items: Array<ShowtimeContentsItemGoodsSchema>): Array<TOption> => {
  return items.map(toContentsGoodsOption);
};

/**
 * 상품이름 조회
 */
const getGoodsName = (item: ShowtimeContentsItemSchema) => {
  if (item.contentsType === ContentsType.STANDARD) {
    if (item.contentsGoodsList.length === 0) {
      return '';
    }

    const goodsCountText = item.contentsGoodsList.length > 1 ? ` 외 ${item.contentsGoodsList.length - 1}건` : '';
    return `${item.contentsGoodsList[0].name}${goodsCountText}`;
  } else {
    if (item.auctionGoodsList.length === 0) {
      return '';
    }

    const goodsCountText = item.auctionGoodsList.length > 1 ? ` 외 ${item.auctionGoodsList.length - 1}건` : '';
    return `${item.auctionGoodsList[0].name}${goodsCountText}`;
  }
};

/**
 * ShowtimeContentsItemSchema => ShowtimeContentsItemModel converter
 */
export const toShowtimeContentsItemModel = (item: ShowtimeContentsItemSchema): ShowtimeContentsItemModel => {
  return {
    ...item,
    auctionGoodsList: toAuctionGoodsItemList(item.auctionGoodsList),
    contentsGoodsList: toContentsGoodsList(item.contentsGoodsList),
    goodsName: getGoodsName(item),
    openStatusText: OpenStatusLabel[item.openStatus],
    guestShowRoomIds: item.guestShowRoomList.map((showroom) => showroom.id),
    pipMode: item.pipMode ? PIPMode.ON : PIPMode.OFF,
  };
};

/**
 * ShowtimeContentsItemModel -> FormField 으로 convert
 */
export const toShowtimeContentsItemFormField = (
  item: ShowtimeContentsItemModel,
  showroomComboList: Array<ShowroomComboItemModel>,
): ShowtimeContentsItemFormField => {
  return {
    title: item.title,
    description: item.description,
    showRoomId: { value: item.showRoomId, label: item.showRoomName },
    liveStartDate: toDateFormat(item.liveStartDate, 'yyyy-MM-dd HH:mm').split(' ').join('T'),
    livePlayTime: item.livePlayTime.toString(),
    openStatus: item.openStatus,
    primaryImageId: item.primaryImage.id.toString(),
    pipMode: item.pipMode,
    guestShowRoomIds: item.guestShowRoomList.map((item) => {
      return { value: item.id, label: item.name };
    }),
    pushTitle: item.pushTitle ?? '',
    pushContents: item.pushContents ?? '',
    auctionGoodsInfo: '',
  };
};

/**
 * AuctionGoodsItem => AuctionGoodsRequestParamItem converter
 */
export const toAuctionGoodsRequestParamItem = (item: AuctionGoodsItem): AuctionGoodsRequestParamItem => {
  /** 검색 태그 : trim */
  const searchTags = item.searchTags ? item.searchTags.trim() : '';
  return {
    name: item.name,
    startPrice: item.startPrice,
    bidUnitPrice: item.bidUnitPrice,
    primaryImageId: item.primaryImageId,
    goodsFiles: item.goodsFiles.map((item) => {
      const goodsFileInfo = {
        type: item.fileType,
        id: item.file.id,
      };
      return item.videoPlayType
        ? {
            ...goodsFileInfo,
            videoPlayType: item.videoPlayType,
          }
        : goodsFileInfo;
    }),
    description: item.description,
    displayStartDate: item.displayStartDate,
    id: item.id,
    goodsId: item.goodsId,
    keywordIds: item.keywordList.map((keyword) => keyword.value),
    maximumBidPrice: item.maximumBidPrice,
    itemType: item.itemType,
    ticketId: item.ticketId,
    /** 검색태그 */
    searchTags: searchTags ? searchTags.split(',') : null,
    /** 부가세 코드 등록 */
    vatCode: item.vatCode,
  };
};

/**
 * AuctionGoodsItem list => AuctionGoodsRequestParamItem list converter
 */
export const toAuctionGoodsRequestParamItemList = (
  items: Array<AuctionGoodsItem>,
): Array<AuctionGoodsRequestParamItem> => {
  return items.map(toAuctionGoodsRequestParamItem);
};

/**
 * 쇼타임 운영 경매상품 model
 */
export interface ShowtimeManageItemAuctionGoodsModel extends ShowtimeManageItemAuctionGoodsSchema {
  startPriceText: string;
  bidUnitPriceText: string;
  primaryImagePath: string;
  statusText: string;
  statusMessage: string;
  statusClassName: string;
  maximumBidPriceText: string;
  ticketName: string;
  ticketExpiredInfo: string;
}

const getTicketExpiredInfo = (item: ShowtimeManageItemAuctionGoodsSchema) => {
  if (item.itemType === AuctionGoodsType.GOODS || !item.ticket) {
    return '';
  }

  if (item.ticket.afterDay) {
    return `${item.ticket.afterDay}일`;
  }

  return `${toDateFormat(item.ticket.startDateTime, 'yyyy/MM/dd')} ~ ${toDateFormat(
    item.ticket.expiredDateTime,
    'yyyy/MM/dd',
  )}`;
};

/**
 * ShowtimeManageItemAuctionGoodsSchema => ShowtimeManageItemAuctionGoodsModel convert
 */
export const toShowtimeManageItemAuctionGoodsModel = (
  item: ShowtimeManageItemAuctionGoodsSchema,
): ShowtimeManageItemAuctionGoodsModel => {
  return {
    ...item,
    startPriceText: `${item.startPrice.toLocaleString()} 원`,
    bidUnitPriceText: `${item.bidUnitPrice.toLocaleString()} 원`,
    primaryImagePath: item.primaryImage.path ? `${pathConfig.cdnUrl}/${item.primaryImage.path}` : '',
    statusText: AuctionStatusLabel[item.status],
    statusMessage: AuctionStatusMessage[item.status],
    statusClassName: toCamelCase(item.status),
    maximumBidPriceText: item.maximumBidPrice > 0 ? `${item.maximumBidPrice.toLocaleString()} 원` : '미사용',
    ticketName: item.ticket?.name ?? '',
    ticketExpiredInfo: getTicketExpiredInfo(item),
  };
};

/**
 * ShowtimeManageItemAuctionGoodsSchema list => ShowtimeManageItemAuctionGoodsModel list convert
 */
export const toShowtimeManageItemAuctionGoodsModelList = (
  items: Array<ShowtimeManageItemAuctionGoodsSchema>,
): Array<ShowtimeManageItemAuctionGoodsModel> => {
  const existBiddingItem =
    items.filter(
      (item) =>
        item.status !== AuctionStatus.WAITING &&
        item.status !== AuctionStatus.SUCCESSFUL_BID &&
        item.status !== AuctionStatus.CANCEL,
    ).length > 0;

  return items
    .map((item) => {
      if (existBiddingItem && item.status === AuctionStatus.WAITING) {
        item.status = AuctionStatus.BLOCKED_WAITING;
      }
      return item;
    })
    .map(toShowtimeManageItemAuctionGoodsModel);
};

/**
 * 쇼타임 채팅채널 model
 */
export interface ShowtimeChatChannelModel extends ShowtimeChatChannelSchema {}

/**
 * 쇼타임 채팅채널 schema -> model convert
 */
export const toShowtimeChatChannelModel = (item: ShowtimeChatChannelSchema): ShowtimeChatChannelModel => {
  return {
    ...item,
  };
};

/**
 * 경매 낙찰자 정보 model
 */
export interface ShowtimeAuctionBidderModel extends ShowtimeAuctionBidderSchema {
  profileImagePath: string;
}

/**
 * 경매 낙찰 주문정보 model
 */
export interface ShowtimeAuctionOrderModel extends ShowtimeAuctionOrderSchema {
  orderStepText: string;
  paymentDateText: string;
}

/**
 * 경매 낙찰 정보 model
 */
export interface ShowtimeAuctionBidModel extends ShowtimeAuctionBidSchema {
  primaryImagePath: string;
  startPriceText: string;
  bidUnitPriceText: string;
  biddingCountText: string;
  bidderCountText: string;
  finalPriceText: string;
  bidder: ShowtimeAuctionBidderModel;
  order?: ShowtimeAuctionOrderModel;
  goodsContent: {
    name: string;
    primaryImagePath: string;
    startPriceText: string;
    bidUnitPriceText: string;
    maximumBidPriceText: string;
    itemType: AuctionGoodsType;
    ticketName: string;
    ticketExpiredInfo: string;
  };
}

/**
 * ShowtimeAuctionBidderSchema -> ShowtimeAuctionBidderModel converter
 */
export const toShowtimeAuctionBidderModel = (item: ShowtimeAuctionBidderSchema): ShowtimeAuctionBidderModel => {
  return {
    ...item,
    profileImagePath: item.profileImage.path ? `${pathConfig.cdnUrl}/${item.profileImage.path}` : '',
  };
};

/**
 * ShowtimeAuctionOrderSchema -> ShowtimeAuctionOrderModel converter
 */
export const toShowtimeAuctionOrderModel = (item: ShowtimeAuctionOrderSchema): ShowtimeAuctionOrderModel => {
  return {
    ...item,
    orderStepText: OrderStepLabel[item.orderStep],
    paymentDateText: item.paymentDate ? toDateFormat(item.paymentDate) : '-',
  };
};

/**
 * ShowtimeAuctionBidSchema -> ShowtimeAuctionBidModel converter
 */
export const toShowtimeAuctionBidModel = (item: ShowtimeAuctionBidSchema): ShowtimeAuctionBidModel => {
  return {
    ...item,
    primaryImagePath: item.primaryImage.path ? `${pathConfig.cdnUrl}/${item.primaryImage.path}` : '',
    startPriceText: `${item.startPrice.toLocaleString()}원`,
    bidUnitPriceText: `${item.bidUnitPrice.toLocaleString()}원`,
    bidderCountText: item.bidderCount.toLocaleString(),
    biddingCountText: item.biddingCount.toLocaleString(),
    finalPriceText: `${item.finalPrice.toLocaleString()}원`,
    bidder: toShowtimeAuctionBidderModel(item.bidder),
    order: item.order ? toShowtimeAuctionOrderModel(item.order) : undefined,
    goodsContent: {
      name: item.name,
      primaryImagePath: item.primaryImage.path ? `${pathConfig.cdnUrl}/${item.primaryImage.path}` : '',
      startPriceText: `${item.startPrice.toLocaleString()}원`,
      bidUnitPriceText: `${item.bidUnitPrice.toLocaleString()}원`,
      maximumBidPriceText: item.maximumBidPrice > 0 ? `${item.maximumBidPrice.toLocaleString()}원` : '미사용',
      itemType: item.itemType,
      ticketName: item.ticket?.name ?? '',
      ticketExpiredInfo: null,
    },
  };
};

/**
 * 쇼타임 라이브채널 model
 */
export interface ShowtimeLiveChannelModel extends ShowtimeLiveChannelSchema {
  liveStatusLabel: string;
  liveStatusMessage: string;
  liveStreamStatusMessage: string;
  rehearsalStatusLabel: string;
  rehearsalStatusMessage: string;
  rehearsalStreamStatusMessage: string;
  streamUrl: string;
  isLive: boolean;
  isLiveOnAir: boolean;
  isLiveRehearsal: boolean;
  isShowPlayer: boolean;
}

/**
 * ShowtimeLiveChannelSchema -> ShowtimeLiveChannelModel converter
 */
export const toShowtimeLiveChannelModel = (item: ShowtimeLiveChannelSchema): ShowtimeLiveChannelModel => {
  const isLiveOnAir = item.liveStatus !== LiveStatus.NONE && item.liveStatus !== LiveStatus.END;
  const isLiveRehearsal = item.rehearsalStatus !== RehearsalStatus.NONE && item.rehearsalStatus !== RehearsalStatus.END;
  return {
    ...item,
    liveStatusLabel: LiveStatusLabel[item.liveStatus],
    liveStatusMessage: LiveStatusMessage[item.liveStatus],
    liveStreamStatusMessage:
      StreamStatusMessage[item.liveStatus === LiveStatus.END ? StreamStatus.FINISHED : item.liveStreamStatus],
    rehearsalStatusLabel: RehearsalStatusLabel[item.rehearsalStatus],
    rehearsalStatusMessage: RehearsalStatusMessage[item.rehearsalStatus],
    rehearsalStreamStatusMessage: StreamStatusMessage[item.rehearsalStreamStatus],
    streamUrl: item.liveStreamUrl ?? item.rehearsalStreamUrl,
    isLive: isLiveOnAir || isLiveRehearsal,
    isLiveOnAir,
    isLiveRehearsal,
    isShowPlayer:
      item.liveStreamStatus === StreamStatus.PROCESSING || item.rehearsalStreamStatus === StreamStatus.PROCESSING,
  };
};

/**
 * 앵커포인트 편성 item model
 */
export interface ShowtimeAnchorPointItemModel extends ShowtimeAnchorPointItemSchema {
  imagePath: string;
  seekingPositionSecondsText: string;
}

/**
 * ShowtimeAnchorPointItemSchema -> ShowtimeAnchorPointItemModel
 */
export const toShowtimeAnchorPointItemModel = (item: ShowtimeAnchorPointItemSchema): ShowtimeAnchorPointItemModel => {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
  return {
    ...item,
    imagePath: item.image?.path ? `${pathConfig.cdnUrl}/${item.image?.path}` : '',
    seekingPositionSecondsText: item.active
      ? toDateFormat(item.seekingPositionSeconds * 1000 + timezoneOffset, 'HH:mm:ss')
      : '--:--:--',
  };
};

/**
 * ShowtimeAnchorPointItemSchema list -> ShowtimeAnchorPointItemModel list
 */
export const toShowtimeAnchorPointItemModelList = (
  items: Array<ShowtimeAnchorPointItemSchema>,
): Array<ShowtimeAnchorPointItemModel> => {
  return items.map(toShowtimeAnchorPointItemModel);
};

/**
 * ShowtimeAnchorPointFormField -> toShowtimeAnchorPointRegistRequestParamItem converter
 */
export const toShowtimeAnchorPointRegistRequestParamItem = (
  item: ShowtimeAnchorPointFormField,
): ShowtimeAnchorPointRegistRequestParamItem => {
  return {
    anchorPointId: item.anchorPointId,
    name: item.name,
    imageType: item.imageType as AnchorPointImageType,
    goodsId: item.goodsId ? Number(item.goodsId) : null,
    imageId: item.imageId ? Number(item.imageId) : null,
    seekingPositionSeconds: item.seekingPositionSeconds
      ? Number(item.seekingPositionSeconds[0]) * 3600 +
        Number(item.seekingPositionSeconds[1]) * 60 +
        Number(item.seekingPositionSeconds[2])
      : null,
  };
};

/**
 * ShowtimeAnchorPointItemModel -> ShowtimeAnchorPointFormField converter
 */
export const toShowtimeAnchorPointFormField = (item: ShowtimeAnchorPointItemModel): ShowtimeAnchorPointFormField => {
  return {
    anchorPointId: null,
    actionType: '',
    name: item.name,
    imageType: item.imageType,
    goodsId: item.goodsId ? item.goodsId.toString() : '',
    imageId: item.imageId ? item.imageId.toString() : '',
    seekingPositionSeconds: item.seekingPositionSecondsText.split(':') ?? [],
  };
};

/**
 * ShowtimeChatStatusNoticeMessageFormField -> ShowtimeChatStatusNoticeMessageRegistRequestParamItem converter
 */
export const toShowtimeChatStatusNoticeMessageRegistRequestParamItem = (
  item: ShowtimeChatStatusNoticeMessageFormField,
): ShowtimeChatStatusNoticeMessageRegistRequestParamItem => {
  return {
    ...item,
    messageType: item.messageType as SendbirdNoticeMessageType,
  };
};

/**
 * 래플 이벤트 item model
 */
export interface ShowtimeRaffleEventItemModel extends ShowtimeRaffleEventItemSchema {
  sortNumText: string;
  mediaPath: string;
  mediaType: UploadFileType;
  statusText: string;
  statusInfoText: string;
  enterDrawConditionTypeText: string;
  winnerCountText: string;
}

/**
 * 래플 이벤트 상세 item model
 */
export interface ShowtimeRaffleEventDetailModel extends ShowtimeRaffleEventDetailSchema {
  itemList: Array<ShowtimeRaffleEventItemModel>;
}

/**
 * 래플 이벤트 detail item 당첨자model
 */
export interface ShowtimeRaffleEventDetailItemWinnerModel extends ShowtimeRaffleEventDetailItemWinnerSchema {
  sortNum: number;
}

/**
 * 래플 이벤트 detail item model
 */
export interface ShowtimeRaffleEventDetailItemModel
  extends ShowtimeRaffleEventDetailItemSchema,
    ShowtimeRaffleEventItemModel {
  drawDateText: string;
  enterDrawUserCountText: string;
  winnerList: Array<ShowtimeRaffleEventDetailItemWinnerModel>;
  winnerListCountText: string;
}

/**
 * 래플 이벤트 item schema > 래플 이벤트 item model convert
 */
export const toShowtimeRaffleEventItemModel = (
  item: ShowtimeRaffleEventItemSchema,
  index?: number,
): ShowtimeRaffleEventItemModel => {
  const path = item.goodsMedia
    ? item.goodsMedia.thumbnailImage?.path ?? item.goodsMedia.path
    : item.goodsImage
    ? item.goodsImage.path
    : null;

  return {
    ...item,
    sortNumText: `${(index || 0) + 1}회차`,
    mediaPath: path ? `${pathConfig.cdnUrl}/${path}` : '',
    mediaType: item.goodsMedia
      ? item.goodsMedia.thumbnailImage
        ? UploadFileType.IMAGE
        : item.goodsMedia.fileType
      : UploadFileType.IMAGE,
    statusText: RaffleEventStatusLabel[item.status ?? RaffleEventStatus.STANDBY],
    statusInfoText: RaffleEventStatusInfoText[item.status ?? RaffleEventStatus.STANDBY],
    enterDrawConditionTypeText: EnterDrawConditionTypesLabel[item.enterDrawConditionType],
    winnerCountText: `${(item.winnerCount || 0).toLocaleString()}명`,
    status: item.status ?? RaffleEventStatus.STANDBY,
  };
};

/**
 * 래플 이벤트 item schema list > 래플 이벤트 item model list convert
 */
export const toShowtimeRaffleEventItemModelList = (
  items: Array<ShowtimeRaffleEventItemSchema>,
): Array<ShowtimeRaffleEventItemModel> => {
  if (!items) {
    return null;
  }

  return items.map(toShowtimeRaffleEventItemModel);
};

/**
 * 래플 이벤트 상세 item schema > 래플 이벤트 상세 item model convert
 */
export const toShowtimeRaffleEventDetailModel = (
  item: ShowtimeRaffleEventDetailSchema,
): ShowtimeRaffleEventDetailModel => {
  return {
    ...item,
    itemList: toShowtimeRaffleEventItemModelList(item.itemList),
  };
};

export const toShowtimeRaffleEventDetailItemWinnerModel = (
  item: ShowtimeRaffleEventDetailItemWinnerSchema,
  index: number,
): ShowtimeRaffleEventDetailItemWinnerModel => {
  return {
    ...item,
    sortNum: index + 1,
  };
};

export const toShowtimeRaffleEventDetailItemWinnerModelList = (
  items: Array<ShowtimeRaffleEventDetailItemWinnerSchema>,
): Array<ShowtimeRaffleEventDetailItemWinnerModel> => {
  return items.map(toShowtimeRaffleEventDetailItemWinnerModel);
};

export const toShowtimeRaffleEventDetailItemModel = (
  item: ShowtimeRaffleEventDetailItemSchema,
): ShowtimeRaffleEventDetailItemModel => {
  return {
    ...item,
    ...toShowtimeRaffleEventItemModel(item),
    drawDateText: item.drawDate ? toDateFormat(item.drawDate) : '-',
    enterDrawUserCountText: `${(item.enterDrawUserCount || 0).toLocaleString()} 명`,
    winnerList: item.winnerList ? toShowtimeRaffleEventDetailItemWinnerModelList(item.winnerList) : [],
    winnerListCountText: `${(item.winnerList?.length || 0).toLocaleString()} 명`,
  };
};

/**
 * 래플 이벤트 detail item schema list > 래플 이벤트 detail item model list convert
 */
export const toShowtimeRaffleEventDetailItemModelList = (
  items: Array<ShowtimeRaffleEventDetailItemSchema>,
): Array<ShowtimeRaffleEventDetailItemModel> => {
  return items.map(toShowtimeRaffleEventDetailItemModel);
};

/**
 * 래플 이벤트 detail item model > 래플 이벤트 당첨자 excel item convert
 */
export const toOrderExportTicketExcelItem = (
  item: ShowtimeRaffleEventDetailItemWinnerModel,
): ShowtimeRaffleEventWinnerExcelItem => {
  const excelKeys = Object.keys(RaffleEventWinnerExcelCode);
  const exportItem = excelKeys.reduce<ShowtimeRaffleEventWinnerExcelItem>((target, key) => {
    target[key] = item[key] ? String(item[key]) : '';
    return target;
  }, {} as ShowtimeRaffleEventWinnerExcelItem);
  return exportItem;
};

/**
 * 래플 이벤트 detail item model list > 래플 이벤트 당첨자 excel item list convert
 */
export const toOrderExportTicketExcelItemList = (
  items: Array<ShowtimeRaffleEventDetailItemWinnerModel>,
): Array<ShowtimeRaffleEventWinnerExcelItem> => {
  return items.map(toOrderExportTicketExcelItem);
};
