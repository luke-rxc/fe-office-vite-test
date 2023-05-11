/**
 * 티켓 combo schema
 */
export interface TicketComboSchema {
  id: number;
  name: string;
}

/**
 * 티켓 combo list schema
 */
export interface TicketComboListSchema {
  items: Array<TicketComboSchema>;
}
