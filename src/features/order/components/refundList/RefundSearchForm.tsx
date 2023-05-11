import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { DateRangeButtonGroup, CheckOptionGroup } from '@features/order/components';
import {
  OrderSearchFieldType,
  OrderSearchFieldTypeLabel,
  OrderSearchRefundType,
  OrderSearchRefundTypeLabel,
  RefundStatusLabel,
  RefundStatusOptions,
} from '@features/order/constants';
import { OrderRefundSearchFormField } from '@features/order/types';
import { ReturnTypeUseOrderRefundListService } from '@features/order/services';
import { useMemo } from 'react';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlAutoComplete,
} from '@components/form';

interface Props {
  form: ReturnTypeUseOrderRefundListService['form'];
  providerCombo: ReturnTypeUseOrderRefundListService['providerCombo'];
}

/**
 * 검색 타입 옵션
 */
const searchFieldOptions = Object.keys(OrderSearchFieldType).map((key) => {
  return {
    label: OrderSearchFieldTypeLabel[key],
    value: OrderSearchFieldType[key],
  };
});

/**
 * 주문 환불상태 옵션
 */
const orderRefundStatusOptions = RefundStatusOptions.map((option) => {
  return {
    label: RefundStatusLabel[option],
    value: option,
  };
});

/**
 * 환불 타입 옵션
 */
const orderRefundTypeOption: Array<{ label: string; value: string }> = [
  { label: '전체', value: '' },
  { label: OrderSearchRefundTypeLabel[OrderSearchRefundType.RETURN], value: OrderSearchRefundType.RETURN },
  {
    label: OrderSearchRefundTypeLabel[OrderSearchRefundType.CANCEL_PAYMENT],
    value: OrderSearchRefundType.CANCEL_PAYMENT,
  },
];

/**
 * 환불 리스트 검색폼 component
 */
export const RefundSearchForm = ({
  form: {
    formMethod: {
      watch,
      formState: { errors },
    },
    handleSubmit,
    handleReset,
    handleChangeDateRange,
    handleUpdateStatusList,
  },
  providerCombo,
}: Props) => {
  const [searchType, refundStatusListValues] = watch(['searchType', 'refundStatusList']);

  const placeHolder = useMemo(() => {
    if (searchType === OrderSearchFieldType.ORDER) {
      return '주문번호, 주문자명, 주문자연락처, 아이디';
    } else {
      return '상품명, 상품코드';
    }
  }, [searchType]);

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={2} xs={12}>
              <FormControlSelect<OrderRefundSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<OrderRefundSearchFormField>
                name="keyword"
                label=""
                placeholder={placeHolder}
                sx={{ width: '350px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderRefundSearchFormField> name="fromDate" label="환불요청일 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderRefundSearchFormField> name="toDate" label="환불요청일 검색범위(종료)" />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <DateRangeButtonGroup onChangeDateRange={handleChangeDateRange} />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>종류</FormLabel>
                <FormGroup row>
                  <FormControlRadioGroup<OrderRefundSearchFormField>
                    name="refundType"
                    options={orderRefundTypeOption}
                  />
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상태</FormLabel>
                <FormGroup row>
                  <CheckOptionGroup
                    formFieldName="refundStatusList"
                    options={orderRefundStatusOptions}
                    selectedOptions={refundStatusListValues}
                    onUpdateSelectList={handleUpdateStatusList}
                  />
                  {errors?.refundStatusList && (
                    <ErrorWrapperStyled>{errors?.refundStatusList['message']}</ErrorWrapperStyled>
                  )}
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {providerCombo && (
              <Grid item md={12} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderRefundSearchFormField>
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
  width: 100%;
  color: red;
  margin-top: 5px;
`;
