import { Button } from '@material-ui/core';
import React from 'react';
import { GoodsSummary } from '.';
import { GoodsItem } from '../types';
import { ItemActionsProps } from './ItemActions';

interface Props extends Omit<ItemActionsProps, 'index' | 'itemSize' | 'showOrderAction' | 'children'> {
  addedGoodsItems: Array<GoodsItem>;
  onOpenModal: () => void;
  onClickDeleteGoodsItem: (id: number) => void;
}

export const GoodsInfo: React.FC<Props> = ({
  addedGoodsItems,
  onOpenModal,
  onClickDeleteGoodsItem,
  ...props
}: Props) => {
  return (
    <>
      <GoodsSummary
        title=""
        width="720px"
        items={addedGoodsItems}
        showOrderAction
        onClickDelete={onClickDeleteGoodsItem}
        {...props}
      />
      <Button variant="contained" size="large" onClick={onOpenModal} sx={{ width: '720px' }}>
        상품추가
      </Button>
    </>
  );
};
