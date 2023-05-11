import { OrderStep } from '@constants/order';
import { AuctionStatus, SendbirdActionType, SendbirdSubActionType } from '../constants';
import {
  SendbirdAuctionMetaSchema,
  SendbirdMessageDataOrderSchema,
  SendbirdMessageDataSchema,
  SendbirdMessageDataUserSchema,
} from '../schemas';

/**
 * Sendbird message data user model
 */
export interface SendbirdMessageDataUserModel {
  profileImage: string;
  nickname: string;
}

/**
 * Sendbird message data order model
 */
export interface SendbirdMessageDataOrderModel {
  id: number;
  orderStep: OrderStep;
  paymentDate: number;
}

/**
 * Sendbird message data model
 */
export interface SendbirdMessageDataModel {
  actionType: SendbirdActionType;
  user?: SendbirdMessageDataUserModel;
  subActionType: SendbirdSubActionType | undefined;
  order?: SendbirdMessageDataOrderModel;
  price?: number;
  actionValue?: string;
  actionIdentifier?: number;
}

/**
 * Sendbird message model
 */
export interface SendbirdMessageModel {
  createdAtText: string;
  data: SendbirdMessageDataModel;
  message: string;
  updatedAtText: string;
  // auctionId
  customType: string;
}

/**
 * SendbirdMessageDataUserSchema -> SendbirdMessageDataUserModel converter
 */
export const toSendbirdMessageDataUserModel = (item: SendbirdMessageDataUserSchema): SendbirdMessageDataUserModel => {
  return {
    profileImage: item.profile_image,
    nickname: item.nickname,
  };
};

/**
 * SendbirdMessageDataOrderSchema -> SendbirdMessageDataOrderModel converter
 */
export const toSendbirdMessageDataOrderModel = (
  item: SendbirdMessageDataOrderSchema,
): SendbirdMessageDataOrderModel => {
  return {
    id: item.id,
    orderStep: item.order_step,
    paymentDate: item.payment_date,
  };
};

/**
 * SendbirdMessageDataSchema -> SendbirdMessageDataModel converter
 */
export const toSendbirdMessageDataModel = (item: SendbirdMessageDataSchema): SendbirdMessageDataModel => {
  return {
    actionType: item.action_type,
    user: item.user ? toSendbirdMessageDataUserModel(item.user) : undefined,
    subActionType: item.sub_action_type,
    order: item.order ? toSendbirdMessageDataOrderModel(item.order) : undefined,
    price: item.price ?? undefined,
    actionValue: item.action_value ?? undefined,
    actionIdentifier: item.action_identifier ?? undefined,
  };
};

/**
 * Sendbird 경매정보 base meta model
 */
export interface SendbirdAuctionInfoBaseMetaModel {
  id: number;
  status: AuctionStatus;
  price: number;
  round: number;
}

/**
 * Sendbird 경매정보 countdown meta model
 */
export interface SendbirdActionInfoCountdownMetaModel {
  id: number;
  status: AuctionStatus;
  auction_timer: {
    seconds: number;
    time: number;
  };
}

/**
 * Sendbird 경매 meta model
 */
export interface SendbirdAuctionMetaModel {
  auction_info: SendbirdActionInfoCountdownMetaModel & SendbirdAuctionInfoBaseMetaModel;
}

/**
 * SendbirdAuctionMetaSchema -> SendbirdAuctionMetaModel converter
 */
export const toSendbirdAuctionMetaModel = (item: SendbirdAuctionMetaSchema): SendbirdAuctionMetaModel => {
  return {
    auction_info: JSON.parse(item.auction_info),
  };
};
