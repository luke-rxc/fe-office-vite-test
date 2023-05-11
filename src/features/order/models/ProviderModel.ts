import { ProviderComboListSchema, ProviderComboSchema } from '../schemas';

/**
 * 입점사 combo schema
 */
export interface ProviderComboModel {
  label: string;
  value: number;
}

/**
 * 입점사 combo schema > 입점사 combo model convert
 */
export const toProviderComboModel = (item: ProviderComboSchema): ProviderComboModel => {
  return {
    label: item.name,
    value: item.id,
  };
};

/**
 * 입점사 combo list schema > 입점사 combo list model convert
 */
export const toProviderComboListModel = (item: ProviderComboListSchema): Array<ProviderComboModel> => {
  return item.items.map(toProviderComboModel);
};
