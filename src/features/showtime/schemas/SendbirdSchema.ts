import { OrderStep } from '@constants/order';
import { SendbirdActionType, SendbirdSubActionType } from '../constants';

/**
 * Sendbird 경매 meta schema
 */
export interface SendbirdAuctionMetaSchema {
  auction_info: string;
}

/**
 * Sendbird message data user schema
 */
export interface SendbirdMessageDataUserSchema {
  profile_image: string;
  nickname: string;
}

/**
 * Sendbird message data order schema
 */
export interface SendbirdMessageDataOrderSchema {
  id: number;
  order_step: OrderStep;
  payment_date: number;
}

/**
 * Sendbird message data schema
 */
export interface SendbirdMessageDataSchema {
  action_type: SendbirdActionType;
  user?: SendbirdMessageDataUserSchema;
  sub_action_type: SendbirdSubActionType | undefined;
  order?: SendbirdMessageDataOrderSchema;
  price?: number;
  action_value?: string;
  action_identifier?: number;
}
