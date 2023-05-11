import { ComboBankSchema, ComboMDListSchema, ComboMDSchema, DeliveryCompaniesComboItem } from '../schemas';

/**
 *  combo bank model
 */
export interface ComboBankModel {
  value: string;
  label: string;
}

/**
 *  combo MD model
 */
export interface ComboMDModel {
  value: number;
  label: string;
}

/**
 *  combo delivery company model
 */
export interface ComboDeliveryCompanyModel {
  value: string;
  label: string;
}

/**
 * combo bank schema > combo bank model convert
 */
export const toComboBankModel = (item: ComboBankSchema): ComboBankModel => {
  return {
    value: item.value,
    label: item.name,
  };
};

/**
 * combo bank schema list > combo bank model list convert
 */
export const toComboBankListModel = (items: Array<ComboBankSchema>): Array<ComboBankModel> => {
  return items.map(toComboBankModel);
};

/**
 * combo MD schema > combo MD model convert
 */
export const toComboMDModel = (item: ComboMDSchema): ComboMDModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * combo MD schema list > combo MD model list convert
 */
export const toComboMDListModel = (item: ComboMDListSchema): Array<ComboMDModel> => {
  return item.items.map(toComboMDModel);
};

/**
 * 배송사 목록 combo item > combo delivery company model convert
 */
export const toComboDeliveryCompanyModel = (item: DeliveryCompaniesComboItem): ComboDeliveryCompanyModel => {
  return {
    value: item.code,
    label: item.name,
  };
};

/**
 * 배송사 목록 combo item list > combo delivery company model list convert
 */
export const toComboDeliveryCompanyListModel = (
  items: Array<DeliveryCompaniesComboItem>,
): Array<ComboDeliveryCompanyModel> => {
  return items.map(toComboDeliveryCompanyModel);
};
