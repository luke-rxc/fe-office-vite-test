import styled from '@emotion/styled';
import {
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlTextArea,
  FormControlTextField,
} from '@components/form';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { MILEAGE_ACTION_TYPE, options } from '../constants';
import { MileageFormField } from '../types';

export const MemberMileageForm = () => {
  const { clearErrors } = useFormContext();
  const type = useWatch({ name: 'type' });

  const toJSX = (option) => {
    if (option.value === MILEAGE_ACTION_TYPE.UN_SAVE) {
      const label = (
        <>
          {option.label} <b>(회수)</b>
        </>
      );

      return {
        ...option,
        label,
      };
    }
    return option;
  };

  useEffect(() => {
    clearErrors();
  }, [type, clearErrors]);

  return (
    <Box p="0 10px">
      <form>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>
                    적립타입<LegendStyled>*</LegendStyled>
                  </HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormControlRadioGroup<MileageFormField> name="type" options={options.map(toJSX)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>
                    적립금<LegendStyled>*</LegendStyled>
                  </HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormControlTextField<MileageFormField> name="point" label="" placeholder="" type="number" />
                </TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>
                    만료일{type === MILEAGE_ACTION_TYPE.SAVE && <LegendStyled>*</LegendStyled>}
                  </HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormControlDatePicker<MileageFormField>
                    name="expiredDate"
                    disabled={type === MILEAGE_ACTION_TYPE.UN_SAVE}
                    label=""
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>
                    {type === MILEAGE_ACTION_TYPE.SAVE ? '지급' : '차감'}사유<LegendStyled>*</LegendStyled>
                  </HeaderLabelStyled>
                  <Typography color="primary" variant="body2">
                    (유저에게 노출됩니다.)
                  </Typography>
                </HeaderStyled>
                <TableCell>
                  <FormControlTextField<MileageFormField>
                    name="reason"
                    label=""
                    placeholder=""
                    sx={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  <HeaderLabelStyled>관리자 메모</HeaderLabelStyled>
                </HeaderStyled>
                <TableCell>
                  <FormControlTextArea<MileageFormField> name="memo" placeholder="" width="100%" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </Box>
  );
};

const HeaderLabelStyled = styled(Box)`
  display: inline-block;
  position: relative;
`;

const HeaderStyled = styled(TableCell)`
  & {
    width: 150px;
    background-color: #cccccc;
    text-align: center;
  }
`;

const LegendStyled = styled.span`
  position: absolute;
  top: 0;
  right: -12px;
  color: #ff0000;
  font-size: 18px;
`;
