import { baseApiClient } from '@utils/api';
import { ShowroomComboSchema } from '../schemas';

export const getShowroomCombo = (): Promise<ShowroomComboSchema> => {
  return baseApiClient.get<ShowroomComboSchema>(`/common/combo/SHOW_ROOM`);
};
