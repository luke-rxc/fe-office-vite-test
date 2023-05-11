/**
 * Sendbird 메세지 타입
 */
export const SendbirdMessageType = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdMessageType = typeof SendbirdMessageType[keyof typeof SendbirdMessageType];

/**
 * Sendbird action 타입
 */
export const SendbirdActionType = {
  MESSAGE: 'MESSAGE',
  MESSAGE_FOR_ADMIN: 'MESSAGE_FOR_ADMIN',
  SUBSCRIBE_SHOWROOM: 'SUBSCRIBE_SHOWROOM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdActionType = typeof SendbirdActionType[keyof typeof SendbirdActionType];

/**
 * Sendbird sub action 타입
 */
export const SendbirdSubActionType = {
  FINAL_BIDDER: 'FINAL_BIDDER',
  ORDER_STATUS: 'ORDER_STATUS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdSubActionType = typeof SendbirdSubActionType[keyof typeof SendbirdSubActionType];

/**
 * Sendbird notice message type
 */
export const SendbirdNoticeMessageType = {
  FIX: 'FIX',
  TEMPORARY: 'TEMPORARY',
  SUBSCRIBE_SHOWROOM: 'SUBSCRIBE_SHOWROOM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdNoticeMessageType = typeof SendbirdNoticeMessageType[keyof typeof SendbirdNoticeMessageType];

export const SendbirdNoticeMessageTypeLabel: {
  [k in SendbirdNoticeMessageType]: string;
} = {
  FIX: '고정 메세지',
  TEMPORARY: '임시 메세지(5s)',
  SUBSCRIBE_SHOWROOM: '쇼룸 팔로우 요청',
};
