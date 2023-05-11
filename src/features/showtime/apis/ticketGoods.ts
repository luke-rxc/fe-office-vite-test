import { baseApiClient } from '@utils/api';
import { TicketGoodsComboSchema } from '../schemas';

/**
 * 티켓 상품 combo 조회
 */
export const getTicketGoodsCombo = (): Promise<Array<TicketGoodsComboSchema>> => {
  return baseApiClient.get<Array<TicketGoodsComboSchema>>(`/tickets/combo?goodsKind=TICKET_NORMAL`);
};
