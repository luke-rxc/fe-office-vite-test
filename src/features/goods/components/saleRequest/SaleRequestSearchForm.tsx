import React from 'react';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { Box, Button, Card, FormControl, FormGroup, FormLabel, Grid, MenuItem } from '@material-ui/core';
import { env } from '@config';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlCheckbox,
  FormControlAutoComplete,
} from '@components/form';
import { SaleRequestListFormField, ProviderModel, ComboModel } from '../../models';
import { GoodsTypeCbOptions, GoodsTypeLabel, DateTypeOptions } from '../../constants';
import { log, callbackDateConverter } from '../../utils';
import { DatePickerPreset } from '../DatePickerPreset';

interface Props {
  // onReset: () => void;
  // react-hook-form method
  methods: UseFormReturn<SaleRequestListFormField>;

  // search brand
  brandListOptions: ComboModel[];

  // provider
  providerListOptions: ProviderModel[];

  // md
  mdListOptions: ComboModel[];

  // md
  managerListOptions: ComboModel[];

  // submit
  onSubmit: (value: SaleRequestListFormField) => void;

  // reset
  onReset: () => void;

  // preset
  onDatePreset: (range?: number) => () => void;
}

export const SaleRequestSearchForm: React.FC<Props> = ({
  methods,
  brandListOptions,
  providerListOptions,
  mdListOptions,
  managerListOptions,
  onSubmit: handleSearchSubmit,
  onReset: handleReset,
  onDatePreset: handleDatePreset,
}) => {
  const { getValues } = useFormContext();
  const { handleSubmit } = methods;
  const handleDebug = () => {
    log('handleDebug', getValues());
  };
  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit(handleSearchSubmit)} onReset={handleReset}>
          <Grid container spacing={3}>
            {/* 상품명 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상품명</FormLabel>
                <FormControlTextField<SaleRequestListFormField>
                  name="name"
                  label=""
                  placeholder="상품명을 입력해주세요"
                  fullWidth
                />
              </FormControlStyled>
            </Grid>
            {/* // 상품명 */}

            {/* 상품 유형 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상품 유형</FormLabel>
                {GoodsTypeCbOptions.map((option, index) => {
                  return (
                    <FormControlCheckbox<SaleRequestListFormField>
                      name={`typeList.${index}`}
                      key={option}
                      label={GoodsTypeLabel[option]}
                      value={option}
                    />
                  );
                })}
              </FormControlStyled>
            </Grid>
            {/* // 상품 유형 */}

            {/* 입점사 */}
            <Grid item md={6} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>입점사</FormLabel>
                <FormGroup row>
                  <FormControlAutoComplete<SaleRequestListFormField>
                    name="providerInfo"
                    options={providerListOptions}
                    getOptionLabel={({ label }: ProviderModel) => (label ? label : '')}
                    isOptionEqualToValue={(v: ProviderModel, o: ProviderModel) => v.value === o.value}
                    placeholder="입점사를 입력해주세요"
                    sx={{ width: '300px' }}
                  />
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {/* // 입점사 */}

            {/* 브랜드 */}
            <Grid item md={6} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>브랜드</FormLabel>
                <FormGroup row>
                  <FormControlAutoComplete<SaleRequestListFormField>
                    name="brandInfo"
                    options={brandListOptions}
                    getOptionLabel={({ label }: ComboModel) => (label ? label : '')}
                    isOptionEqualToValue={(v: ComboModel, o: ComboModel) => v.value === o.value}
                    placeholder="브랜드명을 입력해주세요"
                    sx={{ width: '300px' }}
                  />
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {/* // 브랜드 */}

            {/* MD */}
            <Grid item md={6} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>MD</FormLabel>
                <FormGroup row>
                  <FormControlSelect<SaleRequestListFormField>
                    name="mdId"
                    inputProps={{ 'aria-label': 'mdId' }}
                    options={mdListOptions}
                    displayEmpty
                    sx={{ width: '300px' }}
                  >
                    <MenuItem value="">전체</MenuItem>
                  </FormControlSelect>
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {/* // MD */}

            {/* 상품 담당자 */}
            <Grid item md={6} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상품 담당자</FormLabel>
                <FormGroup row>
                  <FormControlSelect<SaleRequestListFormField>
                    name="amdId"
                    inputProps={{ 'aria-label': 'amdId' }}
                    options={managerListOptions}
                    displayEmpty
                    sx={{ width: '300px' }}
                  >
                    <MenuItem value="">전체</MenuItem>
                  </FormControlSelect>
                </FormGroup>
              </FormControlStyled>
            </Grid>
            {/* // 상품 담당자 */}

            {/* 판매기간 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>판매기간</FormLabel>
                <Grid item md={2} xs={12} sx={{ mr: 2 }}>
                  <FormControlSelect<SaleRequestListFormField>
                    name="dateType"
                    label="기간 기준"
                    inputProps={{ 'aria-label': 'dateType' }}
                    options={DateTypeOptions}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <FormControlDatePicker<SaleRequestListFormField>
                    name="fromDate"
                    label="판매시작일"
                    callbackDateConverter={callbackDateConverter}
                  />
                </Grid>
                <Grid item md={3} xs={12} sx={{ ml: 3 }}>
                  <FormControlDatePicker<SaleRequestListFormField>
                    name="toDate"
                    label="판매종료일"
                    callbackDateConverter={callbackDateConverter}
                  />
                </Grid>
                <Grid item md={3} xs={12} sx={{ ml: 3 }}>
                  <DatePickerPreset onDatePreset={handleDatePreset} sx={{ ml: 2 }} />
                </Grid>
              </FormControlStyled>
            </Grid>
            {/* // 판매기간 */}

            {/* 상품 아이디 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상품 아이디</FormLabel>
                <FormControlTextField<SaleRequestListFormField>
                  name="goodsIds"
                  label=""
                  placeholder="복수의 아이디일 경우에 콤마(,)로 구분해주세요"
                  fullWidth
                />
              </FormControlStyled>
            </Grid>
            {/* // 상품 아이디 */}
          </Grid>

          {/* 버튼 영역 */}
          <ButtonWrapperStyled>
            <Button color="primary" type="submit" variant="contained">
              검색
            </Button>
            <Button color="secondary" type="reset" variant="contained" sx={{ ml: 1 }}>
              초기화
            </Button>
            {!env.isProduction && (
              <Button color="secondary" type="button" variant="contained" sx={{ ml: 1 }} onClick={handleDebug}>
                Debugger
              </Button>
            )}
          </ButtonWrapperStyled>
          {/* // 버튼 영역 */}
        </form>
      </WrapperStyled>
    </Card>
  );
};

const WrapperStyled = styled(Box)`
  min-height: 100%;
  padding: 25px 40px;
`;

const FormControlStyled = styled(FormControl)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > label:first-of-type {
    width: 80px;
    margin-right: 20px;
    flex-shrink: 0;
  }
`;

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 10px;

  & > button {
    width: 100px;
  }
`;
