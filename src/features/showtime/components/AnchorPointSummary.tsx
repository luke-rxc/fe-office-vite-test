import styled from '@emotion/styled';
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AnchorIcon from '@material-ui/icons/Anchor';
import { AnchorPointContents } from './AnchorPointContents';
import { ShowtimeAnchorPointItemModel } from '../models';
import { AnchorPointActionType, AnchorPointActionTypeLabel } from '../constants';

interface Props {
  items: Array<ShowtimeAnchorPointItemModel>;
  width?: string | number;
  onClickAction: (actionType: AnchorPointActionType, item: ShowtimeAnchorPointItemModel) => void;
}

/**
 * 앵커포인트 summary component
 */
export const AnchorPointSummary = ({ items, width, onClickAction }: Props) => {
  if (!items || items.length === 0) {
    return (
      <WrapperStyled>
        <EmptyStyled>항목이 없습니다.</EmptyStyled>
      </WrapperStyled>
    );
  }

  const handleClickPairing = (item: ShowtimeAnchorPointItemModel) => {
    return () => onClickAction && onClickAction(AnchorPointActionType.PAIRING, item);
  };

  const handleClickModify = (item: ShowtimeAnchorPointItemModel) => {
    return () => onClickAction && onClickAction(AnchorPointActionType.MODIFY, item);
  };

  const handleClickDelete = (item: ShowtimeAnchorPointItemModel) => {
    if (item.active) {
      return () => onClickAction && onClickAction(AnchorPointActionType.UNPAIRING, item);
    }

    return () => onClickAction && onClickAction(AnchorPointActionType.DELETE, item);
  };

  return (
    <WrapperStyled width={width}>
      <ItemListStyled>
        {items.map((item, index) => (
          <ListItem key={item.id}>
            <ListItemText disableTypography>
              <AnchorPointContents item={item} indexingName={item.active ? `앵커포인트 #${index + 1}` : null} />
            </ListItemText>
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                onClick={handleClickModify(item)}
              >
                {AnchorPointActionTypeLabel[AnchorPointActionType.MODIFY]}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleClickDelete(item)}
                sx={{ ml: '10px' }}
              >
                {
                  AnchorPointActionTypeLabel[
                    item.active ? AnchorPointActionType.UNPAIRING : AnchorPointActionType.DELETE
                  ]
                }
              </Button>
              {!item.active && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AnchorIcon />}
                  sx={{ ml: '10px' }}
                  onClick={handleClickPairing(item)}
                >
                  {AnchorPointActionTypeLabel[AnchorPointActionType.PAIRING]}
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
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
  }
`;

const EmptyStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  font-size: 0.875rem;
  border: 1px solid #0000001f;
  border-radius: 4px;
`;
