import styled from '@emotion/styled';
import { ReturnMethodType, ReturnMethodTypeLabel } from '@features/order/constants';
import {
  ReturnTypeUseOrderRequestReturnService,
  ReturnTypeUseOrderSearchAddressService,
} from '@features/order/services';
import { OrderRequestReturnFormField } from '@features/order/types';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { useMemo } from 'react';
import { FormControlRadioGroup, FormControlTextField } from '@components/form';

interface Props {
  isCancelExportTicket: ReturnTypeUseOrderRequestReturnService['returnItemOption']['isCancelExportTicket'];
  isAutoReturnable: ReturnTypeUseOrderRequestReturnService['isAutoReturnable'];
  onClickShowAddressModal: ReturnTypeUseOrderSearchAddressService['handleClickShowAddressModal'];
}

/**
 * 반품회수정보 component
 */
export const OrderReturnRetrieval = ({
  isCancelExportTicket,
  isAutoReturnable,
  onClickShowAddressModal: handleClickShowAddressModal,
}: Props) => {
  /**
   * 회수방법 옵션
   */
  const returnMethodOptions: Array<{ label: string; value: string; disabled?: boolean }> = useMemo(() => {
    if (isCancelExportTicket) {
      return [{ label: ReturnMethodTypeLabel[ReturnMethodType.USER], value: ReturnMethodType.USER }];
    }

    return [
      { label: ReturnMethodTypeLabel[ReturnMethodType.USER], value: ReturnMethodType.USER },
      {
        label: ReturnMethodTypeLabel[ReturnMethodType.SHOP],
        value: ReturnMethodType.SHOP,
        disabled: !isAutoReturnable,
      },
    ];
  }, [isAutoReturnable, isCancelExportTicket]);

  if (isCancelExportTicket) {
    return (
      <Box sx={{ margin: '20px 0', p: '0 1px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row" rowSpan={4}>
                  <HeaderLabelStyled>
                    반품회수방법<LegendStyled>*</LegendStyled>
                  </HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                    <FormControlRadioGroup<OrderRequestReturnFormField>
                      name="returnMethod"
                      options={returnMethodOptions}
                      rules={{ required: '반품회수방법을 선택하세요' }}
                    />
                  </FormItemStyled>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: '20px 0', p: '0 1px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <HeaderStyled component="th" scope="row">
                <HeaderLabelStyled>
                  반품회수방법<LegendStyled>*</LegendStyled>
                </HeaderLabelStyled>
              </HeaderStyled>
              <TableCell>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormControlRadioGroup<OrderRequestReturnFormField>
                    name="returnMethod"
                    options={returnMethodOptions}
                    rules={{ required: '반품회수방법을 선택하세요' }}
                  />
                </FormItemStyled>
              </TableCell>
              <HeaderStyled component="th" scope="row" rowSpan={3}>
                <HeaderLabelStyled>
                  주소<LegendStyled>*</LegendStyled>
                </HeaderLabelStyled>
              </HeaderStyled>
              <TableCell rowSpan={3}>
                <Box display="flex" flexDirection="column">
                  <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                    <FormItemLabelStyled>우편번호</FormItemLabelStyled>
                    <FormControlTextField<OrderRequestReturnFormField>
                      name="returnSender.postCode"
                      size="small"
                      disabled
                      rules={{ required: '주소를 검색하세요' }}
                    />
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      sx={{ ml: '10px' }}
                      onClick={handleClickShowAddressModal}
                    >
                      찾기
                    </Button>
                  </FormItemStyled>
                  <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                    <FormItemLabelStyled>(주소)</FormItemLabelStyled>
                    <FormControlTextField<OrderRequestReturnFormField>
                      name="returnSender.address"
                      size="small"
                      sx={{ flexGrow: 1 }}
                      disabled
                    />
                  </FormItemStyled>
                  <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                    <FormItemLabelStyled>(상세)</FormItemLabelStyled>
                    <FormControlTextField<OrderRequestReturnFormField>
                      name="returnSender.addressDetail"
                      size="small"
                      sx={{ flexGrow: 1 }}
                      rules={{ required: '상세주소를 입력하세요' }}
                    />
                  </FormItemStyled>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <HeaderStyled component="th" scope="row">
                <HeaderLabelStyled>
                  회수자명<LegendStyled>*</LegendStyled>
                </HeaderLabelStyled>
              </HeaderStyled>
              <TableCell>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormControlTextField<OrderRequestReturnFormField>
                    name="returnSender.name"
                    size="small"
                    rules={{ required: '수령자를 입력하세요' }}
                  />
                </FormItemStyled>
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
                  <FormControlTextField<OrderRequestReturnFormField>
                    name="returnSender.phone"
                    size="small"
                    rules={{ required: '연락처를 입력하세요' }}
                  />
                </FormItemStyled>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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
