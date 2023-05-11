import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { DateRangeButtonGroup } from '@features/order/components';
import {
  OrderExportSearchFieldType,
  OrderExportSearchFieldTypeLabel,
  OrderExportSearchFieldTypePlaceholder,
  OrderStatusExportOptions,
  OrderStatusLabel,
} from '@features/order/constants';
import { OrderExportSearchFormField } from '@features/order/types';
import { ReturnTypeUseOrderExportListService } from '@features/order/services';
import { useMemo } from 'react';
import { CheckOptionGroup } from '../CheckOptionGroup';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlCheckbox,
  FormControlAutoComplete,
} from '@components/form';

interface Props {
  form: ReturnTypeUseOrderExportListService['form'];
  providerCombo: ReturnTypeUseOrderExportListService['providerCombo'];
  mdCombo: ReturnTypeUseOrderExportListService['mdCombo'];
  isManager: ReturnTypeUseOrderExportListService['actions']['isManager'];
}

/**
 * 주문 출고상태 옵션
 */
const orderExportStatusOptions = OrderStatusExportOptions.map((option) => {
  return {
    label: OrderStatusLabel[option],
    value: option,
  };
});

/**
 * 출고 리스트 검색폼 component
 */
export const ExportSearchForm = ({
  form: {
    formMethod: {
      formState: { errors },
      watch,
    },
    handleSubmit,
    handleReset,
    handleChangeDateRange,
    handleUpdateOrderStepList,
  },
  providerCombo,
  mdCombo,
  isManager,
}: Props) => {
  const [searchType, exportStatusListValues] = watch(['searchType', 'exportStatusList']);

  const placeHolder = useMemo(() => {
    return OrderExportSearchFieldTypePlaceholder[searchType];
  }, [searchType]);

  const searchFieldOptions = useMemo(() => {
    const keys = Object.keys(OrderExportSearchFieldType).filter(
      (item) => !isManager || item !== OrderExportSearchFieldType.PARTNER_EXPORT_CODE,
    );
    return keys.map((key) => {
      return {
        label: OrderExportSearchFieldTypeLabel[key],
        value: OrderExportSearchFieldType[key],
      };
    });
  }, [isManager]);

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<OrderExportSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<OrderExportSearchFormField>
                name="keyword"
                label=""
                placeholder={placeHolder}
                sx={{ width: '400px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderExportSearchFormField> name="fromDate" label="출고일 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderExportSearchFormField> name="toDate" label="출고일 검색범위(종료)" />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <DateRangeButtonGroup onChangeDateRange={handleChangeDateRange} />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>출고상태</FormLabel>
                <FormGroup>
                  <Box width="100%">
                    <CheckOptionGroup
                      formFieldName="exportStatusList"
                      options={orderExportStatusOptions}
                      selectedOptions={exportStatusListValues}
                      onUpdateSelectList={handleUpdateOrderStepList}
                    />
                  </Box>
                  {errors?.exportStatusList && (
                    <ErrorWrapperStyled>{errors?.exportStatusList['message']}</ErrorWrapperStyled>
                  )}
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>구매확정</FormLabel>
                <FormGroup>
                  <Box width="100%">
                    <FormControlCheckbox<OrderExportSearchFormField> name="purchaseConfirmYN" value={'Y'} />
                  </Box>
                </FormGroup>
              </FormControlStyled>
            </Grid>

            {providerCombo && (
              <Grid item md={4} xs={4}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderExportSearchFormField>
                      name="provider"
                      options={providerCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}

            {mdCombo && (
              <Grid item md={8} xs={8}>
                <FormControlStyled fullWidth>
                  <FormLabel>MD</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderExportSearchFormField>
                      name="md"
                      options={mdCombo}
                      variant="outlined"
                      placeholder="전체"
                      sx={{ width: '300px' }}
                    />
                  </FormGroup>
                </FormControlStyled>
              </Grid>
            )}
          </Grid>
          <ButtonWrapperStyled>
            <Button color="primary" type="submit" variant="contained">
              검색
            </Button>
            <Button color="secondary" type="button" variant="contained" onClick={handleReset} sx={{ ml: 1 }}>
              초기화
            </Button>
          </ButtonWrapperStyled>
        </form>
      </WrapperStyled>
    </Card>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 100%;
  padding: 25px 40px;
`;

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
`;

const FormControlStyled = styled(FormControl)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > label {
    width: 80px;
    margin-right: 20px;
  }
`;

const ErrorWrapperStyled = styled(Box)`
  color: red;
  margin-top: 5px;
`;
