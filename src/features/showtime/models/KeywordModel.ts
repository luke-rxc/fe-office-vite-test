import { KeywordComboItemSchema } from '../schemas';

/**
 * keyword combo item model
 */
export interface KeywordComboItemModel {
  value: number;
  label: string;
}

/**
 * keyword combo model
 */
export interface KeywordComboModel {
  items: Array<KeywordComboItemModel>;
}

/**
 * showrooom combo item schema -> model convert
 */
export const toKeywordComboItemModel = (item: KeywordComboItemSchema): KeywordComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * showrooom combo item array schema -> model convert
 */
export const toKeywordComboListModel = (items: Array<KeywordComboItemSchema>): Array<KeywordComboItemModel> => {
  return items.map(toKeywordComboItemModel);
};
