import { TOption } from '@components/Select';
import { LiveComboItemSchema, LiveComboSchema, LiveShowroomSchema } from '../schemas';

/**
 * live combo item model
 */
export interface LiveComboItemModel extends TOption {}

/**
 * live combo model
 */
export interface LiveComboModel {
  items: Array<LiveComboItemModel>;
}

/**
 * live combo item schema -> model convert
 */
export const toLiveComboItemModel = (item: LiveComboItemSchema): LiveComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * live combo item array schema -> model convert
 */
export const toLiveComboModel = ({ items }: LiveComboSchema): Array<LiveComboItemModel> => {
  return items.map(toLiveComboItemModel);
};

/**
 * live showroom model
 */
export interface LiveShowroomModel extends LiveShowroomSchema {
  showRoomInfoText: string;
}

/**
 * live showroom schema > live showroom model
 */
export const toLiveShowroomModel = (item: LiveShowroomSchema): LiveShowroomModel => {
  return {
    ...item,
    showRoomInfoText: `${item.showRoomName} (${item.showRoomId})`,
  };
};
