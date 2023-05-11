import { QueryState } from '@hooks/useQueryState';
import { UploadFileInfo } from '@models/UploadModel';
import { BaseSyntheticEvent } from 'react';
import { FieldError, UseFormReturn } from 'react-hook-form';
import { VatCodeType } from '@constants/goods';
import {
  ModalType,
  AuctionRequestStatus,
  BroadcastActionType,
  BroadcastType,
  ContentsType,
  LiveChannelType,
  OpenStatus,
  AnchorPointImageType,
  SendbirdNoticeMessageType,
  ShowtimeKeywordUpdateType,
  AuctionGoodsType,
} from '../constants';
import { KeywordComboItemModel, ShowroomComboItemModel } from '../models';
import { UploadFileType, VideoPlayType } from '@services/useFileUploader';

/**
 * Showtime form props
 */
export interface ShowtimeFormProps<T> {
  formMethod: UseFormReturn<T>;
  handleSubmit: (e?: BaseSyntheticEvent<object, unknown, unknown>) => Promise<void>;
  handleReset: () => void;
  limit: {
    showRoomIds: boolean;
  };
}

/**
 * Showtime 리스트 form field
 */
export interface ShowtimeListFormField {
  /**
   * 검색조건
   */
  searchField: string;
  /**
   * 검색어
   */
  keyword: string;
  /**
   * 방송시작일
   */
  liveStartDate: number | string;
  /**
   * 방송종료일
   */
  liveEndDate: number | string;
  /**
   * 타입
   */
  contentsType: string;
  /**
   * 쇼룸ID 목록
   */
  showRoomIds: Array<ShowroomComboItemModel>;
  /**
   * 공개 상태
   */
  openStatuses: Array<boolean>;
  /**
   * 라이브 상태
   */
  liveStatuses: Array<boolean>;
}

/**
 * 라이브(쇼타임) 컨텐츠 이미지
 */
export interface ShowtimeContentsImage {
  extension: string;
  height: number;
  id: number;
  path: string;
  width: number;
}

/**
 * 라이브(쇼타임) 컨텐츠 미디어
 */
export interface ShowtimeContentsMedia extends ShowtimeContentsImage {
  fileType: UploadFileType;
  fileSize: number;
  thumbnailImage: ShowtimeContentsImage;
}

/**
 * Showtime 콘텐츠 file item
 */
export interface ShowtimeContentsFileItem {
  file: ShowtimeContentsImage;
  fileType: UploadFileType;
  videoPlayType: VideoPlayType | null;
}

/**
 * Showtime 콘텐츠 리스트 query string state
 */
export interface ShowtimeContentsListQueryState extends QueryState {
  size: string;
  page: string;
  sort: string;
  contentsType: string;
  keyword: string;
  liveStartDate: string;
  liveEndDate: string;
  liveStatuses: Array<string>;
  openStatuses: Array<string>;
  searchField: string;
  showRoomIds: Array<string>;
}

/**
 * Showtime 콘텐츠 item form field
 */
export interface ShowtimeContentsItemFormField {
  title: string;
  description: string;
  showRoomId: ShowroomComboItemModel;
  liveStartDate: string;
  livePlayTime: string;
  openStatus: string;
  primaryImageId: string;
  guestShowRoomIds: Array<ShowroomComboItemModel>;
  pushTitle: string;
  pushContents: string;
  pipMode: string;
  /** 경매상품 에러처리를 위한 form field */
  auctionGoodsInfo: string;
}

/**
 * 쇼타임 콘텐츠 경매 상품 item
 */
export interface AuctionGoodsItem {
  name: string;
  startPrice: number;
  startPriceText: string;
  bidUnitPrice: number;
  bidUnitPriceText: string;
  primaryImageId: number;
  primaryImagePath: string;
  primaryImage: ShowtimeContentsImage;
  goodsFileIds: Array<number>;
  goodsFiles: Array<ShowtimeContentsFileItem>;
  description: string;
  displayStartDate: number;
  id: number | null;
  goodsId: number | null;
  disabledModify?: boolean;
  keywordList: Array<KeywordComboItemModel>;
  maximumBidPrice: number;
  maximumBidPriceText: string;
  itemType: AuctionGoodsType;
  ticketId: number;
  ticketName: string;
  ticketExpiredInfo: string;
  /** 검색 태그 */
  searchTags: string;
  /** 부가세 코드 등록 */
  vatCode: VatCodeType;
}

export interface GoodsFile {
  id: number;
  type: UploadFileType;
  videoPlayType?: VideoPlayType;
}

/**
 * 쇼타임 콘텐츠 경매 상품 요청 item
 */
export interface AuctionGoodsRequestParamItem {
  name: string;
  startPrice: number;
  bidUnitPrice: number;
  primaryImageId: number;
  goodsFiles: Array<GoodsFile>;
  description: string;
  displayStartDate: number;
  id: number | null;
  goodsId: number | null;
  keywordIds?: Array<number>;
  maximumBidPrice: number;
  itemType: AuctionGoodsType;
  ticketId: number;
  /** 검색태그 */
  searchTags: string[] | null;
  /** 부가세 코드 등록 */
  vatCode: VatCodeType;
}

/**
 * 쇼타임 콘텐츠 요청 item
 */
