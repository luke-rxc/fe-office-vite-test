import { useQueryState } from '@hooks/useQueryState';
import copy from 'copy-to-clipboard';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { VariableSizeList as List } from 'react-window';
import { ChatSearchType, SendbirdMessageType } from '../constants';
import { useElementSize, useSendbird } from '../hooks';
import {
  SendBirdMessageType,
  SendBirdUserMessageModel,
  ShowroomComboItemModel,
  ShowtimeChatChannelModel,
} from '../models';
import { ShowtimeChatStatusSearchFormField, ShowtimeChatStatusMessageFormField } from '../types';

interface Props {
  chatChannelItem: ShowtimeChatChannelModel;
  showroomComboList: Array<ShowroomComboItemModel>;
}

export const useShowtimeManageChatManagementService = ({ chatChannelItem, showroomComboList }: Props) => {
  const messagesRef = useRef<{ currentIndex: number; total: number }>({ currentIndex: 0, total: 0 });
  /** message area ref */
  const messageAreaRef = useRef<HTMLDivElement>(null);
  /** message list ref */
  const messagesScrollRef = useRef<List<SendBirdMessageType[]>>(null);
  /** message item size map array */
  const sizeMap = useRef<Array<number>>([]);
  const [messageAreaWidth] = useElementSize(messageAreaRef);
  /* 최신 메세지 보기 표시여부  */
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);
  /* temp user message auto add flag  */
  const [usedAutoAddTempUserMessage, setUsedAutoAddTempUserMessage] = useState<boolean>(false);

  const [searchType, setSearchType] = useState<string>(null);
  const [keyword, setKeyword] = useState<string>(null);
  const { queryState, updateQueryState } = useQueryState<{ search: string }>({});

  /**
   * 메세지창 스크롤 최하단 여부 확인
   */
  const isMessageScrollBottom = useCallback((messageLength?: number) => {
    if (messagesRef?.current) {
      return messagesRef.current.currentIndex === (messageLength ?? messagesRef.current.total);
    }

    return false;
  }, []);

  /**
   * 메세지창 스크롤 최하단 이동
   */
  const toMessageScrollBottom = useCallback((messageLength?: number) => {
    if (messagesScrollRef?.current) {
      messagesScrollRef.current.scrollToItem(messageLength ?? messagesRef.current.total);
    }
  }, []);

  const handleUpdateShowScrollBottom = (isShow: boolean) => {
    setShowScrollBottom(isShow);
  };

  const {
    messages,
    adminMessages,
    noticeMessage,
    showroomSubscribeInfo,
    sendMessage,
    banedUserList,
    mutedUserList,
    isLoadingMessage,
    useMessageSearch,
    setBanUser,
    setUnbanUser,
    setMuteUser,
    setUnmuteUser,
    loadMorePreviousMessage,
  } = useSendbird({
    useChannel: {
      live: true,
      interaction: true,
    },
    useMessageSearch: queryState.search === 'Y',
    chatChannelItem,
    showroomComboList,
    isMessageScrollBottom,
    toMessageScrollBottom,
    handleUpdateShowScrollBottom,
  });

  const filteredMessages = useMemo(() => {
    if (!keyword) {
      return messages;
    }

    const searchValue = keyword.toLowerCase();

    return messages.filter((item: SendBirdUserMessageModel) => {
      if (item.messageType !== SendbirdMessageType.USER) {
        return false;
      }
      if (searchType === ChatSearchType.NICKNAME) {
        return (
          (item.nickname && item.nickname.toLowerCase().includes(searchValue)) ||
          (item._sender.nickname && item._sender.nickname.toLowerCase().includes(searchValue)) ||
          (item._sender.userId && item._sender.userId.includes(searchValue))
        );
      } else {
        return item.message.toLowerCase().includes(searchValue);
      }
    });
  }, [messages, searchType, keyword]);

  // useEffect(() => {
  //   /**
  //    * 성능 테스트를 위한 temp user message 추가 로직
  //    */
  //   let tick: NodeJS.Timeout;

  //   if (usedAutoAddMessage) {
  //     tick = setInterval(() => addTempUserMessage(), 500);
  //   } else {
  //     tick && clearInterval(tick);
  //   }

  //   return () => {
  //     tick && clearInterval(tick);
  //   };
  // }, [addTempUserMessage, usedAutoAddMessage]);

  const handleUpdateMessageScrollRef = async (currentIndex: number, total: number) => {
    messagesRef.current.currentIndex = currentIndex;
    messagesRef.current.total = total;

    if (currentIndex === total) {
      setShowScrollBottom((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });
    }
  };

  const searchFormMethod = useForm<ShowtimeChatStatusSearchFormField>({
    defaultValues: {
      searchType: 'nickname',
      keyword: '',
      searched: 'N',
    },
  });

  const messageFormMethod = useForm<ShowtimeChatStatusMessageFormField>({
    defaultValues: {
      message: '',
    },
  });

  const { handleSubmit: handleSubmitSearch } = searchFormMethod;
  const { handleSubmit: handleSubmitMessage, reset: resetMessage } = messageFormMethod;

  /**
   * 메세지 전송
   */
  const handleClickSend = handleSubmitMessage(async (values) => {
    if (!values.message) {
      return;
    }

    await sendMessage(values.message);
    resetMessage();
    toMessageScrollBottom();
  });

  /**
   * 메세지 검색
   */
  const handleClickSearch = handleSubmitSearch(({ searchType, keyword }) => {
    setSearchType(searchType);
    setKeyword(keyword);
    searchFormMethod.setValue('searched', keyword ? 'Y' : 'N');
  });

  /**
   * 메세지 검색필드 초기화
   */
  const handleClickSearchClear = () => {
    setSearchType(null);
    setKeyword(null);
    searchFormMethod.setValue('keyword', '');
    searchFormMethod.setValue('searched', 'N');
    setTimeout(() => {
      toMessageScrollBottom();
    }, 500);
  };

  /**
   * 메뉴 item 조회
   */
  const getMenuItems = useCallback(
    (chatItem: SendBirdUserMessageModel) => {
      const { _sender: user, nickname, message } = chatItem;

      const isBanUser = banedUserList.find((item) => item.userId === user.userId);
      const isMuteUser = mutedUserList.find((item) => item.userId === user.userId);

      return [
        {
          label: '메세지 복사',
          action: () => {
            copy(`${nickname} : ${message}`);
            toast('클립보드에 닉네임과 메세지가 복사되었습니다.');
          },
        },
        {
          label: isBanUser ? 'Ban 해제' : 'Ban 설정',
          action: () => {
            isBanUser ? setUnbanUser(user) : setBanUser(user);
          },
        },
        {
          label: isMuteUser ? 'Mute 해제' : 'Mute 설정',
          action: () => {
            isMuteUser ? setUnmuteUser(user) : setMuteUser(user);
          },
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [banedUserList, mutedUserList],
  );

  /**
   * message item 높이 설정
   */
  const setMessageHeight = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      messagesScrollRef.current?.resetAfterIndex(index);
    }
  }, []);

  /**
   * message item 높이 조회
   */
  const getMessageHeight = (index: number) => {
    return sizeMap.current[index] + 20 || 46;
  };

  /**
   * 이전 메세지 불러오기
   */
  const handleLoadMorePreviousMessage = async () => {
    const result = await loadMorePreviousMessage();
    if (result) {
      messagesScrollRef.current.scrollToItem(35);
    }
  };

  /**
   * 자동 temp user message 처리 여부 업데이트
   */
  const handleUpdateUsedAutoAddTempUserMessage = () => {
    setUsedAutoAddTempUserMessage((prev) => !prev);
  };

  /**
   * 메세지 검색사용여부 변경
   */
  const handleToggleUseSearch = () => {
    if (queryState.search === 'Y') {
      const searched = searchFormMethod.getValues('searched');
      searched === 'Y' && handleClickSearchClear();
      updateQueryState({ search: 'N' });
    } else {
      updateQueryState({ search: 'Y' });
    }
  };

  /**
   * 메세지필드에 사용자 닉네임 설정
   */
  const handleSetNicknameToMessageField = (nickname: string) => {
    const { setValue, setFocus } = messageFormMethod;
    return (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setValue('message', `${nickname}님! `);
      setFocus('message');
    };
  };

  return {
    searchFormMethod,
    messageFormMethod,
    messages: filteredMessages,
    showroomSubscribeInfo,
    noticeMessage,
    adminMessages,
    banedUserList,
    mutedUserList,
    messagesRef,
    messageAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    showScrollBottom,
    isLoadingMessage,
    useMessageSearch,
    setBanUser,
    setUnbanUser,
    setMuteUser,
    setUnmuteUser,
    handleClickSend,
    handleClickSearch,
    handleClickSearchClear,
    getMenuItems,
    getMessageHeight,
    setMessageHeight,
    handleUpdateMessageScrollRef,
    handleLoadMorePreviousMessage,
    toMessageScrollBottom,
    usedAutoAddTempUserMessage,
    handleUpdateUsedAutoAddTempUserMessage,
    handleToggleUseSearch,
    handleSetNicknameToMessageField,
  };
};
