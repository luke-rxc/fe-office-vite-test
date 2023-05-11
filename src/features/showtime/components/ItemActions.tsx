import { Button, Grid, Tooltip } from '@material-ui/core';
import styled from '@emotion/styled';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { OrderingType } from '../constants';
import { ReactNode } from 'react';

export interface ItemActionsProps {
  /** index **/
  index: number;
  itemSize: number;
  /** 순서변경 기능 노출여부 **/
  showOrderAction?: boolean;
  children: ReactNode;
  /** 순서변경 click **/
  onClickChangeOrdering?: (index: number, orderingType: OrderingType) => () => void;
}

/**
 * item action component
 */
export const ItemActions = ({
  showOrderAction = false,
  index,
  itemSize,
  children,
  onClickChangeOrdering,
}: ItemActionsProps) => {
  return (
    <GridContainerStyled container $showOrderAction={showOrderAction}>
      {showOrderAction ? (
        <GridSortItemStyled xs={6}>
          <Tooltip title="순서 맨위로 이동" placement="top">
            <Button
              variant="outlined"
              size="small"
              onClick={onClickChangeOrdering(index, OrderingType.FIRST)}
              disabled={index === 0}
            >
              <VerticalAlignTop sx={{ height: '18px' }} />
            </Button>
          </Tooltip>

          <Tooltip title="순서 위로 이동" placement="top">
            <Button
              variant="outlined"
              size="small"
              onClick={onClickChangeOrdering(index, OrderingType.PREV)}
              disabled={itemSize === 1 || index === 0}
            >
              <KeyboardArrowUp sx={{ height: '18px' }} />
            </Button>
          </Tooltip>

          <Tooltip title="순서 아래로 이동" placement="top">
            <Button
              variant="outlined"
              size="small"
              onClick={onClickChangeOrdering(index, OrderingType.NEXT)}
              disabled={itemSize === 1 || index === itemSize - 1}
            >
              <KeyboardArrowDown sx={{ height: '18px' }} />
            </Button>
          </Tooltip>

          <Tooltip title="순서 맨아래로 이동" placement="top">
            <Button
              variant="outlined"
              size="small"
              onClick={onClickChangeOrdering(index, OrderingType.LAST)}
              disabled={index === itemSize - 1}
            >
              <VerticalAlignBottom sx={{ height: '18px' }} />
            </Button>
          </Tooltip>
        </GridSortItemStyled>
      ) : null}
      <GridItemStyled item xs={showOrderAction ? 6 : 12}>
        {children}
      </GridItemStyled>
    </GridContainerStyled>
  );
};

const GridContainerStyled = styled(Grid)<{ $showOrderAction: boolean }>`
  width: ${({ $showOrderAction }) => ($showOrderAction ? '180px' : 'auto')};
  height: 140px;
`;

const GridSortItemStyled = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const GridItemStyled = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
