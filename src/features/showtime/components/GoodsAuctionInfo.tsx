import styled from '@emotion/styled';
import { Box, Button } from '@material-ui/core';
import { GoodsAuctionModal } from '.';
import { ModalType } from '../constants';
import { KeywordComboItemModel } from '../models';
import { ReturnTypeUseShowtimeContentsAuctionGoodsService } from '../services';
import { AuctionGoodsSummary } from './AuctionGoodsSummary';
import { useFormContext } from 'react-hook-form';
import { ShowtimeContentsItemFormField } from '../types';

interface Props {
  auction: ReturnTypeUseShowtimeContentsAuctionGoodsService['auction'];
  keywordOptions: Array<KeywordComboItemModel>;
}

export const GoodsAuctionInfo = ({ auction, keywordOptions }: Props) => {
  const {
    formState: { errors },
  } = useFormContext<ShowtimeContentsItemFormField>();
  const auctionGoodsError = errors['auctionGoodsInfo'];

  return (
    <>
      <AuctionGoodsSummary
        width="720px"
        items={auction.addedAuctionGoodsItems}
        onClickModify={auction.handleClickModifyItem}
        onClickDelete={auction.handleClickDeleteItem}
        onClickChangeOrdering={auction.handleClickChangeOrdering}
      />
      <ErrorWrapperStyled className={auctionGoodsError ? 'error' : ''}>
        <Button variant="contained" size="large" sx={{ width: '720px' }} onClick={auction.handleOpen(ModalType.CREATE)}>
          경매상품추가
        </Button>
        {auctionGoodsError && <ErrorMessageStyled>{auctionGoodsError.message}</ErrorMessageStyled>}
      </ErrorWrapperStyled>

      <GoodsAuctionModal auction={auction} keywordOptions={keywordOptions} />
    </>
  );
};

const ErrorWrapperStyled = styled(Box)`
  &.error {
    display: inline-block;
    padding: 10px 10px 0;
    border: 1px solid #ff0000;
    border-radius: 10px;
  }
`;
const ErrorMessageStyled = styled(Box)`
  color: #ff0000;
  padding: 10px;
`;
