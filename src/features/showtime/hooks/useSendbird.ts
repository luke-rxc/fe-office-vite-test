import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import _ from 'lodash';
import { useCallback, useEffect, useReducer } from 'react';
import SendBird from 'sendbird';
import { SendbirdActionType } from '../constants';
import { ShowroomComboItemModel, ShowtimeChatChannelModel } from '../models';
import {
  SendBirdAdminMessageModel,
  SendBirdMessageType,
  toSendbirdUserMessageModel,
  toSendbirdUserMessageModelList,
} from '../models/SendbirdApiModel';
import { SendbirdAuctionMetaSchema } from '../schemas';
import { v4 as uuidv4 } from 'uuid';
import { getDiffMillisecondByToDate } from '../utils';
import toast from 'react-hot-toast';

interface SendbirdState {
  initialSendBird: boolean; // Sendbird 초기화 여부
  useMessageSearch: boolean; // 메세지 검색 사용여부
  completeLoadFirstMessage: boolean; // 초기메세지 로드완료 여부
  completeLoadPreviousMessage: boolean; // 이전메세지 로드완료 여부
  sendbird: SendBird.SendBirdInstance | null; // Sendbird 인스턴스
  liveChatChannel: SendBird.OpenChannel | null;
  auctionChatChannel: SendBird.OpenChannel | null;
  interactionChannel: SendBird.OpenChannel | null;
  messages: Array<SendBirdMessageType>;
  adminMessages: Array<SendBirdAdminMessageModel>; // 임시 공지메세지
  auctionMessages: Array<SendBirdAdminMessageModel>;
  noticeMessage: string; // 고정메세지
  showroomSubscribeInfo: string; // 쇼룸구독요청 정보
  banedUserList: Array<SendBird.User>;
  mutedUserList: Array<SendBird.User>;
  lastMessageId: number;
}

/**
 * Sendbird action type
 */
