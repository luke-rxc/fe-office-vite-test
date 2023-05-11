import styled from '@emotion/styled';
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { GoodsItem } from '../types';
import { ItemActions, ItemActionsProps } from './ItemActions';
import { GoodsContent } from './GoodsContent';

interface Props extends Omit<ItemActionsProps, 'index' | 'itemSize' | 'children'> {
  title: string;
  items: Array<GoodsItem>;
  width?: string | number;
  onClickDelete: (id: number) => void;
}

/**
 * 상품 summary component
 */
export const GoodsSummary = ({ title, items, width, onClickDelete, ...props }: Props) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handleClickDelete = (id: number) => {
    return () => onClickDelete && onClickDelete(id);
  };

  return (
    <WrapperStyled width={width}>
      <Typography>{title}</Typography>
      <ItemListStyled>
        {items.map((item, index) => (
          <ListItem key={item.id}>
            <ListItemText disableTypography>
              <GoodsContent item={item} />
            </ListItemText>
            <ListItemSecondaryAction>
              <ItemActions {...props} index={index} itemSize={items.length}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleClickDelete(item.id)}
                >
                  삭제
                </Button>
              </ItemActions>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {items.length === 0 && (
          <Box display="flex" justifyContent="center" alignContent="center" p="30px" fontSize="0.875rem">
            추가된 항목이 없습니다.
          </Box>
        )}
      </ItemListStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{ width?: string | number }>`
  ${({ width }) =>
    width &&
    `
    width: ${width};
  `}
`;

const ItemListStyled = styled(List)`
  > li {
    margin: 10px 5px;
    padding: 20px 10px;
    border: 1px solid #0000001f;
    border-radius: 4px;

    .MuiListItem-root {
      padding-right: 220px;
    }
  }
`;
