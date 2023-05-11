import styled from '@emotion/styled';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { Box } from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

interface Props {
  item: ReturnTypeUseOrderRefundDetailService['orderRefundPriceInfo'];
}

/**
 * 환불 요약정보 component
 */
export const RefundSummary = ({
  item: {
    refundPriceText,
    refundPointText,
    totalRefundGoodsPriceText,
    totalRefundShippingCost,
    totalRefundShippingCostText,
    totalUsedCouponPriceText,
  },
}: Props) => {
  return (
    <Box sx={{ padding: '20px 0' }}>
      <Box display="flex" justifyContent="center">
        <InfoStyled>
          환불 상품 금액 <PriceStyled>{totalRefundGoodsPriceText}</PriceStyled>원
        </InfoStyled>
        <RemoveCircleOutline />
        <InfoStyled>
          쿠폰 금액 <PriceStyled>{totalUsedCouponPriceText}</PriceStyled>원
        </InfoStyled>
        {totalRefundShippingCost >= 0 ? <AddCircleOutline /> : <RemoveCircleOutline />}
        <InfoStyled>
          배송비 <PriceStyled>{totalRefundShippingCostText}</PriceStyled>원
        </InfoStyled>
        <PauseCircleOutlineStyled />
        <InfoStyled>
          환불 금액 <PriceStyled>{refundPriceText}</PriceStyled>원
        </InfoStyled>
        <AddCircleOutline />
        <InfoStyled>
          적립금 <PriceStyled>{refundPointText}</PriceStyled>원 적립
        </InfoStyled>
      </Box>
    </Box>
  );
};

const InfoStyled = styled(Box)`
  padding: 0 10px;
  font-weight: bold;
`;

const PriceStyled = styled(Box)`
  display: inline-block;
  color: red;
`;

const PauseCircleOutlineStyled = styled(PauseCircleOutline)`
  & {
    transform: rotate(90deg);
  }
`;