export const SendbirdReduceActionType = {
  SET_INSTANCE: 'SET_INSTANCE',
  SET_MESSAGE: 'SET_MESSAGE',
  SET_AUCTION_MESSAGES: 'SET_AUCTION_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  ADD_AUCTION_MESSAGE: 'ADD_AUCTION_MESSAGE',
  ADD_ADMIN_MESSAGE: 'ADD_ADMIN_MESSAGE',
  UPDATE_NOTICE_MESSAGE: 'UPDATE_NOTICE_MESSAGE',
  UPDATE_BANED_USER_LIST: 'UPDATE_BANED_USER_LIST',
  UPDATE_MUTED_USER_LIST: 'UPDATE_MUTED_USER_LIST',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  ADD_PREVIOUS_MESSAGES: 'ADD_PREVIOUS_MESSAGES',
  ADD_PREVIOUS_AUCTION_MESSAGES: 'ADD_PREVIOUS_AUCTION_MESSAGES',
  UPDATE_USE_SEARCH_MESSAGE: 'UPDATE_USE_SEARCH_MESSAGE',
  UPDATE_SHOWROOM_SUBSCRIBE: 'UPDATE_SHOWROOM_SUBSCRIBE',
  DELETE_SHOWROOM_SUBSCRIBE: 'DELETE_SHOWROOM_SUBSCRIBE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdReduceActionType = typeof SendbirdReduceActionType[keyof typeof SendbirdReduceActionType];

type SendbirdAction =
  | {
      type: 'SET_INSTANCE';
      payload: {
        sendbird: SendBird.SendBirdInstance;
        liveChatChannel: SendBird.OpenChannel;
        interactionChannel: SendBird.OpenChannel;
        auctionChatChannel: SendBird.OpenChannel | null;
      };
    }
  | {
      type: 'SET_MESSAGE';
      payload: {
        messages: Array<SendBirdMessageType>;
        adminMessages: Array<SendBirdAdminMessageModel>;
        auctionMessages: Array<SendBirdAdminMessageModel>;
        noticeMessage: string;
        banedUserList: Array<SendBird.User>;
        mutedUserList: Array<SendBird.User>;
      };
    }
  | {
      type: 'ADD_MESSAGE';
      payload: {
        message: SendBirdMessageType;
      };
    }
  | {
      type: 'SET_AUCTION_MESSAGES';
      payload: {
        auctionMessages: Array<SendBirdAdminMessageModel>;
      };
    }
  | {
      type: 'ADD_AUCTION_MESSAGE';
      payload: {
        auctionMessage: SendBirdAdminMessageModel;
      };
    }
  | {
      type: 'ADD_ADMIN_MESSAGE';
      payload: {
        adminMessage: SendBirdAdminMessageModel;
      };
    }
  | {
      type: 'UPDATE_NOTICE_MESSAGE';
      payload: {
        noticeMessage: string;
      };
    }
  | {
      type: 'UPDATE_BANED_USER_LIST';
      payload: {
        banedUserList: Array<SendBird.User>;
      };
    }
  | {
      type: 'UPDATE_MUTED_USER_LIST';
      payload: {
        mutedUserList: Array<SendBird.User>;
      };
    }
  | {
      type: 'UPDATE_MESSAGE';
      payload: {
        message: SendBirdMessageType;
      };
    }
  | {
      type: 'DELETE_MESSAGE';
      payload: {
        messageId: number;
        messageType: 'user' | 'admin';
      };
    }
  | {
      type: 'ADD_PREVIOUS_MESSAGES';
      payload: {
        messages: Array<SendBirdMessageType>;
        lastMessageId: number;
      };
    }
  | {
      type: 'ADD_PREVIOUS_AUCTION_MESSAGES';
      payload: {
        auctionMessages: Array<SendBirdAdminMessageModel>;
      };
    }
  | {
      type: 'UPDATE_USE_SEARCH_MESSAGE';
      payload: {
        useMessageSearch: boolean;
      };
    }
  | {
      type: 'UPDATE_SHOWROOM_SUBSCRIBE';
      payload: {
        showroomSubscribeInfo: string;
      };
    }
  | {
      type: 'DELETE_SHOWROOM_SUBSCRIBE';
    };

const initialState: SendbirdState = {
  initialSendBird: false,
  useMessageSearch: false,
  completeLoadFirstMessage: false,
  completeLoadPreviousMessage: false,
  sendbird: null,
  liveChatChannel: null,
  auctionChatChannel: null,
  interactionChannel: null,
  adminMessages: null,
  auctionMessages: [],
  messages: [],
  noticeMessage: null,
  showroomSubscribeInfo: null,
  banedUserList: null,
  mutedUserList: null,
  lastMessageId: null,
};

function reducer(state: SendbirdState, action: SendbirdAction) {
  switch (action.type) {
    case SendbirdReduceActionType.SET_INSTANCE:
      return {
        ...state,
        sendbird: action.payload.sendbird,
        liveChatChannel: action.payload.liveChatChannel,
        interactionChannel: action.payload.interactionChannel,
        auctionChatChannel: action.payload.auctionChatChannel,
        initialSendBird: true,
      };
    case SendbirdReduceActionType.SET_MESSAGE:
      return {
        ...state,
        completeLoadFirstMessage: true,
        messages: action.payload.messages,
        adminMessages: action.payload.adminMessages,
        auctionMessages: action.payload.auctionMessages,
        noticeMessage: action.payload.noticeMessage ?? null,
        banedUserList: action.payload.banedUserList,
        mutedUserList: action.payload.mutedUserList,
      };
    case SendbirdReduceActionType.ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.payload.message),
      };
    case SendbirdReduceActionType.SET_AUCTION_MESSAGES:
      return {
        ...state,
        auctionMessages: action.payload.auctionMessages,
      };
    case SendbirdReduceActionType.ADD_AUCTION_MESSAGE:
      return {
        ...state,
        auctionMessages: state.auctionMessages.concat(action.payload.auctionMessage),
      };
    case SendbirdReduceActionType.ADD_PREVIOUS_MESSAGES:
      return {
        ...state,
        completeLoadPreviousMessage: true,
        messages: action.payload.messages.concat(state.messages).sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        }),
        lastMessageId: action.payload.lastMessageId,
      };
    case SendbirdReduceActionType.ADD_PREVIOUS_AUCTION_MESSAGES:
      return {
        ...state,
        auctionMessages: action.payload.auctionMessages.concat(state.auctionMessages),
      };
    case SendbirdReduceActionType.ADD_ADMIN_MESSAGE:
      return {
        ...state,
        adminMessages: state.adminMessages.concat(action.payload.adminMessage),
      };
    case SendbirdReduceActionType.UPDATE_NOTICE_MESSAGE:
      return {
        ...state,
        noticeMessage: action.payload.noticeMessage,
      };
    case SendbirdReduceActionType.UPDATE_BANED_USER_LIST:
      return {
        ...state,
        banedUserList: action.payload.banedUserList,
      };
    case SendbirdReduceActionType.UPDATE_MUTED_USER_LIST:
      return {
        ...state,
        mutedUserList: action.payload.mutedUserList,
      };
    case SendbirdReduceActionType.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((item) => {
          if (item.messageId === action.payload.message.messageId) {
            return action.payload.message;
          }

          return item;
        }),
      };
    case SendbirdReduceActionType.DELETE_MESSAGE:
      const { messageId, messageType } = action.payload;
      return {
        ...state,
        messages:
          messageType === 'user' ? state.messages.filter((item) => item.messageId !== messageId) : state.messages,
        adminMessages:
          messageType === 'admin'
            ? state.adminMessages.filter((item) => item.messageId !== messageId)
            : state.adminMessages,
      };
    case SendbirdReduceActionType.UPDATE_USE_SEARCH_MESSAGE:
      const { useMessageSearch } = action.payload;
      return {
        ...state,
        useMessageSearch,
      };
    case SendbirdReduceActionType.UPDATE_SHOWROOM_SUBSCRIBE:
      const { showroomSubscribeInfo } = action.payload;
      return {
        ...state,
        showroomSubscribeInfo,
      };
    case SendbirdReduceActionType.DELETE_SHOWROOM_SUBSCRIBE:
      return {
        ...state,
        showroomSubscribeInfo: null,
      };
    default:
      throw new Error();
  }
}

