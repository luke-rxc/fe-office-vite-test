import styled from '@emotion/styled';
import { SendBirdAdminMessageModel } from '@features/showtime/models';
import { Grid, Box } from '@material-ui/core';
import React from 'react';

interface Props {
  chatItem: SendBirdAdminMessageModel | null;
}

/**
 * 쇼타임 채팅 Admin 메세지 component
 */
export const ChatAdminMessage = React.memo(({ chatItem }: Props) => {
  if (chatItem === null) {
    return null;
  }

  const { createdAtText, message } = chatItem;

  return (
    <GridStyled container>
      <TextStyled className="time">{createdAtText}</TextStyled>
      <MessageWrapperStyled>
        <TextStyled className="message">{message}</TextStyled>
      </MessageWrapperStyled>
    </GridStyled>
  );
});

const GridStyled = styled(Grid)`
  align-items: center;
  margin: 10px 0;
  background-color: #f7f6f6;
  border: none;
  border-radius: 10px;
`;

const TextStyled = styled(Box)`
  display: inline-flex;
  align-items: center;
  padding: 0 5px;
  font-size: 1rem;
  line-height: 26px;

  &.time {
    padding: 0 5px 0 10px;
    color: #858585;
    font-size: 0.875rem;
  }

  &.message {
    color: #5664d2;
    padding: 0 15px;
  }
`;

const MessageWrapperStyled = styled(Box)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;
