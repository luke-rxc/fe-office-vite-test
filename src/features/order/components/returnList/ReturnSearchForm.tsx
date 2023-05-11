import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { DateRangeButtonGroup, CheckOptionGroup } from '@features/order/components';
import {
  OrderSearchFieldType,
  OrderSearchFieldTypeLabel,
  OrderSearchReturnType,
  OrderSearchReturnTypeLabel,
  ReturnStatusLabel,
  ReturnStatusOptions,
} from '@features/order/constants';
import { OrderReturnSearchFormField } from '@features/order/types';
import { ReturnTypeUseOrderReturnListService } from '@features/order/services';
import { useMemo } from 'react';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlRadioGroup,
  FormControlAutoComplete,
} from '@components/form';

interface Props {
  form: ReturnTypeUseOrderReturnListService['form'];
  providerCombo: ReturnTypeUseOrderReturnListService['providerCombo'];
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
const orderReturnStatusOptions = ReturnStatusOptions.map((option) => {
  return {
    label: ReturnStatusLabel[option],
    value: option,
  };
});

/**
 * 반품/교환 타입 옵션
 */
const orderReturnTypeOption: Array<{ label: string; value: string }> = [
  { label: '전체', value: '' },
  { label: OrderSearchReturnTypeLabel[OrderSearchReturnType.RETURN], value: OrderSearchReturnType.RETURN },
  { label: OrderSearchReturnTypeLabel[OrderSearchReturnType.EXCHANGE], value: OrderSearchReturnType.EXCHANGE },
];

/**
 * 반품 리스트 검색폼 component
 */
export const ReturnSearchForm = ({
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
  const [searchType, returnStatusListValues] = watch(['searchType', 'returnStatusList']);

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
              <FormControlSelect<OrderReturnSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<OrderReturnSearchFormField>
                name="keyword"
                label=""
                placeholder={placeHolder}
                sx={{ width: '350px' }}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderReturnSearchFormField> name="fromDate" label="반품요청일 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderReturnSearchFormField> name="toDate" label="반품요청일 검색범위(종료)" />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <DateRangeButtonGroup onChangeDateRange={handleChangeDateRange} />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>종류</FormLabel>
                <FormGroup row>
                  <FormControlRadioGroup<OrderReturnSearchFormField>
                    name="returnType"
                    options={orderReturnTypeOption}
                  />
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상태</FormLabel>
                <FormGroup row>
                  <CheckOptionGroup
                    formFieldName="returnStatusList"
                    options={orderReturnStatusOptions}
                    selectedOptions={returnStatusListValues}
                    onUpdateSelectList={handleUpdateStatusList}
                  />
                  {errors?.returnStatusList && (
                    <ErrorWrapperStyled>{errors?.returnStatusList['message']}</ErrorWrapperStyled>
                  )}
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {providerCombo && (
              <Grid item md={12} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderReturnSearchFormField>
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
