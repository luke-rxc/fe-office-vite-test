import styled from '@emotion/styled-base';
import { Typography, List, ListItem, ListItemText, Box, ListItemSecondaryAction, Button } from '@material-ui/core';
import { memo } from 'react';

interface Props {
  items: Array<SendBird.User>;
  height: string;
  onClickUnban: (user: SendBird.User) => void;
}

export const BanUserList = memo(
  ({ height, items = [], onClickUnban }: Props) => {
    const onClick = (user: SendBird.User) => {
      return () => {
        onClickUnban(user);
      };
    };

    return (
      <>
        <Typography sx={{ mb: '10px' }} variant="h6" component="div">
          Ban ({(items || []).length ?? 0})
        </Typography>
        <Box>
          <ListStyled height={height}>
            {(items || []).map((item) => (
              <ListItem key={item.userId}>
                <ListItemText primary={item.nickname} />
                <ListItemSecondaryAction>
                  <Button variant="outlined" size="small" onClick={onClick(item)}>
                    Ban 해제
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </ListStyled>
        </Box>
      </>
    );
  },
  ({ items: prevItems, height: prevHeight }, { items: nextItems, height: nextHeight }) =>
    Object.is(prevItems, nextItems) && prevHeight === nextHeight,
);

const ListStyled = styled(List)<{ height: string }>`
  border: 1px solid #ccc;
  height: ${({ height }) => height ?? 'auto'};
  overflow-y: scroll;
`;
