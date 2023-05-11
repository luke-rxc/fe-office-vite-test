import { OrderProviderSchema } from '.';

/**
 * 주문 메모 item schema
 */
export interface OrderMemoItemSchema {
  id: number;
  domain: string;
  orderId: number;
  subId: number;
  message: string;
  provider: OrderProviderSchema;
  createdAdmin: {
    id: number;
    principalType: string;
    name: string;
  };
  createdDateTime: number;
}
