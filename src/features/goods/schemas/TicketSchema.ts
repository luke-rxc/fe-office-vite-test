import { TicketType } from '@constants/goods';

// 티켓 타입
export interface TicketResponseType {
  id: TicketType;
  name: string;
}

// 티켓 조회
export interface TicketSchema {
  id: number;
  name: string;
  channelName: string;
  periodDisplay: string;
  afterDay: number;
  type: TicketResponseType;
}

// 티켓 그룹 조회
export interface TicketGroupSchema {
  groupId: number;
  name: string;
  tickets: TicketSchema[];
}

// 티켓 연결된 상품 조회
export interface TicketGoodsSchema {
  id: number;
  name: string;
  price: number;
  consumerPrice: number;
  agentEventId: number;
  agentGoodsId: number;
}