interface Props {
  debug?: boolean;
  useMessageSearch?: boolean;
  useChannel?: {
    live?: boolean;
    interaction?: boolean;
    auction?: boolean;
  };
  chatChannelItem: ShowtimeChatChannelModel;
  showroomComboList?: Array<ShowroomComboItemModel>;
  isMessageScrollBottom?: (messageLength?: number) => boolean;
  toMessageScrollBottom?: (messageLength?: number) => void;
  handleUpdateShowScrollBottom: (isShow: boolean) => void;
  handleMessageReceived?: (
    channel: SendBird.OpenChannel | SendBird.GroupChannel,
    message: SendBird.AdminMessage | SendBird.UserMessage,
    userId: string,
  ) => void;
  handleMetaDataUpdated?: (
    channel: SendBird.OpenChannel | SendBird.GroupChannel,
    meta: SendbirdAuctionMetaSchema,
  ) => void;
}

export const useSendbird = ({
  debug = false,
  useMessageSearch = false,
  useChannel,
  chatChannelItem,
  showroomComboList,
  isMessageScrollBottom,
  toMessageScrollBottom,
  handleUpdateShowScrollBottom,
  handleMessageReceived,
  handleMetaDataUpdated,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { open: dialogOpen } = useDialog();
  const {
    live: useLiveChat,
    interaction: useInteractionChat,
    auction: useAuctionChat,
  } = useChannel || { live: true, interaction: true, auction: true };

  useEffect(() => {
    /**
     * Sendbird 연결
     */
    const connectSendbird = async () => {
      try {
        const sb = new SendBird({ appId: chatChannelItem.applicationId });
        await sb.connect(chatChannelItem.userId);

        const liveChatChannel = useLiveChat ? await sb.OpenChannel.getChannel(chatChannelItem.liveChatUrl) : null;
        const auctionChatChannel =
          useAuctionChat && chatChannelItem.auctionChatUrl
            ? await sb.OpenChannel.getChannel(chatChannelItem.auctionChatUrl)
            : null;
        const interactionChannel = useInteractionChat
          ? await sb.OpenChannel.getChannel(chatChannelItem.interactionChatUrl)
          : null;

        if (liveChatChannel) {
          await liveChatChannel.enter();
        }

        if (auctionChatChannel) {
          await auctionChatChannel.enter();
        }

        if (interactionChannel) {
          await interactionChannel.enter();
        }

        dispatch({
          type: SendbirdReduceActionType.SET_INSTANCE,
          payload: {
            sendbird: sb,
            liveChatChannel,
            auctionChatChannel,
            interactionChannel,
          },
        });
      } catch (error) {
        window.console.log(error);
      }
    };

    if (state.initialSendBird) {
      return;
    }

    chatChannelItem && connectSendbird();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatChannelItem, useMessageSearch, state.initialSendBird]);

  useEffect(() => {
    dispatch({
      type: SendbirdReduceActionType.UPDATE_USE_SEARCH_MESSAGE,
      payload: {
        useMessageSearch,
      },
    });
  }, [useMessageSearch]);

  /**
   * sendbird 메세지 로드
   */
  const getLoadMessages = async (listQuery: SendBird.PreviousMessageListQuery, limit: number = 100) => {
    return new Promise<Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>>(
      (resolve, reject) => {
        return listQuery.load(limit, false, 0, (messages, error) => {
          if (error) {
            reject(error);
          }

          resolve(messages);
        });
      },
    );
  };

  /**
   * 이전 메세지 전체 조회
   */
  const getPreviousAllMessage = useCallback(
    async (messageId: number, nextMessages?: Array<SendBirdMessageType>) => {
      const messages = await getPreviousMessageById(messageId, 200);
      if (messages) {
        const mergeMessages = (nextMessages ? [...messages, ...nextMessages] : messages).sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        });
        return await getPreviousAllMessage(messages[0].messageId, mergeMessages);
      } else {
        return nextMessages;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.sendbird],
  );

  /**
   * 이전 메세지 조회
   */
  const getPreviousMessage = useCallback(
    async (channel: SendBird.OpenChannel) => {
      const listQuery = channel.createPreviousMessageListQuery();

      const loadMessages = await getLoadMessages(listQuery, 200);
      const convertMessage = toSendbirdUserMessageModelList(loadMessages, chatChannelItem.userId);

      // 초기 로드시 adminMessage는 로드하지 않음

      // const adminMessages = convertMessage
      //   .filter((item) => {
      //     return item.messageType === 'admin' && item.data?.actionType === SendbirdActionType.MESSAGE;
      //   })
      //   .map((item) => item as SendBirdAdminMessageModel);

      const messages = convertMessage
        .filter((item) => item.messageType !== 'admin')
        .sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        });
      return {
        messages,
        adminMessages: [],
      };
    },
    [chatChannelItem.userId],
  );

  /**
   * 이전 interaction 메세지 조회
   */
  const getPreviousInteractionMessage = useCallback(
    async (channel: SendBird.OpenChannel) => {
      const listQuery = channel.createPreviousMessageListQuery();

      const loadMessages = await getLoadMessages(listQuery);
      const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<SendBird.AdminMessage>);

      const interactionMessage = convertMessages
        .filter((item) => {
          return item.messageType === 'admin' && item.data?.actionType === SendbirdActionType.SUBSCRIBE_SHOWROOM;
        })
        .map((item: SendBirdAdminMessageModel) => {
          const { actionIdentifier } = item.data;
          const showroomName = showroomComboList?.find((item) => item.value === actionIdentifier)?.label ?? null;
          const showroomInfo = showroomName ? ` - ${showroomName} (${actionIdentifier})` : '';
          item.message = `[쇼룸 팔로우 요청 메시지 발송 완료]${showroomInfo}`;
          // data.messageType = 'user';
          return item;
        });

      return interactionMessage;
    },
    [showroomComboList],
  );

  /**
   * ban 사용자 리스트 조회
   */
  const getBanedUserList = useCallback(async (channel: SendBird.OpenChannel) => {
    const query = channel.createBannedUserListQuery();
    return await query.next();
  }, []);

  /**
   * mute 사용자 리스트 조회
   */
  const getMutedUserList = useCallback(async (channel: SendBird.OpenChannel) => {
    const query = channel.createMutedUserListQuery();
    return await query.next();
  }, []);

  /**
   * 이전 interaction 메세지 조회
   */
  const getPreviousAuctionMessage = useCallback(async (channel: SendBird.OpenChannel) => {
    const listQuery = channel.createPreviousMessageListQuery();
    const loadMessages = await getLoadMessages(listQuery, 100);
    const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<SendBird.AdminMessage>);
    const auctionMessage = convertMessages.map((item) => item as SendBirdAdminMessageModel);

    return auctionMessage;
  }, []);

  const debugLog = (...props: any[]) => {
    if (debug) {
      window.console.log(props);
    }
  };

  useEffect(() => {
    /**
     * 메세지 정보 initialize
     */
    const initializeMessage = async () => {
      const { messages, adminMessages } = state.liveChatChannel
        ? await getPreviousMessage(state.liveChatChannel)
        : { messages: [], adminMessages: [] };
      const interactionMessage = state.interactionChannel
        ? await getPreviousInteractionMessage(state.interactionChannel)
        : [];
      const auctionMessages = state.auctionChatChannel ? await getPreviousAuctionMessage(state.auctionChatChannel) : [];
      const noticeMessage = state.liveChatChannel ? await getNoticeMessage(state.liveChatChannel) : '';
      const banedUserList = state.liveChatChannel ? await getBanedUserList(state.liveChatChannel) : [];
      const mutedUserList = state.liveChatChannel ? await getMutedUserList(state.liveChatChannel) : [];

      // live chat messages, interaction chat messages merge
      const mergeMessages = messages.concat(interactionMessage).sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      });

      dispatch({
        type: SendbirdReduceActionType.SET_MESSAGE,
        payload: {
          messages: mergeMessages,
          adminMessages,
          auctionMessages,
          noticeMessage,
          banedUserList,
          mutedUserList,
        },
      });

      if (isMessageScrollBottom && !isMessageScrollBottom()) {
        toMessageScrollBottom && toMessageScrollBottom();
      }
    };

    state.sendbird && initializeMessage();

    return () => {
      state.sendbird && state.sendbird.removeChannelHandler(chatChannelItem.applicationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sendbird]);

  useEffect(() => {
    const setEvent = (channelHandler: SendBird.ChannelHandler) => {
      // 사용자 메세지 받을시 호출 event
      channelHandler.onMessageReceived = (channel, message) => {
        debugLog('[sendbird - onMessageReceived]', channel.url, message);
        if (message.messageType === 'file') {
          return;
        }

        handleMessageReceived && handleMessageReceived(channel, message, chatChannelItem.userId);

        if (state.liveChatChannel?.url === channel.url) {
          const isScrollBottom = isMessageScrollBottom?.() ?? false;
          const convertModel = toSendbirdUserMessageModel(message, chatChannelItem.userId);
          if (convertModel.messageType === 'admin' && convertModel.data?.actionType === SendbirdActionType.MESSAGE) {
            dispatch({
              type: SendbirdReduceActionType.ADD_ADMIN_MESSAGE,
              payload: {
                adminMessage: convertModel,
              },
            });

            setTimeout(() => {
              dispatch({
                type: SendbirdReduceActionType.DELETE_MESSAGE,
                payload: {
                  messageId: convertModel.messageId,
                  messageType: 'admin',
                },
              });
            }, 5000);
          } else {
            dispatch({
              type: SendbirdReduceActionType.ADD_MESSAGE,
              payload: {
                message: convertModel,
              },
            });

            if (isScrollBottom) {
              toMessageScrollBottom && toMessageScrollBottom();
            } else {
              handleUpdateShowScrollBottom(true);
            }
          }
        }

        if (state.interactionChannel?.url === channel.url) {
          const item = toSendbirdUserMessageModel(message, chatChannelItem.userId);

          if (!(item.messageType === 'admin' && item.data?.actionType === SendbirdActionType.SUBSCRIBE_SHOWROOM)) {
            return;
          }

          const { actionIdentifier, actionValue } = item.data;
          const showroomName = showroomComboList?.find((item) => item.value === actionIdentifier)?.label ?? null;
          const showroomInfo = showroomName ? ` - ${showroomName} (${actionIdentifier})` : '';

          dispatch({
            type: SendbirdReduceActionType.ADD_MESSAGE,
            payload: {
              message: {
                ...item,
                message: `[쇼룸 팔로우 요청 메시지 발송 완료]${showroomInfo}`,
              },
            },
          });

          toMessageScrollBottom && toMessageScrollBottom();

          toast.success(`쇼룸 팔로우 유도 팝업 노출중${showroomInfo}`, { duration: 10000, style: { width: '100%' } });
          setTimeout(() => {
            dispatch({
              type: SendbirdReduceActionType.UPDATE_SHOWROOM_SUBSCRIBE,
              payload: {
                showroomSubscribeInfo: `쇼룸 팔로우 유도 팝업 노출중${showroomInfo}`,
              },
            });
          }, getDiffMillisecondByToDate(Number(actionValue)));

          setTimeout(() => {
            dispatch({
              type: SendbirdReduceActionType.DELETE_SHOWROOM_SUBSCRIBE,
            });
          }, getDiffMillisecondByToDate(Number(actionValue), 10000));
        }

        if (state.auctionChatChannel?.url === channel.url) {
          const isScrollBottom = isMessageScrollBottom?.() ?? false;
          const auctionMessage = toSendbirdUserMessageModel(
            message,
            chatChannelItem.userId,
          ) as SendBirdAdminMessageModel;

          const { data } = auctionMessage;
          if (typeof data === 'string') {
            return;
          }

          dispatch({
            type: SendbirdReduceActionType.ADD_AUCTION_MESSAGE,
            payload: {
              auctionMessage,
            },
          });

          if (isScrollBottom) {
            toMessageScrollBottom && setTimeout(() => toMessageScrollBottom(), 500);
          } else {
            handleUpdateShowScrollBottom(true);
          }
        }
      };

      // 사용자 메세지 갱신시 호출 event
      channelHandler.onMessageUpdated = (channel, message) => {
        debugLog('[sendbird - onMessageUpdated]', channel.url, message);
        if (state.liveChatChannel?.url !== channel.url || message.messageType !== 'user') {
          return;
        }

        const item = toSendbirdUserMessageModel(message, chatChannelItem.userId);

        dispatch({
          type: SendbirdReduceActionType.UPDATE_MESSAGE,
          payload: {
            message: item,
          },
        });
      };

      // 사용자 메세지 삭제시 호출 event
      channelHandler.onMessageDeleted = (channel, messageId) => {
        debugLog('[sendbird - onMessageDeleted]', channel.url, messageId);
        if (state.liveChatChannel?.url !== channel.url && state.interactionChannel.url !== channel.url) {
          return;
        }

        dispatch({
          type: SendbirdReduceActionType.DELETE_MESSAGE,
          payload: {
            messageId,
            messageType: state.liveChatChannel.url !== channel.url ? 'user' : 'admin',
          },
        });
      };

      // Meta data 받을시 호출 event
      channelHandler.onMetaDataUpdated = (channel, meta: SendbirdAuctionMetaSchema) => {
        debugLog('[sendbird - onMetaDataUpdated]', channel.url, meta);
        handleMetaDataUpdated && handleMetaDataUpdated(channel, meta);

        if (state.liveChatChannel?.url === channel.url) {
          const noticeMessage = _.get(meta, 'notice', null) as string;

          dispatch({
            type: SendbirdReduceActionType.UPDATE_NOTICE_MESSAGE,
            payload: {
              noticeMessage,
            },
          });
        }
      };

      // 사용자 mute 설정시 호출 event
      channelHandler.onUserMuted = updateMutedUserList;
      // 사용자 mute 설정해제시 호출 event
      channelHandler.onUserUnmuted = updateMutedUserList;
      // 사용자 ban 설정시 호출 event
      channelHandler.onUserBanned = updateBanedUserList;
      // 사용자 ban 설정해제시 호출 event
      channelHandler.onUserUnbanned = updateBanedUserList;
    };

    if (state?.sendbird) {
      var channelHandler = new state.sendbird.ChannelHandler();
      setEvent(channelHandler);
      state.sendbird.addChannelHandler(chatChannelItem.applicationId, channelHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sendbird, handleMessageReceived, handleMetaDataUpdated, isMessageScrollBottom, toMessageScrollBottom]);

  useEffect(() => {
    if (!state.useMessageSearch || !state.completeLoadFirstMessage) {
      return;
    }

    const loadPrevious = async () => {
      const userMessages = state.messages.filter((items) => items.messageType === 'user');
      if (userMessages.length > 0) {
        const messages = await getPreviousAllMessage(userMessages[0].messageId);
        dispatch({
          type: SendbirdReduceActionType.ADD_PREVIOUS_MESSAGES,
          payload: {
            messages: (messages || []).length > 0 ? messages : [],
            lastMessageId: (messages || []).length > 0 ? messages[0].messageId : null,
          },
        });
      } else {
        dispatch({
          type: SendbirdReduceActionType.ADD_PREVIOUS_MESSAGES,
          payload: {
            messages: [],
            lastMessageId: null,
          },
        });
      }
    };

    const load = async () => {
      await loadPrevious();
      toMessageScrollBottom && toMessageScrollBottom();
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completeLoadFirstMessage, state.useMessageSearch]);

  /**
   * 공지 메세지 조회
   */
  const getNoticeMessage = async (channel: SendBird.OpenChannel) => {
    const meta = await channel.getAllMetaData();
    return _.get(meta, 'notice', null) as string;
  };

  /**
   * 메세지 전송
   */
  const sendMessage = (message: string) => {
    const params = new state.sendbird.UserMessageParams();
    params.message = message;

    return new Promise<void>((resolve) => {
      state.liveChatChannel.sendUserMessage(params, (message, error) => {
        if (error) {
          return;
        }

        dispatch({
          type: SendbirdReduceActionType.ADD_MESSAGE,
          payload: {
            message: toSendbirdUserMessageModel(message, chatChannelItem.userId),
          },
        });
        resolve();
      });
    });
  };

  const confirm = (content: string, onConfirm: () => Promise<void>) => {
    dialogOpen({
      title: '확인',
      content,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        try {
          onConfirm();
        } catch (error) {
          alert(`처리도중 문제가 발생하였습니다.`);
        }
      },
    });
  };

  const alert = (content: string) => {
    dialogOpen({
      content,
      type: DialogType.ALERT,
    });
  };

  /**
   * 사용자 mute 설정
   */
  const setMuteUser = (user: SendBird.User) => {
    if (state.liveChatChannel.isOperator(state.sendbird.currentUser)) {
      confirm(`${user.nickname}님을 Mute 설정하시겠습니까?`, async () => {
        try {
          await state.liveChatChannel.muteUser(user);
          alert(`${user.nickname}님을 Mute 설정하였습니다.`);
        } catch (error) {
          alert(`처리도중 문제가 발생하였습니다.`);
        }
      });
    }
  };

  /**
   * 사용자 mute 설정해제
   */
  const setUnmuteUser = (user: SendBird.User) => {
    if (state.liveChatChannel.isOperator(state.sendbird.currentUser)) {
      confirm(`${user.nickname}님을 Mute 해제하시겠습니까?`, async () => {
        try {
          await state.liveChatChannel.unmuteUser(user);
          alert(`${user.nickname}님을 Mute 해제하였습니다.`);
        } catch (error) {
          alert(`처리도중 문제가 발생하였습니다.`);
        }
      });
    }
  };

  /**
   * 사용자 ban 설정
   */
  const setBanUser = (user: SendBird.User) => {
    if (state.liveChatChannel.isOperator(state.sendbird.currentUser)) {
      confirm(`${user.nickname}님을 Ban 설정하시겠습니까?`, async () => {
        try {
          await state.liveChatChannel.banUser(user);
          alert(`${user.nickname}님을 Ban 설정하였습니다.`);
        } catch (error) {
          alert(`처리도중 문제가 발생하였습니다.`);
        }
      });
    }
  };

  /**
   * 사용자 ban 설정해제
   */
  const setUnbanUser = (user: SendBird.User) => {
    if (state.liveChatChannel.isOperator(state.sendbird.currentUser)) {
      confirm(`${user.nickname}님을 Ban 해제하시겠습니까?`, async () => {
        try {
          await state.liveChatChannel.unbanUser(user);
          alert(`${user.nickname}님을 Ban 해제하였습니다.`);
        } catch (error) {
          alert(`처리도중 문제가 발생하였습니다.`);
        }
      });
    }
  };

  /**
   * 사용자 mute 목록 갱신
   */
  const updateMutedUserList = async () => {
    const mutedUserList = await getMutedUserList(state.liveChatChannel);
    dispatch({
      type: SendbirdReduceActionType.UPDATE_MUTED_USER_LIST,
      payload: {
        mutedUserList,
      },
    });
  };

  /**
   * 사용자 ban 목록 갱신
   */
  const updateBanedUserList = async () => {
    const banedUserList = await getBanedUserList(state.liveChatChannel);
    dispatch({
      type: SendbirdReduceActionType.UPDATE_BANED_USER_LIST,
      payload: {
        banedUserList,
      },
    });
  };

  /**
   * message id 이전 메세지 조회
   */
  const getPreviousMessageById = async (messageId: number, limit: number = 20) => {
    const params = new state.sendbird.MessageListParams();
    params.isInclusive = false;
    params.prevResultSize = limit;
    params.nextResultSize = 0;
    params.reverse = false;
    params.messageType = '';

    const loadMessages = await new Promise<Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>>(
      (resolve, reject) => {
        return state.liveChatChannel.getMessagesByMessageId(messageId, params, (messages, error) => {
          if (error) {
            reject(error);
          }

          resolve(messages);
        });
      },
    );

    const convertMessage = toSendbirdUserMessageModelList(loadMessages, chatChannelItem.userId);

    const messages = convertMessage
      .filter((item) => item.messageType !== 'admin')
      .sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      });

    if (messages.length === 0) {
      return false;
    }

    return messages;
  };

  /**
   * 이전 메세지 조회
   */
  const loadMorePreviousMessage = async () => {
    if (state.useMessageSearch && !state.completeLoadPreviousMessage) {
      return false;
    }

    const params = new state.sendbird.MessageListParams();
    params.isInclusive = false;
    params.prevResultSize = 20;
    params.nextResultSize = 0;
    params.reverse = false;
    params.messageType = '';

    const loadMessages = await new Promise<Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>>(
      (resolve, reject) => {
        const userMessages = state.messages.filter((items) => items.messageType === 'user');
        return state.liveChatChannel.getMessagesByMessageId(userMessages[0].messageId, params, (messages, error) => {
          if (error) {
            reject(error);
          }

          resolve(messages);
        });
      },
    );

    const convertMessage = toSendbirdUserMessageModelList(loadMessages, chatChannelItem.userId);

    const messages = convertMessage
      .filter((item) => item.messageType !== 'admin')
      .sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      });

    if (messages.length === 0) {
      return false;
    }

    dispatch({
      type: SendbirdReduceActionType.ADD_PREVIOUS_MESSAGES,
      payload: {
        messages,
        lastMessageId: loadMessages[0].messageId,
      },
    });

    return loadMessages[0].messageId;
  };

  /**
   * 이전 auction 메세지 조회
   */
  const loadMorePreviousAuctionMessage = async (customTypes?: Array<string>) => {
    if (!state?.sendbird) {
      return false;
    }

    const params = new state.sendbird.MessageListParams();
    params.isInclusive = false;
    params.prevResultSize = 30;
    params.nextResultSize = 0;
    params.reverse = false;
    params.messageType = '';
    params.customTypes = customTypes || [];

    const loadMessages = await new Promise<Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>>(
      (resolve, reject) => {
        const date = new Date();
        const ts = date.setDate(date.getDate() - 1);
        if (state.auctionMessages.length === 0) {
          return state.auctionChatChannel.getMessagesByTimestamp(ts, params, (messages, error) => {
            if (error) {
              reject(error);
            }

            resolve(messages);
          });
        } else {
          return state.auctionChatChannel.getMessagesByMessageId(
            state.auctionMessages[0].messageId,
            params,
            (messages, error) => {
              if (error) {
                reject(error);
              }

              resolve(messages);
            },
          );
        }
      },
    );

    if (loadMessages.length === 0) {
      return false;
    }

    const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<SendBird.AdminMessage>);
    const auctionMessages = convertMessages.map((item) => item as SendBirdAdminMessageModel);

    dispatch({
      type: SendbirdReduceActionType.ADD_PREVIOUS_AUCTION_MESSAGES,
      payload: {
        auctionMessages,
      },
    });

    return true;
  };

  /**
   * customTypes 해당하는 auction 메세지 조회
   */
  const loadPreviousAuctionMessageByCustomType = async (customTypes: Array<string>) => {
    if (!state?.sendbird) {
      return false;
    }

    const params = new state.sendbird.MessageListParams();
    params.isInclusive = false;
    params.prevResultSize = 100;
    params.nextResultSize = 0;
    params.reverse = false;
    params.messageType = '';
    params.customTypes = customTypes;

    const loadMessages = await new Promise<Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>>(
      (resolve, reject) => {
        const ts = new Date().getTime();
        return state.auctionChatChannel.getMessagesByTimestamp(ts, params, (messages, error) => {
          if (error) {
            reject(error);
          }

          resolve(messages);
        });
      },
    );

    if (loadMessages.length === 0) {
      return false;
    }

    const convertMessages = toSendbirdUserMessageModelList(loadMessages as Array<SendBird.AdminMessage>);
    const auctionMessages = convertMessages.map((item) => item as SendBirdAdminMessageModel);

    dispatch({
      type: SendbirdReduceActionType.SET_AUCTION_MESSAGES,
      payload: {
        auctionMessages,
      },
    });

    toMessageScrollBottom && setTimeout(() => toMessageScrollBottom(), 500);

    return true;
  };

  /**
   *  temp user message 추가
   */
  const addTempUserMessage = () => {
    const jsonString =
      '{"messageId":1722121824,"messageType":"user","channelUrl":"sendbird_open_channel_2864_ef079f44d2f25e6109ebd0d67beb1afa4df20f9d","data":"","customType":"","silent":false,"createdAt":1646763712118,"updatedAt":0,"channelType":"open","metaArrays":[],"reactions":[],"mentionType":"users","mentionedUsers":[],"sendingStatus":"succeeded","parentMessageId":0,"parentMessageText":null,"threadInfo":{"replyCount":0,"mostRepliedUsers":[],"lastRepliedAt":0,"updatedAt":0},"isReplyToChannel":false,"parentMessage":null,"ogMetaData":null,"isOperatorMessage":true,"appleCriticalAlertOptions":null,"message":"h","sender":{"nickname":"hansu","plainProfileUrl":"","userId":"650674","connectionStatus":"nonavailable","lastSeenAt":0,"metaData":{},"isActive":true,"friendDiscoveryKey":null,"friendName":null,"_preferredLanguages":null,"requireAuth":false,"role":"operator","isBlockedByMe":false},"_sender":{"nickname":"hansu","plainProfileUrl":"","userId":"650674","connectionStatus":"nonavailable","lastSeenAt":0,"metaData":{},"isActive":true,"friendDiscoveryKey":null,"friendName":null,"_preferredLanguages":null,"requireAuth":false,"role":"operator","isBlockedByMe":false},"reqId":"","translations":{},"requestState":"succeeded","requestedMentionUserIds":[],"errorCode":0,"messageSurvivalSeconds":-1,"plugins":[],"poll":null}';
    const message = JSON.parse(jsonString);

    const sendbirdMessage = toSendbirdUserMessageModel(message, chatChannelItem.userId);

    if (message.messageType === 'user') {
      (sendbirdMessage as unknown as SendBird.UserMessage).message = uuidv4();
      (sendbirdMessage as unknown as SendBird.UserMessage).messageId = new Date().getUTCMilliseconds();
      window.console.log('addMessage', (sendbirdMessage as unknown as SendBird.UserMessage).message);
      dispatch({
        type: SendbirdReduceActionType.ADD_MESSAGE,
        payload: {
          message: sendbirdMessage,
        },
      });
    }
  };

  return {
    messages: state.messages,
    auctionMessages: state.auctionMessages,
    adminMessages: state.adminMessages,
    noticeMessage: state.noticeMessage,
    showroomSubscribeInfo: state.showroomSubscribeInfo,
    banedUserList: state.banedUserList,
    mutedUserList: state.mutedUserList,
    isLoadingMessage: !state.completeLoadPreviousMessage,
    useMessageSearch: state.useMessageSearch,
    sendMessage,
    setMuteUser,
    setUnmuteUser,
    setBanUser,
    setUnbanUser,
    loadMorePreviousMessage,
    loadMorePreviousAuctionMessage,
    loadPreviousAuctionMessageByCustomType,
    addTempUserMessage,
  };
};
