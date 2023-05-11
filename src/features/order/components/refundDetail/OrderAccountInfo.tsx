import styled from '@emotion/styled';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { Box } from '@material-ui/core';

interface Props {
  userRefundAccount: ReturnTypeUseOrderRefundDetailService['orderRefundDetail']['userRefundAccount'];
}

/**
 * 사용자 계좌정보 component
 */
export const OrderAccountInfo = ({ userRefundAccount }: Props) => {
  if (!userRefundAccount) {
    return (
      <Box display="flex" sx={{ padding: '10px 20px' }}>
        저장된 정보 없음
      </Box>
    );
  }

  const {
    account,
    bank: { name: bankName },
    depositor,
  } = userRefundAccount;
  return (
    <Box display="flex" justifyContent="flexStart" sx={{ padding: '10px 0' }}>
      <InfoStyled>
        계좌정보:
        <Box>
          {bankName} {account}
        </Box>
      </InfoStyled>
      <InfoStyled>
        계좌주명:<Box>{depositor}</Box>
      </InfoStyled>
    </Box>
  );
};

const InfoStyled = styled(Box)`
  padding: 0 10px;
  font-weight: bold;
  font-size: 18px;
  margin-right: 100px;

  &:last-of-type {
    margin-right: 0;
  }

  > div {
    display: inline-block;
    font-weight: normal;
    margin-left: 20px;
  }
`;
