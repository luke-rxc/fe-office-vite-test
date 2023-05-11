/**
 * 주문 로그 item schema
 */
export interface OrderLogItemSchema {
  id: number;
  domain: string;
  domainPrimaryId: number;
  domainSubId: null;
  message: string;
  userId: number;
  name: string;
  requestJson: string;
  origin: string;
  originName: string;
  createdDateTime: number;
}

/**
 * 주문 로그 schema
 */
export interface OrderLogSchema {
  logs: Array<OrderLogItemSchema>;
}
