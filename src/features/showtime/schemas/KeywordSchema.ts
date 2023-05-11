/**
 * keyword combo item schema
 */
export interface KeywordComboItemSchema {
  id: number;
  name: string;
}

/**
 * keyword combo schema
 */
export interface KeywordComboSchema {
  items: Array<KeywordComboItemSchema>;
}
