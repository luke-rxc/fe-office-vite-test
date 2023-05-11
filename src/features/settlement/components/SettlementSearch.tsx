import React from 'react';
import { getTime } from 'date-fns';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardActions, Divider, Grid } from '@material-ui/core';
import { SettlementSearchForm, SettlementSearchFormOptions } from '../types';
import { FormControlDatePicker, FormControlSelect } from '@components/form';

/** 정산 목록 검색폼 Props Type */
export interface SettlementSearchProps {
  formMethods: UseFormReturn<SettlementSearchForm>;
  formOptions: SettlementSearchFormOptions;
  onReset: () => void;
  onSearch: () => void;
}

/** 정산 목록 검색폼 */
export const SettlementSearch: React.FC<SettlementSearchProps> = ({
  formMethods,
  formOptions,
  onSearch: handleSearch,
  onReset: handleReset,
}) => {
  return (
    <Card>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSearch}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <FormControlDatePicker<SettlementSearchForm>
                  name="year"
                  inputFormat="yyyy"
                  mask="____"
                  views={['year']}
                  callbackDateConverter={getTime}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControlSelect<SettlementSearchForm> name="round" label="정산 주기" options={formOptions.round} />
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControlSelect<SettlementSearchForm> name="count" label="회차" options={formOptions.count} />
              </Grid>
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
