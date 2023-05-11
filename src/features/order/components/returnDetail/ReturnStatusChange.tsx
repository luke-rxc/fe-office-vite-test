import { FormControlSelect, FormControlTextField } from '@components/form';
import { ReturnTypeUseOrderReturnDetailService } from '@features/order/services';
import { OrderReturnStatusFormField } from '@features/order/types';
import { Box, Button } from '@material-ui/core';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  changeableStatusList: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['changeableStatusList'];
  isManager: ReturnTypeUseOrderReturnDetailService['isManager'];
  status: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['status']['code'];
  type: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['type'];
  tempReturnShippingCostText: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['tempReturnShippingCostText'];
  returnShippingCostText: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['returnShippingCostText'];
  isCancelExportTicket: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isCancelExportTicket'];
  exportTicketInfo: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['exportTicketInfo'];
  handleClickExportTicketCancelTicket: ReturnTypeUseOrderReturnDetailService['handleClickExportTicketCancelTicket'];
}

/**
 * 반품 상태변경 component
 */
export const ReturnStatusChange = ({
  changeableStatusList,
  isManager,
  status,
  type: { code: typeCode, name: typeName },
  tempReturnShippingCostText,
  returnShippingCostText,
  isCancelExportTicket,
  exportTicketInfo,
  handleClickExportTicketCancelTicket,
}: Props) => {
  const { watch } = useFormContext();
  const currentStatus = watch('returnStatus') as string;
  const { isPossibleCancelRequest, message } = exportTicketInfo || { isPossibleCancelRequest: false, message: null };
  const showShippingCostInput = useMemo(() => {
    if (isManager) {
      if (status === 'COMPLETE') {
        return false;
      } else if (typeCode === 'exchange' && currentStatus === 'COMPLETE') {
        return true;
      }
    } else {
      if (status === 'APPROVE' || status === 'DENY') {
        return false;
      } else if (currentStatus === 'APPROVE' || currentStatus === 'DENY') {
        return true;
      }
    }

    return false;
  }, [currentStatus, isManager, typeCode, status]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="column" sx={{ p: '20px', background: '#ffffff' }}>
      {tempReturnShippingCostText !== null && (
        <Box textAlign="center" sx={{ mb: '15px' }}>
          <b>
            {isManager ? '파트너 예상 ' : ''}고객부담 {typeName} 배송비:
          </b>{' '}
          {tempReturnShippingCostText}원
        </Box>
      )}

      {status === 'COMPLETE' && (
        <Box textAlign="center" sx={{ mb: '15px' }}>
          <b>{typeName} 배송비:</b> {returnShippingCostText}원
        </Box>
      )}

      {message && (
        <Box sx={{ color: 'red', backgroundColor: '#ffffff', textAlign: 'center', p: '10px 0 20px' }}>{message}</Box>
      )}

      <Box display="flex" justifyContent="center" alignItems="center">
        <FormControlSelect<OrderReturnStatusFormField>
          name="returnStatus"
          size="small"
          options={changeableStatusList}
          sx={{ width: '300px', mr: '20px' }}
        />
        {showShippingCostInput && (
          <FormControlTextField<OrderReturnStatusFormField>
            name="shippingCost"
            size="small"
            label="고객부담 환불 배송비"
            defaultValue="0"
            rules={{ required: true }}
            inputProps={{ type: 'number', min: 0 }}
            sx={{ width: '200px', mr: '20px' }}
          />
        )}
        <Button type="submit" variant="contained" disabled={currentStatus === status}>
          상태변경
        </Button>

        {isPossibleCancelRequest && (
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ ml: '10px' }}
            onClick={handleClickExportTicketCancelTicket}
          >
            연동사 취소요청
          </Button>
        )}
      </Box>
    </Box>
  );
};
