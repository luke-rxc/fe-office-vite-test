import { Modal } from '@components/Modal';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import React from 'react';
import { AuctionGoodsContents, FormLayout } from '.';
import { ShowtimeAuctionBidModel } from '../models';

interface Props {
  showModal: boolean;
  auctionBidItem: ShowtimeAuctionBidModel;
  onClose: () => void;
}

export const GoodsAuctionBidModal = React.memo(
  ({ showModal, auctionBidItem, onClose: handleClose }: Props) => {
    if (!auctionBidItem) {
      return null;
    }

    const { bidder, finalPriceText, goodsContent, order, biddingCountText, bidderCountText } = auctionBidItem;

    return (
      <Modal title="낙찰 정보" minWidth="800px" maxHeight="1100px" open={showModal} onClose={handleClose}>
        <Box>
          <FormLayout label="낙찰자 정보">
            <ItemStyled>
              <TitleStyled component="span">이메일</TitleStyled>
              <Box component="span">{bidder.email}</Box>
            </ItemStyled>
            <ItemStyled>
              <TitleStyled component="span">닉네임</TitleStyled>
              <Box component="span">{bidder.nickname}</Box>
            </ItemStyled>
          </FormLayout>
          <FormLayout label="낙찰 상세정보">
            <ItemStyled>
              <TitleStyled component="span">낙찰금액</TitleStyled>
              <Box component="span">{finalPriceText}</Box>
            </ItemStyled>
            <ItemStyled>
              <TitleStyled component="span">총 입찰 수</TitleStyled>
              <Box component="span">{biddingCountText}</Box>
            </ItemStyled>
            <ItemStyled>
              <TitleStyled component="span">입찰 참여자 수</TitleStyled>
              <Box component="span">{bidderCountText}</Box>
            </ItemStyled>
          </FormLayout>
          <FormLayout label="상품정보">
            <Box width="450px" sx={{ border: '1px solid #e8e8e8' }}>
              <AuctionGoodsContents item={goodsContent} />
            </Box>
          </FormLayout>
          {order && (
            <FormLayout label="주문 정보">
              <ItemStyled>
                <TitleStyled component="span">주문번호</TitleStyled>
                <Box component="span">{order.id}</Box>
              </ItemStyled>
              <ItemStyled>
                <TitleStyled component="span">결제상태</TitleStyled>
                <Box component="span">{order.orderStepText}</Box>
              </ItemStyled>
              <ItemStyled>
                <TitleStyled component="span">결제일시</TitleStyled>
                <Box component="span">{order.paymentDateText}</Box>
              </ItemStyled>
            </FormLayout>
          )}
        </Box>
      </Modal>
    );
  },
  (
    { showModal: prevShowModal, auctionBidItem: prevAuctionBidItem },
    { showModal: nextShowModal, auctionBidItem: nextAuctionBidItem },
  ) => {
    return prevShowModal === nextShowModal && Object.is(prevAuctionBidItem, nextAuctionBidItem);
  },
);

const TitleStyled = styled(Box)`
  margin-right: 50px;
  font-weight: 600;
`;

const ItemStyled = styled(Box)`
  margin: 10px 0;
`;
