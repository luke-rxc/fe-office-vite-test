import { toDateFormat } from '@utils/date';
import SendBird from 'sendbird';
import { SendbirdMessageDataModel, toSendbirdMessageDataModel } from '.';

export interface SendBirdUserMessageModel extends Omit<SendBird.UserMessage, 'data'> {
  isAdmin: boolean;
  createdAtText: string;
  updatedAtText: string;
  nickname: string;
  _sender: SendBird.User;
  data: SendbirdMessageDataModel;
}

export interface SendBirdFileMessageModel extends SendBird.FileMessage {
  createdAtText: string;
  updatedAtText: string;
}

export interface SendBirdAdminMessageModel extends Omit<SendBird.AdminMessage, 'data'> {
  createdAtText: string;
  updatedAtText: string;
  data: SendbirdMessageDataModel;
}

export type SendBirdMessageType = SendBirdUserMessageModel | SendBirdFileMessageModel | SendBirdAdminMessageModel;

export const toSendbirdUserMessageModelList = (
  items: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
  userId?: string,
) => {
  return items.map((item) => toSendbirdUserMessageModel(item, userId));
};

export const toSendbirdUserMessageModel = (
  item: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage,
  userId?: string,
): SendBirdMessageType => {
  const convert = {
    ...item,
    createdAtText: toDateFormat(item.createdAt, 'HH:mm'),
    updatedAtText: toDateFormat(item.updatedAt, 'HH:mm'),
    customType: item.customType,
  };

  if (item.messageType === 'file') {
    return convert as SendBirdFileMessageModel;
  }

  if (item.messageType === 'admin') {
    return {
      ...convert,
      data: item.data ? toSendbirdMessageDataModel(JSON.parse(item.data)) : undefined,
    } as SendBirdAdminMessageModel;
  }

  return {
    ...convert,
    isAdmin: item.messageType === 'user' && item.sender.userId === userId,
    nickname: item.messageType === 'user' && item.sender.userId !== userId && item.sender.nickname,
    data: item.data ? toSendbirdMessageDataModel(JSON.parse(item.data)) : undefined,
  } as SendBirdUserMessageModel;
};
