/**
 *  combo item schema
 */
export type ComboItemSchema = {
  id: number;
  name: string;
};

/**
 *  combo schema
 */
export type ComboSchema = {
  items: ComboItemSchema[];
};
