import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { AuctionGoodsType, AuctionGoodsTypeLabel } from '../constants';
import { ContentImage } from './ContentImage';

interface Props {
  item: {
    goodsId?: number | null;
    name: string;
    primaryImagePath: string;
    startPriceText: string;
    bidUnitPriceText: string;
    maximumBidPriceText: string;
    itemType: AuctionGoodsType;
    ticketName: string;
    ticketExpiredInfo: string;
  };
}

export const AuctionGoodsContents = ({ item }: Props) => {
  return (
    <WrapperContentStyled>
      {item.primaryImagePath && <ContentImage path={item.primaryImagePath} />}
      <Box m="10px 0">
        {item.goodsId && <GoodsInfoIdStyled>상품 ID: {item.goodsId}</GoodsInfoIdStyled>}
        <GoodsInfoTitleStyled>{item.name}</GoodsInfoTitleStyled>
        <GoodsInfoStyled>
          <GoodsLabel>상품 타입</GoodsLabel>
          {AuctionGoodsTypeLabel[item.itemType]}
        </GoodsInfoStyled>
        {item.itemType === AuctionGoodsType.TICKET && (
          <>
            <GoodsInfoStyled>
              <GoodsLabel>티켓명</GoodsLabel>
              {item.ticketName}
            </GoodsInfoStyled>
            {/* <GoodsInfoStyled>
              <GoodsLabel>티켓 유효기간</GoodsLabel>
              {item.ticketExpiredInfo}
            </GoodsInfoStyled> */}
          </>
        )}
        <GoodsInfoStyled>
          <GoodsLabel>시작 입찰가</GoodsLabel>
          {item.startPriceText}
        </GoodsInfoStyled>
        <GoodsInfoStyled>
          <GoodsLabel>입찰 단위 가격</GoodsLabel>
          {item.bidUnitPriceText}
        </GoodsInfoStyled>
        <GoodsInfoStyled>
          <GoodsLabel>입찰 상한가</GoodsLabel>
          {item.maximumBidPriceText}
        </GoodsInfoStyled>
      </Box>
    </WrapperContentStyled>
  );
};

const WrapperContentStyled = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const GoodsInfoStyled = styled(Box)`
  margin-top: 5px;
  font-size: 0.875rem;
`;

const GoodsInfoIdStyled = styled(GoodsInfoStyled)`
  font-weight: bold;
  margin: 0 0 5px 0;
`;
const GoodsInfoTitleStyled = styled(GoodsInfoIdStyled)`
  margin: 0 0 15px 0;
`;

const GoodsLabel = styled.span`
  display: inline-block;
  width: 90px;
  margin-right: 8px;
`;
