import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button, Typography, Grid } from '@material-ui/core';
import { FormControlTextField, FormControlSelect } from '@components/form';
import { ShowroomSearchFields as Fields, ShowroomSearchFieldOptions } from '../types';

export interface AddableSubShowroomSearchProps {
  formMethods: UseFormReturn<Fields>;
  formOptions: Pick<ShowroomSearchFieldOptions, 'searchType'>;
  /** 초기화 액션 */
  onReset: () => void;
  /** 검색 액션 */
  onSearch: () => void;
}

/**
 * 추가 가능한 소속쇼룸 검색폼 컴포넌트
 */
export const AddableSubShowroomSearch: React.FC<AddableSubShowroomSearchProps> = ({
  formMethods,
  formOptions: { searchType },
  onReset: handleReset,
  onSearch: handleSearch,
}) => {
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSearch}>
        <Grid container spacing={2}>
          <Grid item container spacing={2}>
            <Grid item xs={3}>
              <FormControlSelect<Fields> name="searchType" label="검색조건" options={searchType} />
            </Grid>
            <Grid item xs={9}>
              <FormControlTextField<Fields> name="keyword" label="검색어" fullWidth triggerPressEnterSubmit />
            </Grid>
          </Grid>

          <Grid item container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" color="#6b778c" ml={1}>
                쇼룸 자기 자신은 검색에서 제외됩니다.
              </Typography>
            </Grid>
            <Grid item>
              <Button type="button" variant="outlined" color="primary" children="초기화" onClick={handleReset} />
              <Button type="submit" variant="contained" color="primary" children="검색" sx={{ ml: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
