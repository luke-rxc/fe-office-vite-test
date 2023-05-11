import styled from '@emotion/styled';
import { SendBirdAdminMessageModel, SendBirdMessageType, SendBirdUserMessageModel } from '@features/showtime/models';
import { Box, Button, Grid } from '@material-ui/core';
import React, { MutableRefObject, useContext } from 'react';
import { ChatUserMessage, ChatNoticeMessage, ChatAdminMessage } from '.';
import {
  ListChildComponentProps,
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  VariableSizeList as List,
} from 'react-window';
import { MenuItemOption } from '@features/showtime/types';
import { ChatItemSizer } from './ChatItemSizer';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { ChatContext } from '@features/showtime/contexts/ChatContext';

export interface ChatStatusMessageProps {
  // 메세지 items
  items: Array<SendBirdMessageType>;
  // 고정 메세지
  noticeMessage: string;
  // 알림 메세지 items
  temporaryItems: Array<SendBirdAdminMessageModel>;
  messagesAreaRef: MutableRefObject<HTMLDivElement>;
  messagesScrollRef: MutableRefObject<List<SendBirdMessageType[]>>;
  messagesRef: MutableRefObject<{ currentIndex: number; total: number }>;
  messageAreaWidth: number;
  showScrollBottom: boolean;
  getMenuItems: (chatItem: SendBirdUserMessageModel) => Array<MenuItemOption>;
  onClickNoticeMessageDeleteAction?: () => void;
  getListItemHeight: (index: number) => number;
  setListItemHeight: (index: number, size: number) => void;
  onUpdateMessageScrollRef: (currentIndex: number, total: number) => void;
  toMessageScrollBottom: (messageLength?: number) => void;
  onLoadMorePreviousMessage: () => Promise<void>;
  onSetNicknameToMessageField: (nickname: string) => (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Row = (
  props: React.PropsWithChildren<React.PropsWithChildren<ListChildComponentProps<SendBirdMessageType[]>>>,
) => {
  const {
    messageAreaWidth,
    updateChatItemHeight,
    getMenuItems,
    onSetNicknameToMessageField: handleSetNicknameToMessageField,
  } = useContext(ChatContext);
  const { style, index, data: items } = props;
  const overrideStyled = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) - 4,
    paddingRight: '15px',
  };

  const item = items[index];

  return (
    <div style={overrideStyled} key={item.messageId}>
      <ChatItemSizer parentWidth={messageAreaWidth} index={index} updateChatItemHeight={updateChatItemHeight}>
        {item.messageType === 'user' && (
          <ChatUserMessage
            chatItem={item}
            getMenuItems={getMenuItems}
            onSetNicknameToMessageField={handleSetNicknameToMessageField}
          />
        )}

        {item.messageType === 'admin' && <ChatAdminMessage chatItem={item} />}
      </ChatItemSizer>
    </div>
  );
};

export const ChatStatusMessage = React.memo(
  ({
    items,
    noticeMessage,
    temporaryItems,
    messagesAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    showScrollBottom,
    getMenuItems,
    getListItemHeight,
    setListItemHeight,
    onClickNoticeMessageDeleteAction: handleClickNoticeMessageDeleteAction,
    onUpdateMessageScrollRef: handleUpdateMessageScrollRef,
    onLoadMorePreviousMessage: handleLoadMorePreviousMessage,
    onSetNicknameToMessageField: handleSetNicknameToMessageField,
    toMessageScrollBottom,
  }: ChatStatusMessageProps) => {
    const onItemsRendered = (props: ListOnItemsRenderedProps) => {
      handleUpdateMessageScrollRef(props.visibleStopIndex + 1, items.length);
    };

    const onScroll = (event: ListOnScrollProps) => {
      if (items.length > 0 && event.scrollOffset === 0) {
        handleLoadMorePreviousMessage();
      }
    };

    return (
      <MessageWrapperStyled>
        <Grid container>
          {temporaryItems && (
            <Grid item xs={12}>
              {temporaryItems.map((item) => (
                <ChatNoticeMessage key={item.messageId} message={item.message} label="알림메세지" color="blue" />
              ))}
            </Grid>
          )}

          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="column"
            sx={{ height: '600px', overflowX: 'hidden', overflowY: 'auto', position: 'relative' }}
            ref={messagesAreaRef}
          >
            <Box flex="1 1 0" />
            <ChatContext.Provider
              value={{
                messageAreaWidth,
                getMenuItems,
                updateChatItemHeight: setListItemHeight,
                onSetNicknameToMessageField: handleSetNicknameToMessageField,
              }}
            >
              <List
                className="List"
                height={600}
                itemData={items}
                itemCount={items.length}
                itemSize={getListItemHeight}
                itemKey={(index, data) => {
                  const item = data[index];
                  return item.messageId;
                }}
                layout="vertical"
                width={messageAreaWidth}
                onItemsRendered={onItemsRendered}
                ref={messagesScrollRef}
                onScroll={onScroll}
              >
                {Row}
              </List>
            </ChatContext.Provider>
            {showScrollBottom && (
              <Box display="flex" justifyContent="center" position="absolute" width="100%" bottom="0px">
                <Button
                  type="button"
                  startIcon={<ArrowDownwardIcon />}
                  variant="contained"
                  onClick={() => toMessageScrollBottom()}
                >
                  최신 메세지 보기
                </Button>
              </Box>
            )}
          </Grid>
          {noticeMessage && (
            <Grid item xs={12}>
              <ChatNoticeMessage
                message={noticeMessage}
                label="고정메세지"
                color="gray"
                onClickDeleteAction={handleClickNoticeMessageDeleteAction}
              />
            </Grid>
          )}
        </Grid>
      </MessageWrapperStyled>
    );
  },
);

const MessageWrapperStyled = styled(Box)`
  border: 1px solid #c4c4c4;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;
