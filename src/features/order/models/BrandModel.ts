import { BrandComboListSchema, BrandComboSchema } from '../schemas';

/**
 * 브랜드 combo schema
 */
export interface BrandComboModel {
  label: string;
  value: number;
}

/**
 * 브랜드 combo schema > 브랜드 combo model convert
 */
export const toBrandComboModel = (item: BrandComboSchema): BrandComboModel => {
  return {
    label: item.name,
    value: item.id,
  };
};

/**
 * 브랜드 combo list schema > 브랜드 combo list model convert
 */
export const toBrandComboListModel = (item: BrandComboListSchema): Array<BrandComboModel> => {
  return item.items.map(toBrandComboModel);
};
