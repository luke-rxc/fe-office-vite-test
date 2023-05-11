import styled from '@emotion/styled';
import { ReturnRequestType } from '@features/order/constants';
import { ReturnTypeUseOrderReturnDetailService, ReturnTypeUseOrderReturnActionService } from '@features/order/services';
import { Box, Button } from '@material-ui/core';

interface Props {
  isReturnableReject: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isRejectable'];
  isReturnableWithdraw: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isWithdrawable'];
  typeName: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['type']['name'];
  onOpenRequestModel: ReturnTypeUseOrderReturnActionService['returnRequest']['handleOpenModal'];
}

/**
 * 반품상세 action component
 */
export const ReturnDetailActions = ({
  isReturnableReject,
  isReturnableWithdraw,
  typeName,
  onOpenRequestModel: handleOpenRequestModel,
}: Props) => {
  const handleClick = (requestType: ReturnRequestType) => {
    return () => {
      handleOpenRequestModel(requestType);
    };
  };

  return (
    <Box>
      {isReturnableWithdraw && (
        <ButtonStyled type="button" variant="contained" onClick={handleClick(ReturnRequestType.WITHDRAW)}>
          {typeName} 철회
        </ButtonStyled>
      )}

      {isReturnableReject && (
        <ButtonStyled type="button" variant="contained" onClick={handleClick(ReturnRequestType.REJECT)}>
          {typeName} 거부
        </ButtonStyled>
      )}
    </Box>
  );
};

const ButtonStyled = styled(Button)`
  margin-left: 10px;
`;
