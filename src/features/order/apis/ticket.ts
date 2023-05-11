import { baseApiClient } from '@utils/api';
import { TicketComboListSchema } from '../schemas';

/**
 * 티켓 콤보 박스 조회
 */
export const getTicketCombo = (): Promise<TicketComboListSchema> => {
  return baseApiClient.get<TicketComboListSchema>('/common/combo/TICKET');
};
