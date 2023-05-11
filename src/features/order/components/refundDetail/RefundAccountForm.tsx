import styled from '@emotion/styled';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { OrderRefundAccountFormField } from '@features/order/types';
import { Box, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { FormControlSelect, FormControlTextField } from '@components/form';

interface Props {
  bankCodes: ReturnTypeUseOrderRefundDetailService['bankCodes'];
}

/**
 * 환불 계좌정보 component
 */
export const RefundAccountForm = ({ bankCodes }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              <HeaderLabelStyled>
                계좌정보<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell sx={{ width: '40%' }}>
              <FormItemStyled display="flex" alignItems="flexStart" justifyContent="flexStart">
                <FormControlSelect<OrderRefundAccountFormField>
                  name="bankCode"
                  options={bankCodes}
                  size="small"
                  displayEmpty
                  sx={{ width: '150px', mr: '20px' }}
                >
                  <MenuItem value="" disabled>
                    은행선택
                  </MenuItem>
                </FormControlSelect>
                <FormControlTextField<OrderRefundAccountFormField>
                  name="account"
                  size="small"
                  rules={{ required: '계좌번호를 입력하세요' }}
                  sx={{ width: '300px' }}
                />
              </FormItemStyled>
            </TableCell>
            <HeaderStyled component="th" scope="row" rowSpan={2}>
              <HeaderLabelStyled>
                계좌주명<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderRefundAccountFormField>
                  name="depositor"
                  size="small"
                  rules={{ required: '계좌주명을 입력하세요' }}
                  sx={{ width: '300px' }}
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
