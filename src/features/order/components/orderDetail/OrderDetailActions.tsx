import styled from '@emotion/styled';
import { OrderRequestType, OrderStatus } from '@features/order/constants';
import { ReturnTypeUseOrderDetailActionService, ReturnTypeUseOrderRequestService } from '@features/order/services';
import { Box, Button } from '@material-ui/core';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';

interface Props {
  orderStatus: OrderStatus;
  isExchangeable: boolean;
  isRefundable: boolean;
  isReturnable: boolean;
  actions: ReturnTypeUseOrderDetailActionService['actions'];
  onClickShowRequestModal: ReturnTypeUseOrderRequestService['handleClickShowRequestModal'];
}

export const OrderDetailActions = ({
  orderStatus,
  isExchangeable,
  isRefundable,
  isReturnable,
  actions: { handleClickOrderPaid, handleClickOrderPreparingGoods },
  onClickShowRequestModal: handleClickShowRequestModal,
}: Props) => {
  return (
    <Box>
      {orderStatus === OrderStatus.PAID && (
        <ButtonStyled type="button" variant="outlined" onClick={handleClickOrderPreparingGoods} startIcon={<Redo />}>
          상품준비 상태로 변경
        </ButtonStyled>
      )}

      {orderStatus === OrderStatus.PREPARING_GOODS && (
        <ButtonStyled type="button" variant="outlined" onClick={handleClickOrderPaid} startIcon={<Undo />}>
          결제완료 상태로 변경
        </ButtonStyled>
      )}

      {isReturnable && (
        <ButtonStyled type="button" variant="contained" onClick={handleClickShowRequestModal(OrderRequestType.RETURN)}>
          반품 요청
        </ButtonStyled>
      )}

      {isExchangeable && (
        <ButtonStyled
          type="button"
          variant="contained"
          onClick={handleClickShowRequestModal(OrderRequestType.EXCHANGE)}
        >
          교환 요청
        </ButtonStyled>
      )}

      {isRefundable && (
        <ButtonStyled type="button" variant="contained" onClick={handleClickShowRequestModal(OrderRequestType.REFUND)}>
          취소 요청
        </ButtonStyled>
      )}
    </Box>
  );
};

const ButtonStyled = styled(Button)`
  margin-left: 10px;
`;
