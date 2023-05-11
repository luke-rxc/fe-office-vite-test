import { KeywordComboItemSchema, KeywordComboSchema } from '../schemas';

/**
 * keyword combo item model
 */
export interface KeywordComboItemModel {
  value: number;
  label: string;
}

/**
 * keyword combo item schema -> model convert
 */
export const toKeywordComboItemModel = (item: KeywordComboItemSchema): KeywordComboItemModel => {
  return {
    value: item.id,
    label: item.name,
  };
};

/**
 * keyword combo schema -> model convert
 */
export const toKeywordComboListModel = (item: KeywordComboSchema): Array<KeywordComboItemModel> => {
  return item.items.map(toKeywordComboItemModel);
};
