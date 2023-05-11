import { BrandComboSchema } from '../schemas';

/**
 * 브랜드 model
 */
export interface BrandComboModel {
  label: string;
  value: string;
}

export const toBrandComboModel = (item: BrandComboSchema): BrandComboModel => {
  return {
    label: item.name,
    value: item.id,
  };
};

export const toBrandComboList = (items: Array<BrandComboSchema>): Array<BrandComboModel> => {
  return items.map(toBrandComboModel);
};
