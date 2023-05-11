import React from 'react';
import { Control } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, ButtonGroup, Button } from '@material-ui/core';
import { ACCOUNT_SEARCH_BUTTON_LABELS } from '../constants';
import {
  ACCOUNT_SEARCH_FIELD_NAMES,
  ACCOUNT_SEARCH_FIELD_LABELS,
  ACCOUNT_SEARCH_STATUS_FIELD_VALUES,
} from '../constants';
import {
  accountSearchTypeOptions,
  AccountSearchFormValuesModel,
  ProviderComboListModel,
  ProviderComboItemModel,
} from '../models';
import {
  ControlTextField,
  ControlDatePicker,
  ControlSelect,
  ControlRadioGroup,
  ControlAutocomplete,
} from '../components';

/**
 * 검색 폼 커스텀 스타일
 */
const useStyles = makeStyles((theme: Theme) => ({
  /* stylelint-disable */
  button: { marginLeft: theme.spacing(1), alignSelf: 'center' },
}));

interface IAccountSearchProps {
  /** 관리 계정 타입 */
  isManager: boolean;
  /** react-hook-form control */
  control: Control<AccountSearchFormValuesModel>;
  /** 입점사 리스트 */
  providers: ProviderComboListModel;
  /** 검색 이벤트 콜백 */
  onSearch: () => void;
  /** 검색 초기화 이벤트 콜백 */
  onReset: () => void;
  /** 날짜 프리셋 이벤트 콜백 */
  onDatePreset: (range?: number) => () => void;
}

export const AccountSearch = ({
  isManager,
  control,
  providers,
  onSearch: handleSearch,
  onReset: handleReset,
  onDatePreset: handleDatePreset,
}: IAccountSearchProps): JSX.Element => {
  const styles = useStyles();

  return (
    <form onSubmit={handleSearch}>
      <Grid container spacing={3}>
        {/* 검색조건 */}
        <Grid item md={3} xs={12}>
          <ControlSelect
            control={control}
            name={ACCOUNT_SEARCH_FIELD_NAMES.SEARCH_TYPE}
            label={ACCOUNT_SEARCH_FIELD_LABELS.SEARCH_TYPE}
            options={accountSearchTypeOptions}
          />
        </Grid>

        {/* 검색어 */}
        <Grid item md={8} xs={12}>
          <ControlTextField
            control={control}
            name={ACCOUNT_SEARCH_FIELD_NAMES.KEYWORD}
            label={ACCOUNT_SEARCH_FIELD_LABELS.KEYWORD}
          />
        </Grid>

        {/* 검색기간 시작일 */}
        <Grid item md={3} xs={12}>
          <ControlDatePicker
            disableFuture
            control={control}
            name={ACCOUNT_SEARCH_FIELD_NAMES.FROM_CREATED_DATE}
            label={ACCOUNT_SEARCH_FIELD_LABELS.FROM_CREATED_DATE}
          />
        </Grid>

        {/* 검색기간 종료일 */}
        <Grid item md={3} xs={12}>
          <ControlDatePicker
            disableFuture
            control={control}
            name={ACCOUNT_SEARCH_FIELD_NAMES.TO_CREATED_DATE}
            label={ACCOUNT_SEARCH_FIELD_LABELS.TO_CREATED_DATE}
          />
        </Grid>

        {/* 검색기간 프리셋 */}
        <Grid container item md={3} xs={12} alignItems="center">
          <ButtonGroup fullWidth>
            <Button children="전체" onClick={handleDatePreset()} />
            <Button children="오늘" onClick={handleDatePreset(0)} />
            <Button children=" 3일" onClick={handleDatePreset(3)} />
            <Button children=" 7일" onClick={handleDatePreset(7)} />
            <Button children="14일" onClick={handleDatePreset(14)} />
          </ButtonGroup>
        </Grid>

        {/* 입점사 */}
        {!isManager && (
          <Grid item md={11} xs={12}>
            <ControlAutocomplete
              multiple
              control={control}
              options={providers}
              name={ACCOUNT_SEARCH_FIELD_NAMES.PROVIDER_IDS}
              label={ACCOUNT_SEARCH_FIELD_LABELS.PROVIDER_IDS}
              // material ui에서 요구하는 데이터 검증을 위한 함수들
              getOptionLabel={({ name }: ProviderComboItemModel) => name}
              isOptionEqualToValue={(v: ProviderComboItemModel, o: ProviderComboItemModel) => v.id === o.id}
            />
          </Grid>
        )}

        {/* 계정상태 */}
        <Grid item md={6} xs={12}>
          <ControlRadioGroup
            name={ACCOUNT_SEARCH_FIELD_NAMES.IS_ACTIVE}
            control={control}
            radios={[
              // 모든 계정
              {
                value: ACCOUNT_SEARCH_STATUS_FIELD_VALUES.ALL,
                label: ACCOUNT_SEARCH_FIELD_LABELS.STATUS_ALL,
              },
              // 계정 활성화
              {
                value: ACCOUNT_SEARCH_STATUS_FIELD_VALUES.ACTIVE,
                label: ACCOUNT_SEARCH_FIELD_LABELS.STATUS_ACTIVE,
              },
              // 계정 비활성화
              {
                value: ACCOUNT_SEARCH_STATUS_FIELD_VALUES.PAUSE,
                label: ACCOUNT_SEARCH_FIELD_LABELS.STATUS_PAUSE,
              },
            ]}
          />
        </Grid>

        {/* 액션버튼's */}
        <Grid container item md={6} xs={12} justifyContent="flex-end">
          <Button variant="outlined" className={styles.button} onClick={handleReset}>
            {ACCOUNT_SEARCH_BUTTON_LABELS.RESET}
          </Button>
          <Button type="submit" variant="contained" className={styles.button}>
            {ACCOUNT_SEARCH_BUTTON_LABELS.SUBMIT}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
