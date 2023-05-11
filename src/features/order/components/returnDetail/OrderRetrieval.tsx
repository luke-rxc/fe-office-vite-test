import styled from '@emotion/styled';
import { ReturnMethodType, ReturnMethodTypeLabel } from '@features/order/constants';
import { ReturnTypeUseOrderReturnDetailService } from '@features/order/services';
import { OrderReturnDetailFormField } from '@features/order/types';
import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { useMemo } from 'react';
import { FormControlRadioGroup, FormControlTextField } from '@components/form';

interface Props {
  returnReason: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['returnReason'];
  isAutoReturnable: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isAutoReturnable'];
  isChangeableReturnInfo: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isChangeableReturnInfo'];
  isCancelExportTicket: ReturnTypeUseOrderReturnDetailService['orderReturnDetail']['isCancelExportTicket'];
  onClickShowAddressModal: ReturnTypeUseOrderReturnDetailService['address']['handleClickShowAddressModal'];
}

/**
 * 회수정보 component
 */
export const OrderRetrieval = ({
  returnReason,
  isAutoReturnable,
  isChangeableReturnInfo,
  isCancelExportTicket,
  onClickShowAddressModal: handleClickShowAddressModal,
}: Props) => {
  /**
   * 회수방법 옵션
   */
  const returnMethodOptions: Array<{ label: string; value: string; disabled?: boolean }> = useMemo(() => {
    if (isCancelExportTicket) {
      return [
        {
          label: ReturnMethodTypeLabel[ReturnMethodType.USER],
          value: ReturnMethodType.USER,
          disabled: !isChangeableReturnInfo,
        },
      ];
    }
    return [
      {
        label: ReturnMethodTypeLabel[ReturnMethodType.USER],
        value: ReturnMethodType.USER,
        disabled: !isChangeableReturnInfo,
      },
      {
        label: ReturnMethodTypeLabel[ReturnMethodType.SHOP],
        value: ReturnMethodType.SHOP,
        disabled: !isAutoReturnable || !isChangeableReturnInfo,
      },
    ];
  }, [isAutoReturnable, isChangeableReturnInfo, isCancelExportTicket]);

  if (isCancelExportTicket) {
    return (
      <Box sx={{ margin: '20px 0', p: '0 1px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>
                    회수방법<LegendStyled>*</LegendStyled>
                  </HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                    <FormControlRadioGroup<OrderReturnDetailFormField>
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
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              <HeaderLabelStyled>
                회수방법<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlRadioGroup<OrderReturnDetailFormField>
                  name="returnMethod"
                  options={returnMethodOptions}
                  rules={{ required: '반품회수방법을 선택하세요' }}
                />
              </FormItemStyled>
            </TableCell>
            <HeaderStyled component="th" scope="row">
              <HeaderLabelStyled>
                연락처<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <FormControlTextField<OrderReturnDetailFormField>
                  name="phone"
                  size="small"
                  rules={{ required: '연락처를 입력하세요' }}
                  disabled={!isChangeableReturnInfo}
                />
              </FormItemStyled>
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
                <FormControlTextField<OrderReturnDetailFormField>
                  name="name"
                  size="small"
                  rules={{ required: '수령자를 입력하세요' }}
                  disabled={!isChangeableReturnInfo}
                />
              </FormItemStyled>
            </TableCell>
            <HeaderStyled component="th" scope="row" rowSpan={2}>
              <HeaderLabelStyled>
                주소<LegendStyled>*</LegendStyled>
              </HeaderLabelStyled>
            </HeaderStyled>
            <TableCell rowSpan={2}>
              <Box display="flex" flexDirection="column">
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>우편번호</FormItemLabelStyled>
                  <FormControlTextField<OrderReturnDetailFormField>
                    name="postCode"
                    size="small"
                    disabled
                    rules={{ required: '주소를 검색하세요' }}
                  />
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    disabled={!isChangeableReturnInfo}
                    onClick={handleClickShowAddressModal}
                    sx={{ ml: '10px' }}
                  >
                    찾기
                  </Button>
                </FormItemStyled>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>(주소)</FormItemLabelStyled>
                  <FormControlTextField<OrderReturnDetailFormField>
                    name="address"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    disabled
                  />
                </FormItemStyled>
                <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                  <FormItemLabelStyled>(상세)</FormItemLabelStyled>
                  <FormControlTextField<OrderReturnDetailFormField>
                    name="addressDetail"
                    size="small"
                    disabled={!isChangeableReturnInfo}
                    rules={{ required: '상세주소를 입력하세요' }}
                    sx={{ flexGrow: 1 }}
                  />
                </FormItemStyled>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              반품상세사유
            </HeaderStyled>
            <TableCell>
              <FormItemStyled display="flex" alignItems="center" justifyContent="flexStart">
                <Chip label={returnReason.reason.name} />
                {returnReason.reasonText && <Box ml="10px">{returnReason.reasonText}</Box>}
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
