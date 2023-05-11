import styled from '@emotion/styled';
import { ReturnTypeUseOrderDetailService, ReturnTypeUseOrderSearchAddressService } from '@features/order/services';
import { OrderDetailRecipientFormField } from '@features/order/types';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { FormControlTextField } from '@components/form';

interface Props {
  isChangeShippingInfo: ReturnTypeUseOrderDetailService['orderDetail']['recipient']['isChangeShippingInfo'];
  onClickShowAddressModal: ReturnTypeUseOrderSearchAddressService['handleClickShowAddressModal'];
}

export const OrderDelivery = ({
  isChangeShippingInfo,
  onClickShowAddressModal: handleClickShowAddressModal,
}: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              <HeaderLabelStyled>
                수령자<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderDetailRecipientFormField>
                  name="name"
                  size="small"
                  rules={{ required: '수령자를 입력하세요' }}
                  disabled={!isChangeShippingInfo}
                />
              </FormItemStyled>
            </TableCell>
            <HeaderStyled component="th" scope="row" rowSpan={2}>
              <HeaderLabelStyled>
                배송지주소<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell rowSpan={2}>
              <Box display="flex" flexDirection="column">
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>우편번호</FormItemLabelStyled>
                  <FormControlTextField<OrderDetailRecipientFormField> name="postCode" size="small" disabled />
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    sx={{ ml: '10px' }}
                    onClick={handleClickShowAddressModal}
                    disabled={!isChangeShippingInfo}
                  >
                    찾기
                  </Button>
                </FormItemStyled>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>(주소)</FormItemLabelStyled>
                  <FormControlTextField<OrderDetailRecipientFormField>
                    name="address"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    disabled
                  />
                </FormItemStyled>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>(상세)</FormItemLabelStyled>
                  <FormControlTextField<OrderDetailRecipientFormField>
                    name="addressDetail"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    rules={{ required: '상세주소를 입력하세요' }}
                    disabled={!isChangeShippingInfo}
                  />
                </FormItemStyled>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              <HeaderLabelStyled>
                연락처<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderDetailRecipientFormField>
                  name="phone"
                  size="small"
                  rules={{ required: '연락처를 입력하세요' }}
                  disabled={!isChangeShippingInfo}
                />
              </FormItemStyled>
            </TableCell>
          </TableRow>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              배송 요청사항
            </HeaderStyled>
            <TableCell colSpan={3}>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderDetailRecipientFormField>
                  name="deliveryRequestMessage"
                  size="small"
                  sx={{ flexGrow: 1 }}
                  disabled={!isChangeShippingInfo}
                />
              </FormItemStyled>
            </TableCell>
          </TableRow>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              개인통관 고유부호
            </HeaderStyled>
            <TableCell colSpan={3}>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderDetailRecipientFormField>
                  name="pcccNumber"
                  size="small"
                  disabled={!isChangeShippingInfo}
                />
              </FormItemStyled>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const HeaderStyled = styled(TableCell)`
  & {
    width: 150px;
    background-color: #cccccc;
    text-align: center;
  }
`;

const FormItemStyled = styled(Box)`
  margin: 5px 0;

  .MuiOutlinedInput-input.Mui-disabled,
  .MuiFormControlLabel-label.Mui-disabled {
    -webkit-text-fill-color: #4c4c4c;
    color: #4c4c4c;
  }
`;

const FormItemLabelStyled = styled(Box)`
  width: 50px;
  margin-right: 10px;
`;

const HeaderLabelStyled = styled(Box)`
  display: inline-block;
  position: relative;
`;

const LegendStyled = styled.span`
  position: absolute;
  top: 0;
  right: -12px;
  color: #ff0000;
  font-size: 18px;
`;
