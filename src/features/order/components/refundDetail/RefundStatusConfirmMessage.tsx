import styled from '@emotion/styled';
import { OrderRefundStatusRequestParams } from '@features/order/types';
import { Box } from '@material-ui/core';

interface Props {
  refundStatusText: string;
  params: OrderRefundStatusRequestParams;
}

/**
 * 환불 상태변경 confirm message component
 */
export const RefundStatusConfirmMessage = ({
  refundStatusText,
  params: { refundPrice, refundPoint, refundShippingCostList },
}: Props) => {
  // v1에서는 환불단위가 shippingId 단일만 선택가능해서 환불배송비 계산을 전체 더해줌
  const refundShippingCost = refundShippingCostList.reduce((target, refundShippingCost) => {
    return target + refundShippingCost.refundShippingCost;
  }, 0);
  return (
    <WrapperStyled>
      <MessageWrapperStyled>
        환불금액 {Number(refundPrice).toLocaleString()}원, 적립금 {Number(refundPoint).toLocaleString()}원 적립
      </MessageWrapperStyled>
      <MessageWrapperStyled>
        환불 배송비 <PriceStyled>{refundShippingCost.toLocaleString()}</PriceStyled>원
      </MessageWrapperStyled>
      {refundShippingCost !== 0 && <InfoStyled>(환불 배송비를 확인해주세요)</InfoStyled>}
      <MessageWrapperStyled>
        환불 상태를 <StatusStyled>`{refundStatusText}`</StatusStyled>로 변경하시겠습니까?
      </MessageWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  width: 500px;
  padding: 20px 0;
`;

const MessageWrapperStyled = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 5px;
`;

const PriceStyled = styled(Box)`
  color: red;
  margin: 0 2px;
`;

const InfoStyled = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 5px;
  color: red;
`;

const StatusStyled = styled(Box)`
  color: red;
  font-weight: bold;
  margin: 0 5px;
`;
