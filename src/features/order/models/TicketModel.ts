import { TicketComboListSchema, TicketComboSchema } from '../schemas';

/**
 * 티켓 combo schema
 */
export interface TicketComboModel {
  label: string;
  value: number;
}

/**
 * 티켓 combo schema > 티켓 combo model convert
 */
export const toTicketComboModel = (item: TicketComboSchema): TicketComboModel => {
  return {
    label: item.name,
    value: item.id,
  };
};

/**
 * 티켓 combo list schema > 티켓 combo list model convert
 */
export const toTicketComboListModel = (item: TicketComboListSchema): Array<TicketComboModel> => {
  return item.items.map(toTicketComboModel);
};
