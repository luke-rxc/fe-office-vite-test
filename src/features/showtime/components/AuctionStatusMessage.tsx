import styled from '@emotion/styled';
import { SendBirdAdminMessageModel } from '@features/showtime/models';
import { Box, Button, Grid } from '@material-ui/core';
import React, { MutableRefObject, useContext } from 'react';
import {
  ListOnItemsRenderedProps,
  ListOnScrollProps,
  VariableSizeList as List,
  ListChildComponentProps,
} from 'react-window';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { ShowtimeChatAdminMessage, ShowtimeChatMessage } from '.';
import { SendbirdActionType } from '../constants';
import { ChatItemSizer } from './chatManagement';
import { ChatContext } from '../contexts/ChatContext';

export interface AuctionStatusMessageProps {
  // 메세지 items
  items: Array<SendBirdAdminMessageModel>;
  messagesAreaRef: MutableRefObject<HTMLDivElement>;
  messagesScrollRef: MutableRefObject<List<SendBirdAdminMessageModel[]>>;
  messageAreaWidth: number;
  showScrollBottom: boolean;
  getListItemHeight: (index: number) => number;
  setListItemHeight: (index: number, size: number) => void;
  onUpdateMessageScrollRef: (currentIndex: number, total: number) => void;
  toMessageScrollBottom: (messageLength?: number) => void;
  onLoadMorePreviousMessage: () => Promise<void>;
}

const Row = (
  props: React.PropsWithChildren<React.PropsWithChildren<ListChildComponentProps<SendBirdAdminMessageModel[]>>>,
) => {
  const { messageAreaWidth, updateChatItemHeight } = useContext(ChatContext);
  const { style, index, data: items } = props;
  const overrideStyled = {
    ...style,
    top: Number(style.top) + 2,
    height: Number(style.height) + 4,
    paddingRight: '15px',
  };

  const item = items[index];

  if (typeof item.data !== 'string' && item?.data?.actionType === SendbirdActionType.MESSAGE_FOR_ADMIN) {
    return (
      <div style={overrideStyled} key={item.messageId}>
        <ChatItemSizer parentWidth={messageAreaWidth} index={index} updateChatItemHeight={updateChatItemHeight}>
          <ShowtimeChatAdminMessage chatItem={item} />
        </ChatItemSizer>
      </div>
    );
  }

  return (
    <div style={overrideStyled} key={item.messageId}>
      <ChatItemSizer parentWidth={messageAreaWidth} index={index} updateChatItemHeight={updateChatItemHeight}>
        <ShowtimeChatMessage chatItem={item} color="blue" />
      </ChatItemSizer>
    </div>
  );
};

export const AuctionStatusMessage = React.memo(
  ({
    items,
    messagesAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    showScrollBottom,
    getListItemHeight,
    setListItemHeight,
    onUpdateMessageScrollRef: handleUpdateMessageScrollRef,
    onLoadMorePreviousMessage: handleLoadMorePreviousMessage,
    toMessageScrollBottom,
  }: AuctionStatusMessageProps) => {
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
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="column"
            sx={{ height: '600px', overflowX: 'hidden', overflowY: 'auto', position: 'relative' }}
            ref={messagesAreaRef}
          >
            <Box flex="1 1 0" />
            <ChatContext.Provider value={{ messageAreaWidth, updateChatItemHeight: setListItemHeight }}>
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
        </Grid>
      </MessageWrapperStyled>
    );
  },
);

const MessageWrapperStyled = styled(Box)`
  padding: 0 10px;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;
