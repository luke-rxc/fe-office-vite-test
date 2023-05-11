import { UploadFileType } from '@services/useFileUploader';
import { EnterDrawConditionType, WinnerConditionType, RaffleEventBroadcastStatus } from '../constants';

/**
 * image schema
 */
export interface ImageSchema {
  extension: string;
  height: number;
  id: number;
  path: string;
  width: number;
  originalFileName: string;
}

export interface MediaSchema extends ImageSchema {
  fileType: UploadFileType;
  fileSize: string;
  thumbnailImage: ImageSchema;
}

/**
 * 래플 이벤트 리스트 item showroom schema
 */
export interface RaffleEventListItemShowroomSchema {
  id: number;
  name: string;
  primaryImage: ImageSchema | null;
}

/**
 * 래플 이벤트 리스트 item live schema
 */
export interface RaffleEventListItemLiveSchema {
  id: number;
  liveStartDate: string;
  broadcastStatus: RaffleEventBroadcastStatus;
  showRoom: RaffleEventListItemShowroomSchema;
  title: string;
}
/**
 * 래플 이벤트 리스트 item schema
 */
export interface RaffleEventListItemSchema {
  id: number;
  itemCount: number;
  live: RaffleEventListItemLiveSchema;
  name: string;
}

/**
 * 쇼룸 schema
 */
export interface ShowroomSchema {
  id: number;
  name: string;
  primaryImage: ImageSchema;
}

/**
 * 라이브 schema
 */
export interface LiveSchema {
  id: number;
  liveStartDate: string;
  broadcastStatus: RaffleEventBroadcastStatus;
  showRoom: ShowroomSchema;
  title: string;
}

/**
 * 래플 이벤트 회차 schema
 */
export interface RaffleEventTimesSchema {
  allowDuplicateWinner: boolean;
  enterDrawConditionType: EnterDrawConditionType;
  enterDrawEndDate: number;
  enterDrawPeriod: boolean;
  enterDrawStartDate: number;
  goodsImage: ImageSchema;
  goodsMedia: MediaSchema;
  goodsMediaChromaKey: boolean;
  id: number;
  showRoomList: Array<ShowroomSchema>;
  sortNum: number;
  targetUserCount: number;
  winnerConditionType: WinnerConditionType;
  winnerCount: number;
  landingUrl: string;
}

/**
 * 래플 이벤트 상세 item schema
 */
export interface RaffleEventDetailItemSchema {
  id: number;
  itemList: Array<RaffleEventTimesSchema>;
  live: LiveSchema;
  name: string;
}

export interface RaffleEventUserExcelResponseSchema {
  userCount: number;
}
