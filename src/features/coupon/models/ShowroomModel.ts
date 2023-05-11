import { ShowroomComboItemSchema } from '../schemas';

/**
 * showroom combo item model
 */
export interface ShowroomComboItemModel {
  value: number;
  label: string;
}

/**
 * showroom combo model
 */
export interface ShowroomComboModel {
  items: Array<ShowroomComboItemModel>;
}

/**
 * showroom combo item schema -> model convert
 */
export const toShowroomComboItemModel = (item: ShowroomComboItemSchema): ShowroomComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * showroom combo item array schema -> model convert
 */
export const toShowroomComboListModel = (items: Array<ShowroomComboItemSchema>): Array<ShowroomComboItemModel> => {
  return items.map(toShowroomComboItemModel);
};
