import styled from '@emotion/styled';
import { SendBirdUserMessageModel } from '@features/showtime/models';
import { MenuItemOption } from '@features/showtime/types';
import { Grid, Box, Chip } from '@material-ui/core';
import React from 'react';
import { MoreMessageMenu } from '.';

interface Props {
  index?: number;
  chatItem: SendBirdUserMessageModel | null;
  getMenuItems: (chatItem: SendBirdUserMessageModel) => Array<MenuItemOption>;
  onSetNicknameToMessageField: (nickname: string) => (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 쇼타임 채팅 User 메세지 component
 */
export const ChatUserMessage = React.memo(
  ({ index, chatItem, getMenuItems, onSetNicknameToMessageField: handleSetNicknameToMessageField }: Props) => {
    if (chatItem === null) {
      return null;
    }

    const { createdAtText, message, nickname, isAdmin, _sender } = chatItem;

    return (
      <GridStyled container className={isAdmin ? 'outline' : 'default'}>
        {index && <TextStyled>{index}</TextStyled>}
        <TextStyled className="time">{createdAtText}</TextStyled>
        {isAdmin && (
          <TextStyled>
            <Chip size="small" label={`${_sender.nickname}(관리자)`} />
          </TextStyled>
        )}
        {nickname && (
          <Chip
            size="small"
            label={isAdmin ? nickname : `${nickname} (${_sender.userId})`}
            color="primary"
            onClick={isAdmin ? undefined : handleSetNicknameToMessageField(nickname)}
          />
        )}
        <MessageWrapperStyled>
          <TextStyled className={isAdmin ? 'admin-message' : 'message'}>{message}</TextStyled>
          {!isAdmin && <MoreMessageMenu chatItem={chatItem} getMenuItems={getMenuItems} />}
        </MessageWrapperStyled>
      </GridStyled>
    );
  },
);

const GridStyled = styled(Grid)`
  align-items: center;
  margin: 10px 0;
  color: ${({ theme }) => (theme.palette.mode === 'light' ? '#000000' : '#ffffff')};
  background-color: none;
  border: none;
  border-radius: 10px;
  align-items: start;
`;

const TextStyled = styled(Box)<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0 5px;
  font-size: 1rem;
  line-height: 26px;
  ${({ color }) => color && `color: ${color}`};

  &.time {
    padding: 0 5px 0 10px;
    color: #858585;
    font-size: 0.875rem;
  }

  &.message,
  &.admin-message {
    padding: 0 15px;
  }

  &.admin-message {
    color: #6210cc;
  }
`;

const MessageWrapperStyled = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;
