import { baseApiClient } from '@utils/api';
import { ShowroomComboSchema } from '../schemas';

/**
 * 쇼룸 콤보 리스트 조회 (최신 3개월)
 */
export const getShowroomCombo = (): Promise<ShowroomComboSchema> => {
  return baseApiClient.get<ShowroomComboSchema>(`/common/combo/SHOW_ROOM`);
};
