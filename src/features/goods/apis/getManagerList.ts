import { baseApiClient } from '@utils/api';
import { ComboSchema } from '../schemas';
import { ApiDomain } from '../constants';

// 운영 담당자 리스트
export const getManagerList = (): Promise<ComboSchema> => {
  return baseApiClient.get<ComboSchema>(`${ApiDomain.CommonCombo}/GOODS_MANAGER`);
};
