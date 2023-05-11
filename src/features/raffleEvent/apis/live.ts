import { baseApiClient } from '@utils/api';
import { LiveComboSchema, LiveShowroomSchema } from '../schemas';

/**
 * 라이브 콤보 리스트 조회 (최신 3개월)
 */
export const getLiveCombo = (): Promise<LiveComboSchema> => {
  return baseApiClient.get<LiveComboSchema>(`/common/combo/LIVE_LAST_3MONTHS`);
};

/**
 * 라이브의 쇼룸 조회
 */
export const getLiveDetail = (liveId: number): Promise<LiveShowroomSchema> => {
  return baseApiClient.get<LiveShowroomSchema>(`/live/${liveId}`);
};
