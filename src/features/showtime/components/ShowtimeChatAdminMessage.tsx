import { OrderStepLabel } from '@constants/order';
import styled from '@emotion/styled';
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { SendbirdSubActionType } from '../constants';
import { SendbirdMessageModel } from '../models/SendbirdModel';

interface Props {
  chatItem: SendbirdMessageModel | null;
}

/**
 * 쇼타임 채팅 메세지 component
 */
export const ShowtimeChatAdminMessage = React.memo(
  ({ chatItem }: Props) => {
    if (chatItem === null) {
      return null;
    }

    const {
      createdAtText,
      message,
      data: { subActionType, user, order },
    } = chatItem;

    const getChatInfo = () => {
      switch (subActionType) {
        case SendbirdSubActionType.FINAL_BIDDER:
          return (
            <Grid item xs={7}>
              <TextStyled>
                <Box fontWeight="600">최종낙찰자</Box>
                {user.nickname}
              </TextStyled>
            </Grid>
          );
        case SendbirdSubActionType.ORDER_STATUS:
          return (
            <Grid item xs={7}>
              <TextStyled>
                {OrderStepLabel[order.orderStep]}({order.id})
              </TextStyled>
            </Grid>
          );
      }
    };

    return (
      <GridStyled container>
        <Grid item xs={2}>
          <TextStyled>{createdAtText}</TextStyled>
        </Grid>

        {getChatInfo()}

        <Grid item xs={3}>
          <TextStyled>{message ?? '-'}</TextStyled>
        </Grid>
      </GridStyled>
    );
  },
  ({ chatItem: prevChatItem }, { chatItem: nextChatItem }) => {
    return Object.is(prevChatItem, nextChatItem);
  },
);

const GridStyled = styled(Grid)`
  background-color: #1b941b;
  border: '1px solid #1b941b';
  border-radius: 10px;
`;

const TextStyled = styled(Box)`
  padding: 10px 15px;
  color: #ffffff;
  font-size: 1rem;
`;
