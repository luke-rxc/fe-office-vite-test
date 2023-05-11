import styled from '@emotion/styled';
import { FormControlSelect, FormControlTextField, FormControlDatePicker, FormControlCheckbox } from '@components/form';
import { MemberSearchFormField } from '../types';
import { searchTypeOptions, statusOptions } from '../constants';
import { DateRangeButtonGroup } from '../components';
import { BaseSyntheticEvent } from 'react';
import { Box, Button, Grid } from '@material-ui/core';

export interface MemberSearchFormProps {
  onSubmit: (e?: BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onReset: () => void;
  onChangeJoinDateRange: (range: number) => void;
  onChangeLoginDateRange: (range: number) => void;
}

export const MemberSearchForm = ({
  onSubmit,
  onReset,
  onChangeJoinDateRange: handleChangeJoinDateRange,
  onChangeLoginDateRange: handleChangeLoginDateRange,
}: MemberSearchFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <FormControlSelect<MemberSearchFormField>
            name="searchType"
            label="검색조건"
            inputProps={{ 'aria-label': 'searchType' }}
            options={searchTypeOptions}
            autoWidth
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <FormControlTextField<MemberSearchFormField> name="keyword" label="" sx={{ width: '100%' }} />
        </Grid>
        <Grid item md={4} xs={6}>
          <FormControlDatePicker<MemberSearchFormField> name="joinFromDate" label="가입일 검색범위(시작)" />
        </Grid>
        <Grid item md={4} xs={6}>
          <FormControlDatePicker<MemberSearchFormField> name="joinToDate" label="가입일 검색범위(종료)" />
        </Grid>
        <Grid item md={4} xs={12} display="flex" alignItems="center">
          <DateRangeButtonGroup onChangeDateRange={handleChangeJoinDateRange} />
        </Grid>
        <Grid item md={4} xs={6}>
          <FormControlDatePicker<MemberSearchFormField> name="loginFromDate" label="방문일 검색범위(시작)" />
        </Grid>
        <Grid item md={4} xs={6}>
          <FormControlDatePicker<MemberSearchFormField> name="loginToDate" label="방문일 검색범위(종료)" />
        </Grid>
        <Grid item md={4} xs={12} display="flex" alignItems="center">
          <DateRangeButtonGroup onChangeDateRange={handleChangeLoginDateRange} />
        </Grid>
        <Grid item md={2} xs={4}>
          <FormControlSelect<MemberSearchFormField>
            name="userStatus"
            label="상태"
            inputProps={{ 'aria-label': 'userStatus' }}
            options={statusOptions}
            autoWidth
          />
        </Grid>
        <Grid item md={2} xs={4}>
          <FormControlCheckbox<MemberSearchFormField> name="isBlack" label="블랙리스트" />
        </Grid>
      </Grid>
      <ButtonWrapperStyled>
        <Button color="primary" type="submit" variant="contained">
          검색
        </Button>
        <Button color="secondary" type="button" variant="contained" onClick={onReset} sx={{ ml: 1 }}>
          초기화
        </Button>
      </ButtonWrapperStyled>
    </form>
  );
};

const ButtonWrapperStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
`;
