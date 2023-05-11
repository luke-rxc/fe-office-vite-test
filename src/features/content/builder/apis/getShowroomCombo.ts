import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';

/**
 * 쇼룸 콤보리스트
 */
export const getShowroomCombo = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`/showroom/combo`);
};
