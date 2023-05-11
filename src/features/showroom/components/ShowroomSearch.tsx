import React from 'react';
import { getTime } from 'date-fns';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardActions, Divider, Grid } from '@material-ui/core';
import { FormControlDatePicker, FormControlTextField, FormControlSelect } from '@components/form';
import { ShowroomSearchFields as Fields, ShowroomSearchFieldOptions } from '../types';
import { FormControlAutoComplete } from './form';

export interface ShowroomSearchProps {
  formMethods: UseFormReturn<Fields>;
  formOptions: ShowroomSearchFieldOptions;
  onReset: () => void;
  onSearch: () => void;
}

/**
 * 쇼룸 검색폼 컴포넌트
 */
export const ShowroomSearch: React.FC<ShowroomSearchProps> = ({
  formMethods,
  formOptions,
  onReset: handleReset,
  onSearch: handleSearch,
}) => {
  const { searchType, dateType, status, keywords } = formOptions;

  return (
    <Card>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSearch}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item md={2} xs={12}>
                <FormControlSelect<Fields> name="searchType" label="검색조건" options={searchType} />
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControlTextField<Fields> name="keyword" label="검색어" fullWidth triggerPressEnterSubmit />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<Fields> name="dateType" label="기간조건" options={dateType} />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlDatePicker<Fields> name="startDate" label="시작일" callbackDateConverter={getTime} />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlDatePicker<Fields> name="endDate" label="종료일" callbackDateConverter={getTime} />
              </Grid>
              <Grid item md={2} xs={12}>
                <FormControlSelect<Fields> name="status" label="공개상태" options={status} />
              </Grid>
              <Grid item md={8} xs={12}>
                <FormControlAutoComplete<Fields> name="keywords" label="키워드" multiple options={keywords} />
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardActions sx={{ px: 2, py: 2, justifyContent: 'flex-end' }}>
            <Button type="button" variant="outlined" color="primary" children="초기화" onClick={handleReset} />
            <Button type="submit" variant="contained" color="primary" children="검색" />
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};
