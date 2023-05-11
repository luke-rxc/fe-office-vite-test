import { createContext } from 'react';
import { SendBirdUserMessageModel } from '../models';
import { MenuItemOption } from '../types';

export interface ChatContextValue {
  messageAreaWidth: number;
  getMenuItems?: (chatItem: SendBirdUserMessageModel) => Array<MenuItemOption>;
  updateChatItemHeight: (index: number, size: number) => void;
  onSetNicknameToMessageField?: (nickname: string) => (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const ChatContext = createContext<ChatContextValue>(null);
