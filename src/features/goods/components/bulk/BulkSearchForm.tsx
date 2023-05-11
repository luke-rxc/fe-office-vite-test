import React from 'react';
import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';
import { addDays } from 'date-fns';
import { Box, ButtonGroup, Button, Card, FormControl, FormGroup, FormLabel, Grid } from '@material-ui/core';
import { env } from '@config';
import {
  FormControlSelect,
  FormControlTextField,
  FormControlDatePicker,
  FormControlCheckbox,
  FormControlAutoComplete,
} from '@components/form';
import { ComboModel, ProviderModel, BulkListFormField } from '../../models';
import { BulkSearchTypeOptions, BulkStatusTypeLabel, BulkStatusTypeCbOptions } from '../../constants';
import { log } from '../../utils';

interface Props {
  // form
  onReset: () => void;
  onSubmit: (value: BulkListFormField) => void;

  // search brand
  brandListOptions: ComboModel[];

  // provider
  providerListOptions: ProviderModel[];
}
export const BulkSearchForm: React.FC<Props> = ({
  onReset: handleReset,
  onSubmit: handleSearchSubmit,
  brandListOptions,
  providerListOptions,
}) => {
  const { setValue, getValues, handleSubmit } = useFormContext();
  /** 날짜 Preset */
  const handleDatePreset = (range?: number) => () => {
    const fromDate = Number.isInteger(range) ? addDays(new Date(), -range).getTime() : null;
    const toDate = Number.isInteger(range) ? new Date().getTime() : null;

    setValue('fromDate', fromDate);
    setValue('toDate', toDate);
  };

  const handleDebug = () => {
    log('handleDebug', getValues());
  };

  return (
    <Card>
      <WrapperStyled>
        <form onSubmit={handleSubmit(handleSearchSubmit)} onReset={handleReset}>
          <Grid container spacing={3}>
            {/* 검색 조건 */}
            <Grid item md={2} xs={12}>
              <FormControlSelect<BulkListFormField>
                name="searchType"
                label="검색조건"
                inputProps={{ 'aria-label': 'searchType' }}
                options={BulkSearchTypeOptions}
                autoWidth
              />
            </Grid>
            <Grid item md={10} xs={12}>
              <FormControlTextField<BulkListFormField>
                name="keyword"
                label=""
                fullWidth
                placeholder="처리내용, 상품ID 단위(다중 선택을 하려면 콤마(,)로 붙여 검색하세요)"
              />
            </Grid>
            {/* // 검색 조건 */}

            {/* 입점사 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>입점사</FormLabel>
                <FormGroup row>
                  <FormControlAutoComplete<BulkListFormField>
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
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>브랜드</FormLabel>
                <FormGroup row>
                  <FormControlAutoComplete<BulkListFormField>
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

            {/* 변경일 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>변경일</FormLabel>
                <Grid item md={4} xs={12}>
                  <FormControlDatePicker<BulkListFormField> name="fromDate" label="변경일 검색범위(시작)" />
                </Grid>
                <Grid item md={4} xs={12} sx={{ ml: 3 }}>
                  <FormControlDatePicker<BulkListFormField> name="toDate" label="변경일 검색범위(종료)" />
                </Grid>
                <Grid item md={4} xs={12} sx={{ ml: 3 }}>
                  <ButtonGroup sx={{ ml: 2 }}>
                    <Button children="오늘" onClick={handleDatePreset(0)} />
                    <Button children=" 3일" onClick={handleDatePreset(3)} />
                    <Button children=" 7일" onClick={handleDatePreset(7)} />
                    <Button children="30일" onClick={handleDatePreset(30)} />
                    <Button children="전체" onClick={handleDatePreset()} />
                  </ButtonGroup>
                </Grid>
              </FormControlStyled>
            </Grid>
            {/* // 변경일 */}

            {/* 상태 */}
            <Grid item md={12} xs={12}>
              <FormControlStyled fullWidth>
                <FormLabel>상태</FormLabel>
                {BulkStatusTypeCbOptions.map((option, index) => {
                  return (
                    <FormControlCheckbox<BulkListFormField>
                      name={`statusList.${index}`}
                      key={option}
                      label={BulkStatusTypeLabel[option]}
                      value={option}
                    />
                  );
                })}
              </FormControlStyled>
            </Grid>
            {/* // 상태 */}
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

  & > label {
    width: 80px;
    margin-right: 20px;
    flex-shrink: 0;
  }
`;

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
`;
