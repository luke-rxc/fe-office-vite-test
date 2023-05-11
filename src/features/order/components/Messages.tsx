import styled from '@emotion/styled';
import { OrderMessage } from '@features/order/types';
import { Box, Button } from '@material-ui/core';
import { useState } from 'react';

interface Props {
  items: Array<OrderMessage>;
  height?: string | number;
}

export const Messages = ({ items, height }: Props) => {
  const [isFold, setIsFold] = useState<boolean>(true);

  const handleClick = () => {
    setIsFold((prev) => !prev);
  };

  return (
    <WrapperStyled>
      <MessagesStyled height={isFold ? height : undefined}>
        <Box>
          {items.map((item) => (
            <MessageWrapperStyled key={item.id}>
              {item.date}
              <MessageTextStyled>{item.message}</MessageTextStyled>
            </MessageWrapperStyled>
          ))}
        </Box>
      </MessagesStyled>
      {height && items.length > 3 && (
        <ButtonStyled size="small" variant="outlined" onClick={handleClick}>
          {isFold ? '펼치기' : '접기'}
        </ButtonStyled>
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  position: relative;
`;

const MessagesStyled = styled(Box)`
  border: 1px solid #dddddd;
  padding: 10px;
  overflow-y: scroll;
`;

const MessageWrapperStyled = styled(Box)`
  padding: 5px 0;
`;

const MessageTextStyled = styled(Box)`
  display: inline-block;
  margin-left: 15px;
`;

const ButtonStyled = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
