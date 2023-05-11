import styled from '@emotion/styled';
import { RefundStatus } from '@features/order/constants';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { OrderRefundPriceFormField } from '@features/order/types';
import { Box, Button } from '@material-ui/core';
import { FormControlSelect } from '@components/form';

interface Props {
  item: ReturnTypeUseOrderRefundDetailService['orderRefundPriceInfo'];
  refundStatusCode: ReturnTypeUseOrderRefundDetailService['orderRefundDetail']['status']['code'];
}

/**
 * 환불 action component
 */
export const RefundAction = ({ item: { refundableMethods, changeableStatusList }, refundStatusCode }: Props) => {
  return (
    <Box sx={{ padding: '20px 0', backgroundColor: '#ffffff' }}>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ paddingTop: '20px' }}>
        <InfoStyled>환불방법:</InfoStyled>
        <FormControlSelect<OrderRefundPriceFormField>
          name="refundMethod"
          options={refundableMethods}
          disabled={refundStatusCode === RefundStatus.COMPLETE}
          size="small"
          sx={{ width: '200px' }}
        />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ paddingTop: '20px' }}>
        <FormControlSelect<OrderRefundPriceFormField>
          name="refundStatus"
          options={changeableStatusList}
          size="small"
          disabled={refundStatusCode === RefundStatus.COMPLETE}
          showError
          sx={{ width: '200px', marginRight: '10px' }}
        />
        {refundStatusCode !== RefundStatus.COMPLETE && (
          <Button type="submit" variant="contained">
            확인
          </Button>
        )}
      </Box>
    </Box>
  );
};

const InfoStyled = styled(Box)`
  padding: 0 10px;
  font-weight: bold;
`;
