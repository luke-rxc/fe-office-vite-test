/**
 * live combo item schema
 */
export interface LiveComboItemSchema {
  id: number;
  name: string;
}

/**
 * live combo schema
 */
export interface LiveComboSchema {
  items: Array<LiveComboItemSchema>;
}

/**
 * live showroom schema
 */
export interface LiveShowroomSchema {
  showRoomId: number;
  showRoomName: string;
}
