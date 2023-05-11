import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';

/**
 * 쇼륨 콤보리스트
 */
export const getShowroomCombo = (providerId: number): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`/showroom/combo?providerId=${providerId}`);
};
