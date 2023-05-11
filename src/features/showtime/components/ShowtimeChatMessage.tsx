import styled from '@emotion/styled';
import { Grid, Box } from '@material-ui/core';
import { SendbirdMessageModel } from '../models/SendbirdModel';

interface Props {
  menuKey?: string;
  color: 'default' | 'blue' | 'gray';
  chatItem: SendbirdMessageModel | null;
}

/**
 * 쇼타임 채팅 메세지 component
 */
export const ShowtimeChatMessage = ({ menuKey, chatItem, color }: Props) => {
  if (chatItem === null) {
    return null;
  }

  const {
    createdAtText,
    message,
    data: {
      user: { nickname },
    },
  } = chatItem;

  return (
    <GridStyled container className={color}>
      <Grid item xs={2}>
        <TextStyled>{createdAtText}</TextStyled>
      </Grid>
      <Grid item xs={7}>
        <TextStyled>{nickname}</TextStyled>
      </Grid>
      <Grid item xs={3}>
        <Box display="flex" justifyContent="space-between">
          <TextStyled>{message}</TextStyled>
        </Box>
      </Grid>
    </GridStyled>
  );
};

const GridStyled = styled(Grid)`
  color: #000000;
  background-color: none;
  border: none;
  border-radius: 10px;

  &.blue {
    color: #ffffff;
    background-color: #03a9f4;
    border: 1px solid #03a9f4;
  }

  &.gray {
    color: #000000;
    background-color: #bbbbbb;
    border: 1px solid #bbbbbb;
  }
`;

const TextStyled = styled(Box)`
  padding: 10px 15px;
  font-size: 1rem;
`;
