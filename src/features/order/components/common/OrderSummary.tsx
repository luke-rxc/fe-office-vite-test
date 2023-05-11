import styled from '@emotion/styled';
import { OrderDetailCommonItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box } from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

interface Props {
  item: OrderDetailCommonItemOptionModel;
  isManager: ReturnTypeUseOrderDetailService['isManager'];
}

/**
 * 주문 요약정보 component
 */
export const OrderSummary = ({ item, isManager }: Props) => {
  return (
    <Box display="flex" justifyContent="center" sx={{ padding: '10px 0' }}>
      <InfoStyled>총 상품금액 {item.totalPriceText}원</InfoStyled>
      <AddCircleOutline />
      <InfoStyled>배송비 {item.totalShippingCostText}원</InfoStyled>
      <RemoveCircleOutline />
      <InfoStyled>쿠폰할인 {item.totalUsedCouponSaleText}원</InfoStyled>
      {!!isManager && (
        <>
          <RemoveCircleOutline />
          <InfoStyled>적립금 {item.usedPointText}원</InfoStyled>
          <PauseCircleOutlineStyled />
          <InfoStyled>총 결제금액 {item.amountText}원</InfoStyled>
        </>
      )}
    </Box>
  );
};

const InfoStyled = styled(Box)`
  padding: 0 10px;
  font-weight: bold;
`;

const PauseCircleOutlineStyled = styled(PauseCircleOutline)`
  & {
    transform: rotate(90deg);
  }
`;