export interface ShowtimeContentsRequestParamItem {
  contentsType: ContentsType;
  title: string;
  description: string;
  primaryImageId: number;
  showRoomId: number;
  normalGoodsIds: Array<number> | null;
  auctionGoodsList: Array<AuctionGoodsRequestParamItem> | null;
  liveStartDate: number;
  livePlayTime: number;
  openStatus: OpenStatus;
  guestShowRoomIds: Array<number>;
  pushTitle: string;
  pushContents: string;
  pipMode: boolean;
}

/**
 * 쇼타임 콘텐츠 경매상품 form filed
 */
export interface ShowtimeContentsAuctionGoodsFormField {
  name: string;
  startPrice: string;
  bidUnitPrice: string;
  primaryImageId: string;
  goodsFileIds: string;
  description: string;
  displayStartDate: string;
  maximumBidPrice: string;
  usedMaximumBidPrice: boolean;
  itemType: string;
  ticketId: string;
  /** 검색태그 */
  searchTags: string;
  /** 부가세 코드 등록 */
  vatCode: VatCodeType;
}

/**
 * Upload Image
 */
export interface UploadImage {
  fileInfos: Array<UploadFileInfo>;
  error: FieldError;
  handleChangeUploadFile: (fileInfos: UploadFileInfo[]) => void;
  handleRemoveUploadFile: (index: number) => void;
  handleChangeVideoPlayType?: (id: number, videoPlayType: VideoPlayType) => void;
}

export interface ShowtimeKeyword {
  values: Array<KeywordComboItemModel>;
  handleUpdateKeywords: (type: ShowtimeKeywordUpdateType, keywordItem: KeywordComboItemModel) => void;
}

/**
 * 쇼타임 콘텐츠 경매상품 props
 */
export interface ShowtimeContentsAuctionGoodsProps {
  modalType: ModalType | undefined;
  showModal: boolean;
  formMethod: UseFormReturn<ShowtimeContentsAuctionGoodsFormField>;
  primaryImage: UploadImage;
  goodsImage: UploadImage;
  addedAuctionGoodsItems: Array<AuctionGoodsItem>;
  keyword: ShowtimeKeyword;
  handleClickModifyItem: (index: number) => void;
  handleClickDeleteItem: (index: number) => void;
  handleOpen: (modalType: ModalType) => () => void;
  handleClose: (event: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  handleSubmit: () => void;
}

/**
 * 경매 action info
 */
export interface AuctionActionInfo {
  requestStatus: AuctionRequestStatus;
  disabled: boolean;
}

/**
 * 입찰 단위 금액 form field
 */
export interface ShowtimeUnitPriceFormField {
  unitPrice: string;
  maximumBidPrice: string;
  usedMaximumBidPrice: boolean;
}

/**
 * broadcast action info items type
 */
export type BroadcastActionInfos = Array<[LiveChannelType, BroadcastType, BroadcastActionType, boolean]>;

/**
 * Showtime 앵커포인트 form field
 */
export interface ShowtimeAnchorPointFormField {
  anchorPointId: number | null;
  actionType: string;
  name: string;
  imageType: string;
  goodsId: string;
  imageId: string;
  seekingPositionSeconds: Array<string>;
}

/**
 * 쇼타임 앵커포인트 등록 요청 item
 */
export interface ShowtimeAnchorPointRegistRequestParamItem {
  anchorPointId: number | null;
  name: string;
  imageType: AnchorPointImageType;
  goodsId: number | null;
  imageId: number | null;
  seekingPositionSeconds: number | null;
}

/**
 * Showtime 채팅현황 검색 form field
 */
export interface ShowtimeChatStatusSearchFormField {
  searchType: string;
  keyword: string;
  searched: string;
}

/**
 * Showtime 채팅현황 메세지 form field
 */
export interface ShowtimeChatStatusMessageFormField {
  message: string;
}

/**
 * Showtime 채팅현황 공지 메세지 form field
 */
export interface ShowtimeChatStatusNoticeMessageFormField {
  messageType: string;
  message: string;
}

/**
 * Showtime 채팅현황 공지 메세지 등록 요청 item
 */
export interface ShowtimeChatStatusNoticeMessageRegistRequestParamItem {
  messageType: SendbirdNoticeMessageType;
  message?: string;
  showRoomId?: number;
}

/**
 * 메뉴 item option
 */
export interface MenuItemOption {
  label: string;
  action: () => void;
}

/**
 * Showtime 상품검색 search params
 */
export interface ShowtimeGoodsSearchParams {
  name: string;
  goodsIds: Array<string>;
}

/**
 * Showtime 단위입찰가 변경 params
 */
export interface ShowtimeChangeUnitPriceParams {
  unitPrice: number;
  maximumBidPrice: number;
}

/**
 * Showtime 쇼룸구독요청 form field
 */
export interface ShowtimeChatShowroomSubscribeFormField {
  showroomType: string;
  hostShowroomId?: number;
  guestShowroom?: ShowroomComboItemModel;
  etcShowroom?: ShowroomComboItemModel;
}

/**
 * Showtime 래플 이벤트 추첨 params
 */
export interface ShowtimeRaffleEventItemDrawParams {
  liveId: number;
  raffleId: number;
}

/**
 * Showtime 래플 이벤트 당첨 excel item
 */
export interface ShowtimeRaffleEventWinnerExcelItem {
  email: string;
  nickname: number;
}
