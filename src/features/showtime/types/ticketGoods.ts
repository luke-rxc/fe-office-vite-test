/**
 * 티켓 상품
 */
export interface TicketGoods {
  id: number;
  afterDay: number | null;
  startDateTime: number | null;
  name: string | null;
  expiredDateTime: number | null;
}
