import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid, MenuItem } from '@material-ui/core';
import { DateRangeButtonGroup, StatusOptionGroup } from '@features/order/components';
import {
  OrderSearchFieldType,
  OrderSearchFieldTypeLabel,
  OrderStatusBeforeExportOptions,
  OrderStatusAfterExportOptions,
  GoodsType,
  GoodsTypeLabel,
  ShippingMethodType,
  ShippingMethodTypeLabel,
} from '@features/order/constants';
import { OrderSearchFormField } from '@features/order/types';
import { ReturnTypeUseOrderListService } from '@features/order/services';
import { useMemo } from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlAutoComplete,
} from '@components/form';

interface Props {
  form: ReturnTypeUseOrderListService['form'];
  providerCombo: ReturnTypeUseOrderListService['providerCombo'];
  mdCombo: ReturnTypeUseOrderListService['mdCombo'];
  brandCombo: ReturnTypeUseOrderListService['brandCombo'];
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
 * 상품 타입 옵션
 */
const goodsTypeOptions = Object.keys(GoodsType).map((key) => {
  return {
    label: GoodsTypeLabel[key],
    value: GoodsType[key],
  };
});

/**
 * 배송방법 옵션
 */
const shippingMethodOptions = Object.keys(ShippingMethodType).map((key) => {
  return {
    label: ShippingMethodTypeLabel[key],
    value: ShippingMethodType[key],
  };
});

/**
 * 주문 리스트 검색폼 component
 */
export const OrderSearchForm = ({
  form: {
    formMethod: {
      formState: { errors },
      watch,
    },
    handleSubmit,
    handleReset,
    handleUpdateOrderStepList,
    handleChangeDateRange,
    handleSelectAllItems,
    handleUnselectAllItems,
  },
  providerCombo,
  mdCombo,
  brandCombo,
}: Props) => {
  const [orderStepListValues, searchType] = watch(['orderStepList', 'searchType']);

  const isSelectAll =
    OrderStatusBeforeExportOptions.length + OrderStatusAfterExportOptions.length ===
    orderStepListValues.filter((item) => !!item).length;

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
              <FormControlSelect<OrderSearchFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={searchFieldOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<OrderSearchFormField>
                name="keyword"
                label=""
                sx={{ width: '350px' }}
                placeholder={placeHolder}
              />
            </Grid>

            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderSearchFormField> name="fromDate" label="주문일 검색범위(시작)" />
            </Grid>
            <Grid item md={3} xs={6}>
              <FormControlDatePicker<OrderSearchFormField> name="toDate" label="주문일 검색범위(종료)" />
            </Grid>
            <Grid item md={6} xs={12} display="flex" alignItems="center">
              <DateRangeButtonGroup onChangeDateRange={handleChangeDateRange} />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>주문상태</FormLabel>
                <FormGroup>
                  <Box>
                    <StatusOptionGroup
                      buttonLabel="출고전 상태"
                      options={OrderStatusBeforeExportOptions}
                      startIndex={0}
                      selectedOptions={orderStepListValues}
                      onUpdateOrderStepList={handleUpdateOrderStepList}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={isSelectAll ? <CheckBoxOutlineBlank /> : <CheckBoxIcon />}
                      onClick={isSelectAll ? handleUnselectAllItems : handleSelectAllItems}
                    >
                      전체 {isSelectAll ? '해제' : '선택'}
                    </Button>
                  </Box>
                  <Box>
                    <StatusOptionGroup
                      buttonLabel="출고후 상태"
                      options={OrderStatusAfterExportOptions}
                      startIndex={OrderStatusBeforeExportOptions.length}
                      selectedOptions={orderStepListValues}
                      onUpdateOrderStepList={handleUpdateOrderStepList}
                    />
                  </Box>

                  <Grid container mt="4px">
                    <Grid item xs={6}>
                      {errors?.orderStepList && (
                        <ErrorWrapperStyled>{errors?.orderStepList['message']}</ErrorWrapperStyled>
                      )}
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={4} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상품타입</FormLabel>
                <FormGroup row>
                  <FormControlSelect<OrderSearchFormField>
                    name="goodsType"
                    inputProps={{ 'aria-label': 'goodsType' }}
                    options={goodsTypeOptions}
                    displayEmpty
                    sx={{ width: '300px' }}
                  >
                    <MenuItem value="">전체</MenuItem>
                  </FormControlSelect>
                </FormGroup>
              </FormControlStyled>
            </Grid>

            <Grid item md={4} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>배송방법</FormLabel>
                <FormGroup row>
                  <FormControlSelect<OrderSearchFormField>
                    name="shippingMethod"
                    inputProps={{ 'aria-label': 'goodsType' }}
                    options={shippingMethodOptions}
                    sx={{ width: '300px' }}
                    displayEmpty
                  >
                    <MenuItem value="">전체</MenuItem>
                  </FormControlSelect>
                </FormGroup>
              </FormControlStyled>
            </Grid>

            {mdCombo && (
              <Grid item md={4} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>MD</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderSearchFormField>
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

            {providerCombo && (
              <Grid item md={4} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>입점사</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderSearchFormField>
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

            {brandCombo && (
              <Grid item md={4} xs={12}>
                <FormControlStyled fullWidth>
                  <FormLabel>브랜드</FormLabel>
                  <FormGroup row>
                    <FormControlAutoComplete<OrderSearchFormField>
                      name="brand"
                      options={brandCombo}
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
