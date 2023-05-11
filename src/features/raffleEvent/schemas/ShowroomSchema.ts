/**
 * showroom combo item schema
 */
export interface ShowroomComboItemSchema {
  id: number;
  name: string;
}

/**
 * showroom combo schema
 */
export interface ShowroomComboSchema {
  items: Array<ShowroomComboItemSchema>;
}
