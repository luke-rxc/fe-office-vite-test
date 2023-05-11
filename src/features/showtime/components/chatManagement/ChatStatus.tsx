import { Checkbox } from '@components/Checkbox';
import { SendBirdUserMessageModel } from '@features/showtime/models';
import { ShowtimeChatStatusMessageFormField, ShowtimeChatStatusSearchFormField } from '@features/showtime/types';
import { Box, Button, Card, CardHeader, Chip, CircularProgress, Typography } from '@material-ui/core';
import { BaseSyntheticEvent, useMemo } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { ChatStatusMessageForm, ChatStatusSearchForm } from '.';
import { CardContentStyled } from '../CardStyled';
import { ChatStatusMessage, ChatStatusMessageProps } from './ChatStatusMessage';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import Notifications from '@material-ui/icons/Notifications';
import Bookmark from '@material-ui/icons/Bookmark';
import ContentCopy from '@material-ui/icons/ContentCopy';
import Send from '@material-ui/icons/Send';

interface Props extends ChatStatusMessageProps {
  isLoadingMessage: boolean;
  useMessageSearch: boolean;
  showScrollBottom: boolean;
  searchFormMethod: UseFormReturn<ShowtimeChatStatusSearchFormField>;
  messageFormMethod: UseFormReturn<ShowtimeChatStatusMessageFormField>;
  onClickSearch: (e?: BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onClickSearchClear: () => void;
  onClickSend: (e?: BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onClickOpenNoticeModal: () => void;
  onClickNoticeMessageDeleteAction: () => void;
  onUpdateMessageScrollRef: (currentIndex: number, total: number) => void;
  toMessageScrollBottom: (messageLength?: number) => void;
  onLoadMorePreviousMessage: () => Promise<void>;
  onToggleUseSearch: () => void;
  onClickShowroomSubscribe: () => void;
}

export const ChatStatus = ({
  searchFormMethod,
  isLoadingMessage,
  useMessageSearch,
  messageFormMethod,
  onClickSearch: handleClickSearch,
  onClickSend: handleClickSend,
  onClickSearchClear: handleClickSearchClear,
  onClickOpenNoticeModal: handleClickOpenNoticeModal,
  onClickNoticeMessageDeleteAction: handleClickNoticeMessageDeleteAction,
  onUpdateMessageScrollRef: handleUpdateMessageScrollRef,
  onLoadMorePreviousMessage: handleLoadMorePreviousMessage,
  onToggleUseSearch: handleToggleUseSearch,
  onClickShowroomSubscribe: handleClickShowroomSubscribe,
  ...messageProps
}: Props) => {
  const userMessages = useMemo(() => {
    return messageProps.items.filter((item) => item.messageType === 'user' && !item.isAdmin);
  }, [messageProps.items]);

  /**
   * 채팅 목록의 사용자 id 복사
   */
  const onClickCopyUserIdByMessage = () => {
    const copyMessages = userMessages.map((item) => (item as SendBirdUserMessageModel)._sender.userId);
    const uniqueIds = copyMessages.filter((element, index) => {
      return copyMessages.indexOf(element) === index;
    });
    if (uniqueIds.length === 0) {
      toast(`복사할 대상이 없습니다`);
      return;
    }
    copy(uniqueIds.join(', '));
    toast(`클립보드에 userId가 복사되었습니다 (${uniqueIds.length.toLocaleString()}개)`);
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box>
            채팅 현황
            <Checkbox
              label="검색창 표시"
              checked={useMessageSearch}
              disabled={useMessageSearch && isLoadingMessage}
              onClick={handleToggleUseSearch}
              sx={{ ml: '10px' }}
            />
          </Box>
        }
        action={
          useMessageSearch && isLoadingMessage ? (
            <CircularProgress color="inherit" size={20} sx={{ mt: '16px' }} />
          ) : null
        }
      />
      <CardContentStyled color="#ffffff">
        {useMessageSearch && !isLoadingMessage && (
          <FormProvider {...searchFormMethod}>
            <ChatStatusSearchForm onClickSearch={handleClickSearch} onClickSearchClear={handleClickSearchClear} />
          </FormProvider>
        )}
        <Box display="flex" justifyContent="end" sx={{ margin: '0 0 10px 0' }}>
          <Chip
            className="chip"
            variant="outlined"
            size="small"
            label={`사용자 메세지수: ${userMessages.length.toLocaleString()}`}
            sx={{ mr: '10px' }}
            color="secondary"
          />
          <Chip
            className="chip"
            variant="outlined"
            color="primary"
            size="small"
            label={`전체 메세지수: ${messageProps.items.length.toLocaleString()}`}
          />
        </Box>
        <Box sx={{ margin: '0 0 10px 0' }}>
          <ChatStatusMessage
            {...messageProps}
            onClickNoticeMessageDeleteAction={handleClickNoticeMessageDeleteAction}
            onUpdateMessageScrollRef={handleUpdateMessageScrollRef}
            onLoadMorePreviousMessage={handleLoadMorePreviousMessage}
          />
        </Box>

        <Box sx={{ margin: '0 0 10px 0' }} display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 600 }}>기능</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Notifications />}
              onClick={handleClickOpenNoticeModal}
              sx={{ marginRight: '10px' }}
            >
              공지
            </Button>
            <Button
              variant="outlined"
              startIcon={<Bookmark />}
              onClick={handleClickShowroomSubscribe}
              sx={{ marginRight: '10px' }}
            >
              쇼룸 팔로우 요청
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<ContentCopy />}
              onClick={onClickCopyUserIdByMessage}
              disabled={userMessages.length === 0}
              sx={{ width: '120px' }}
            >
              ID 복사
            </Button>
          </Box>
        </Box>

        <FormProvider {...messageFormMethod}>
          <form onSubmit={handleClickSend}>
            <ChatStatusMessageForm>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleClickSend}
                sx={{ width: '100px', marginRight: '10px' }}
              >
                전송
              </Button>
            </ChatStatusMessageForm>
          </form>
        </FormProvider>
      </CardContentStyled>
    </Card>
  );
};
