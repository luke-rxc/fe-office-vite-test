import { ComboItemSchema } from '../schemas';

export type ComboItemModel = {
  value: number;
  label: string;
};

export type ComboModel = {
  items: ComboItemModel[];
};

export const toComboItemModel = (item: ComboItemSchema): ComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

export const toComboListModel = (items: ComboItemSchema[]): ComboItemModel[] => {
  return items.map(toComboItemModel);
};
