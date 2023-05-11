import styled from '@emotion/styled';
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { AuctionGoodsItem } from '../types';
import { AuctionGoodsContents } from '.';
import { ItemActions, ItemActionsProps } from './ItemActions';

interface Props extends Omit<ItemActionsProps, 'index' | 'itemSize' | 'children'> {
  items: Array<AuctionGoodsItem>;
  width?: string | number;
  onClickModify: (index: number) => void;
  onClickDelete: (index: number) => void;
}

/**
 * 상품 summary component
 */
export const AuctionGoodsSummary = ({ items, width, onClickDelete, onClickModify, ...props }: Props) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handleClickModify = (index: number) => {
    return () => onClickModify && onClickModify(index);
  };

  const handleClickDelete = (index: number) => {
    return () => onClickDelete && onClickDelete(index);
  };

  return (
    <WrapperStyled width={width}>
      <ItemListStyled>
        {items.map((item, index) => (
          <ListItem key={item.id ?? item.primaryImageId}>
            <ListItemText disableTypography>
              <AuctionGoodsContents item={item} />
            </ListItemText>
            <ListItemSecondaryAction>
              <ItemActions {...props} index={index} itemSize={items.length}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  disabled={item.disabledModify}
                  onClick={handleClickModify(index)}
                >
                  수정
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<DeleteIcon />}
                  disabled={item.disabledModify}
                  onClick={handleClickDelete(index)}
                  sx={{ mt: '10px' }}
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
    padding: 10px;
    border: 1px solid #0000001f;
    border-radius: 4px;

    .MuiListItem-root {
      padding-right: 220px;
    }
  }
`;
