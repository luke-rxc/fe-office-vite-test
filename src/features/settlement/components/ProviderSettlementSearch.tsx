import React from 'react';
import { getTime } from 'date-fns';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardActions, Divider, Grid } from '@material-ui/core';
import { FormControlAutoComplete, FormControlDatePicker, FormControlSelect } from '@components/form';
import { ProviderSettlementSearchForm, ProviderSettlementSearchFormOptions } from '../types';

/** 정산 목록 검색폼 Props Type */
export interface ProviderSettlementSearchProps {
  formMethods: UseFormReturn<ProviderSettlementSearchForm>;
  formOptions: ProviderSettlementSearchFormOptions;
  isManager: boolean;
  onReset: () => void;
  onSearch: () => void;
}

/** 정산 목록 검색폼 */
export const ProviderSettlementSearch: React.FC<ProviderSettlementSearchProps> = ({
  formMethods,
  formOptions,
  isManager,
  onSearch: handleSearch,
  onReset: handleReset,
}) => {
  return (
    <Card>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSearch}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item md={2} xs={12}>
                <FormControlDatePicker<ProviderSettlementSearchForm>
                  name="yyyyMm"
                  inputFormat="yyyy/MM"
                  mask="____/__"
                  label="정산년/월"
                  callbackDateConverter={getTime}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<ProviderSettlementSearchForm>
                  name="round"
                  label="정산 주기"
                  options={formOptions.round}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<ProviderSettlementSearchForm>
                  name="count"
                  label="회차"
                  options={formOptions.count}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<ProviderSettlementSearchForm>
                  name="isPaid"
                  label="지급여부"
                  options={formOptions.paid}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<ProviderSettlementSearchForm>
                  name="isTaxBillPublished"
                  label="세금계산서"
                  options={formOptions.tax}
                />
              </Grid>
              {isManager && (
                <Grid item md={12} xs={12}>
                  <FormControlAutoComplete<ProviderSettlementSearchForm>
                    name="providerName"
                    label="입점사"
                    options={formOptions.providerName}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ px: 2, py: 2, justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" children="검색" />
            <Button type="button" variant="outlined" color="primary" children="초기화" onClick={handleReset} />
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};
