import { baseApiClient } from '@utils/api';
import { ComboBankSchema, ComboMDListSchema, DeliveryCompaniesComboItem } from '../schemas';

/**
 * 배송사 목록코드 리스트 조회
 */
export const getDeliveryCompaniesComboList = (): Promise<Array<DeliveryCompaniesComboItem>> =>
  baseApiClient.get<Array<DeliveryCompaniesComboItem>>(`/common/combo/delivery-companies`);

/**
 * 은행코드 콤보리스트
 */
export const getBankCombo = (): Promise<Array<ComboBankSchema>> => {
  return baseApiClient.get<Array<ComboBankSchema>>(`/common/combo/bank`);
};

/**
 * MD 콤보리스트
 */
export const getMDCombo = (): Promise<ComboMDListSchema> => {
  return baseApiClient.get<ComboMDListSchema>(`/common/combo/MD`);
};
