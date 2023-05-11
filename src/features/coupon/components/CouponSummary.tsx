import styled from '@emotion/styled';
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { AllowItemType } from '../constants';
import { CouponAllowItem } from '../types';

interface Props {
  title: string;
  items: Array<CouponAllowItem>;
  type: AllowItemType;
  onClickDelete: (type: AllowItemType, id: number) => void;
}

export const CouponSummary = ({ title, items, type, onClickDelete }: Props) => {
  const handleClickDelete = (id: number) => {
    return () => onClickDelete && onClickDelete(type, id);
  };

  return (
    <>
      <Typography>{title}</Typography>
      <ItemListStyled>
        {items.map(({ id, text }) => (
          <ListItem key={id}>
            <ListItemText disableTypography primary={text} sx={{ fontSize: '0.875rem' }} />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleClickDelete(id)}
              >
                삭제
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {items.length === 0 && <EmptyStyled>추가된 항목이 없습니다.</EmptyStyled>}
      </ItemListStyled>
    </>
  );
};

const ItemListStyled = styled(List)`
  margin: 10px 5px;
  padding: 10px;
  border: 1px solid #0000001f;
  border-radius: 4px;
`;

const EmptyStyled = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  font-size: 0.875rem;
`;
