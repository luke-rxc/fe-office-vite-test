import { QueryState } from '@hooks/useQueryState';
import { EnterDrawConditionType, RaffleEventListSearchField, WinnerConditionType } from '../constants';
import { LiveComboItemModel, ShowroomComboItemModel } from '../models';

/**
 * 래플 이벤트 검색 form field
 */
export interface RaffleEventListSearchFormField {
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
  startDate: string | number;
  /**
   * 방송종료일
   */
  endDate: string | number;
}

/**
 * 래플 이벤트 리스트 query string state
 */
export interface RaffleEventListQueryState extends QueryState {
  size: string;
  page: string;
  keyword: string;
  startDate: string;
  endDate: string;
  searchField: string;
}

/**
 * 래플 이벤트 리스트 검색 params
 */
export interface RaffleEventListSearchParams {
  size: string;
  page: string;
  searchField: RaffleEventListSearchField;
  keyword: string;
  startDate: number;
  endDate: number;
}

/**
 * 래플 이벤트 생성 form field
 */
export interface RaffleEventCreateFormField {
  eventName: string;
  liveItem: LiveComboItemModel;
}

/**
 * 래플 이벤트 생성 param
 */
export interface RaffleEventCreateParams {
  name: string;
  liveId: number;
}

/**
 * 래플 이벤트 회차 form field
 */
export interface RaffleEventDetailTimesField {
  allowDuplicateWinner: string;
  enterDrawConditionType: string;
  enterDrawEndDate: string;
  enterDrawPeriod: string;
  enterDrawStartDate: string;
  mediaId: string;
  fileType: string;
  mediaChromakey: boolean;
  itemId: number;
  showRoomIdList: Array<ShowroomComboItemModel>;
  // sortNum: number;
  targetUserCount: number;
  winnerConditionType: string;
  winnerCount: number;
  landingUrl: string;
}

/**
 * 래플 이벤트 상세 form field
 */
export interface RaffleEventDetailFormField {
  id?: number;
  name: string;
  liveItem: LiveComboItemModel;
  itemList: Array<RaffleEventDetailTimesField>;
}

/**
 * 래플 이벤트 user excel upload item
 */
export interface RaffleEventUserExcelUploadItem {
  email: string;
}

/**
 * 래플 이벤트 user excel upload params
 */
export interface RaffleEventUserUploadParams {
  raffleId: number;
  raffleItemId: number;
  emailList: Array<string>;
}

/**
 * 래플 이벤트 저장 회차 item params
 */
export interface RaffleEventSaveTimesItemParams {
  /**
   * 중복 당첨 설정
   */
  allowDuplicateWinner: boolean;
  /**
   * 크로마키 여부
   */
  goodsMediaChromaKey: boolean;
  /**
   * 사전 응모 조건 타입
   */
  enterDrawConditionType: EnterDrawConditionType;
  /**
   * 사전 응모 기간 (종료)
   */
  enterDrawEndDate: number | null;
  /**
   * 사전 응모 기간 설정 여부
   */
  enterDrawPeriod: boolean;
  /**
   * 사전 응모 기간 (시작)
   */
  enterDrawStartDate: number | null;
  /**
   * 상품 이미지 id
   */
  goodsImageId: number;
  /**
   * 상품 동영상 id
   */
  goodsMediaId: number;
  /**
   * 이벤트 id
   */
  id: number;
  /**
   * 쇼룸 id list
   */
  showRoomIdList: Array<number> | null;
  /**
   * 순번
   */
  sortNum: number;
  /**
   * 추가 당첨조건 타입
   */
  winnerConditionType: WinnerConditionType;
  /**
   * 당첨자 수 설정
   */
  winnerCount: number;
  /**
   * 당첨자 알림 발송 랜딩 페이지 url
   */
  landingUrl: string;
}

/**
 * 래플 이벤트 저장 params
 */
export interface RaffleEventSaveParams {
  id: number;
  itemList: Array<RaffleEventSaveTimesItemParams>;
  liveId: number;
  name: string;
}

/**
 * 래플 이벤트 복사 params
 */
export interface RaffleEventCopyParams {
  raffleId: number;
  raffleItemId: number;
}
