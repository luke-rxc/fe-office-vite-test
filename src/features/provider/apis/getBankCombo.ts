import { baseApiClient } from '@utils/api';
import { ComboBankSchema } from '../schemas';

/**
 * 은행 콤보리스트
 */
export const getBankCombo = (): Promise<ComboBankSchema[]> => {
  return baseApiClient.get<ComboBankSchema[]>(`/common/combo/bank`);
};
