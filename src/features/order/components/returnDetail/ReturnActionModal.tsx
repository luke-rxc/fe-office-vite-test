import { Modal } from '@components/Modal';
import { TOption } from '@components/Select';
import {
  ReturnRejectReasonItems,
  ReturnRequestType,
  ReturnRequestTypeLabel,
  ReturnWithdrawReasonItems,
} from '@features/order/constants';
import { ReturnTypeUseOrderReturnActionService, ReturnTypeUseOrderReturnDetailService } from '@features/order/services';
import { OrderReturnActionFormField } from '@features/order/types';
import { Box, Button, Grid, MenuItem } from '@material-ui/core';
import { useMemo } from 'react';
import { FormControlTextField, FormControlSelect } from '@components/form';

interface Props {
  typeName: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['type']['name'];
  returnRequestType: ReturnTypeUseOrderReturnActionService['returnRequest']['returnRequestType'];
  opened: ReturnTypeUseOrderReturnActionService['returnRequest']['opened'];
  handleSubmit: ReturnTypeUseOrderReturnActionService['returnRequest']['handleSubmit'];
  handleCloseModal: ReturnTypeUseOrderReturnActionService['returnRequest']['handleCloseModal'];
}

export const ReturnActionModal = ({ typeName, returnRequestType, opened, handleSubmit, handleCloseModal }: Props) => {
  const options = useMemo(() => {
    const items = returnRequestType === ReturnRequestType.REJECT ? ReturnRejectReasonItems : ReturnWithdrawReasonItems;
    return items.map<TOption>((item) => {
      return {
        value: item,
        label: item,
      };
    });
  }, [returnRequestType]);

  return (
    <Modal
      title={`${typeName}${returnRequestType ? ReturnRequestTypeLabel[returnRequestType] : ''}`}
      open={opened}
      children={
        <form onSubmit={handleSubmit}>
          <Grid container gap={1} width="100%">
            <Grid item xs={12}>
              <FormControlSelect<OrderReturnActionFormField>
                name="reasonItem"
                options={options}
                displayEmpty
                rules={{ required: '사유를 선택하세요' }}
              >
                <MenuItem value="" disabled>
                  사유선택
                </MenuItem>
              </FormControlSelect>
            </Grid>
            <Grid item xs={12}>
              <FormControlTextField<OrderReturnActionFormField> name="reason" fullWidth placeholder="사유입력" />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" p="20px">
            <Button type="submit" variant="contained">
              확인
            </Button>
          </Box>
        </form>
      }
      width="100%"
      height="200px"
      minHeight="300px"
      onClose={handleCloseModal}
    />
  );
};
