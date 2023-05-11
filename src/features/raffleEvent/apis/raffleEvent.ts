import { PaginationResponse } from '@schemas/PaginationSchema';
import { baseApiClient } from '@utils/api';
import {
  RaffleEventDetailItemSchema,
  RaffleEventListItemSchema,
  RaffleEventTimesSchema,
  RaffleEventUserExcelResponseSchema,
} from '../schemas';
import {
  RaffleEventCopyParams,
  RaffleEventCreateParams,
  RaffleEventListSearchParams,
  RaffleEventSaveParams,
  RaffleEventUserUploadParams,
} from '../types';

/**
 * 래플 이벤트 리스트 검색
 */
export const getRaffleEventList = ({
  page,
  size,
  ...params
}: RaffleEventListSearchParams): Promise<PaginationResponse<RaffleEventListItemSchema>> => {
  return baseApiClient.post<PaginationResponse<RaffleEventListItemSchema>>(
    `/raffle/search?page=${page}&size=${size}`,
    params,
  );
};

/**
 * 래플 이벤트 등록
 */
export const postRaffleEvent = (params: RaffleEventCreateParams): Promise<void> => {
  return baseApiClient.post<void>(`/raffle`, params);
};

/**
 * 래플 이벤트 상세 조회
 */
export const getRaffleEventDetail = (raffleId: number): Promise<RaffleEventDetailItemSchema> => {
  return baseApiClient.get<RaffleEventDetailItemSchema>(`/raffle/${raffleId}`);
};

/**
 * 래플 이벤트 회차 응모 대상 일괄 저장
 */
export const postRaffleEventUploadTargetUser = ({
  raffleId,
  raffleItemId,
  ...params
}: RaffleEventUserUploadParams): Promise<RaffleEventUserExcelResponseSchema> => {
  return baseApiClient.post<RaffleEventUserExcelResponseSchema>(
    `/raffle/${raffleId}/raffle-item/${raffleItemId}/target-user`,
    params,
  );
};

/**
 * 래플 이벤트 회차 생성
 */
export const postRaffleEventCreateTimesItem = (raffleId: number): Promise<RaffleEventTimesSchema> => {
  return baseApiClient.post<RaffleEventTimesSchema>(`/raffle/${raffleId}/raffle-item`);
};

/**
 * 래플 이벤트 저장
 */
export const putSaveRaffleEvent = (params: RaffleEventSaveParams): Promise<void> => {
  return baseApiClient.put<void>(`/raffle/${params.id}`, params);
};

/**
 * 래플 이벤트 회차 복사
 */
export const postRaffleEventCopyTimesItem = ({
  raffleId,
  raffleItemId,
}: RaffleEventCopyParams): Promise<RaffleEventTimesSchema> => {
  return baseApiClient.post<RaffleEventTimesSchema>(`/raffle/${raffleId}/raffle-item/${raffleItemId}/copy`);
};
