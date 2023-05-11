import { ComboItemSchema } from '../schemas';

/**
 *  combo item model
 */
export type ComboItemModel = {
  value: number | string;
  label: string;
};

/**
 *  combo model
 */
export type ComboModel = {
  items: ComboItemModel[];
};

/**
 *  combo item schema -> model convert
 */
export const toComboItemModel = (item: ComboItemSchema): ComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 *  combo item array schema -> model convert
 */
export const toComboListModel = (items: ComboItemSchema[]): ComboItemModel[] => {
  return items.map(toComboItemModel);
};
