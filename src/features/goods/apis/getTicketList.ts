import { baseApiClient } from '@utils/api';
import { GoodsKind } from '@constants/goods';
import { TicketSchema, TicketGroupSchema, TicketGoodsSchema } from '../schemas';
import { ApiDomain } from '../constants';

// 티켓 리스트
export const getTicketList = (goodsKind: GoodsKind): Promise<TicketSchema[]> => {
  return baseApiClient.get(`${ApiDomain.Tickets}/combo?goodsKind=${goodsKind}`);
};

// 티켓 리스트 (그룹형)
export const getTicketGroupList = (goodsKind: GoodsKind): Promise<TicketGroupSchema[]> => {
  return baseApiClient.get(`${ApiDomain.Tickets}/group-combo?goodsKind=${goodsKind}`);
};

// 티켓 연결된 상품 조회
export const getTicketGoodsList = (ticketId: Number): Promise<TicketGoodsSchema[]> => {
  return baseApiClient.get(`${ApiDomain.Tickets}/${ticketId}/combo`);
};
