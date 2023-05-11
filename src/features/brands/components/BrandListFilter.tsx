import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  ButtonGroup,
} from '@material-ui/core';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import SearchIcon from '@material-ui/icons/Search';
import PlusIcon from '@assets/icons/Plus';
import { DatePicker } from '@components/DatePicker';
import { Select } from '@components/Select';
import { BrandSearchForm, toSelectOptionsModel } from '../models';
import { SearchTypeLabel } from '../constants';

interface BrandListFilterProps {
  control: Control<BrandSearchForm>;
  rules: {
    fromDate: RegisterOptions;
    toDate: RegisterOptions;
  };
  onBrandCreateClick: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onSelectDateRange: (range?: number) => () => void;
}

export const BrandListFilter = ({
  control,
  rules,
  onBrandCreateClick: handleBrandCreateClick,
  onSubmit: handleSubmit,
  onReset: handleReset,
  onSelectDateRange: handleSelectDateRange,
}: BrandListFilterProps) => {
  return (
    <Card>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          minHeight: '100%',
        }}
      >
        <form onSubmit={handleSubmit}>
          <CardHeader
            sx={{ p: 3 }}
            title="브랜드 조회 필터"
            action={
              <Button
                children="신규 브랜드 생성"
                startIcon={<PlusIcon />}
                size="large"
                variant="contained"
                onClick={handleBrandCreateClick}
              />
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {/* 검색조건 */}
              <Grid item md={3} xs={12}>
                <Controller
                  control={control}
                  name="searchType"
                  render={({ field }) => (
                    <Select {...field} label="검색 조건" options={toSelectOptionsModel(SearchTypeLabel)}></Select>
                  )}
                />
              </Grid>
              <Grid item md={9} xs={12}>
                <Controller
                  control={control}
                  name="keyWord"
                  render={({ field }) => (
                    <TextField fullWidth label="검색어" name="keyword" variant="outlined" {...field} />
                  )}
                />
              </Grid>
              {/* 시작일자 */}
              <Grid item md={3} xs={12}>
                <Controller
                  control={control}
                  name="fromDate"
                  rules={rules.fromDate}
                  render={({ field: { onChange: handleChange, value }, fieldState: { error } }) => {
                    return (
                      <DatePicker
                        disableFuture
                        label="시작일자(생성일)"
                        error={!!error}
                        helperText={error?.message}
                        /** @todo Timestamp로 변환하는 방식을 공통 컴포넌트 기준으로 처리하기 */
                        onChange={(value: Date) => handleChange(new Date(value).getTime())}
                        value={value}
                      />
                    );
                  }}
                />
              </Grid>
              {/* 종료일자 */}
              <Grid item md={3} xs={12}>
                <Controller
                  control={control}
                  name="toDate"
                  rules={rules.toDate}
                  render={({ field: { onChange: handleChange, value }, fieldState: { error } }) => {
                    return (
                      <DatePicker
                        disableFuture
                        label="종료일자(생성일)"
                        error={!!error}
                        helperText={error?.message}
                        /** @todo Timestamp로 변환하는 방식을 공통 컴포넌트 기준으로 처리하기 */
                        onChange={(value: Date) => handleChange(new Date(value).getTime())}
                        value={value}
                      />
                    );
                  }}
                />
              </Grid>
              {/* 기간검색 단축 버튼 */}
              <Grid container item md={3} xs={6} alignItems="center">
                <ButtonGroup fullWidth>
                  <Button children="전체" onClick={handleSelectDateRange()} />
                  <Button children="오늘" onClick={handleSelectDateRange(0)} />
                  <Button children="3일" onClick={handleSelectDateRange(3)} />
                  <Button children="7일" onClick={handleSelectDateRange(7)} />
                  <Button children="14일" onClick={handleSelectDateRange(14)} />
                </ButtonGroup>
              </Grid>
              <Grid item md={3} xs={6}></Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions
            sx={{
              justifyContent: 'flex-end',
              my: 2,
              px: 2,
            }}
          >
            <Button
              children="조회"
              startIcon={<SearchIcon fontSize="small" />}
              size="large"
              type="submit"
              variant="contained"
            />
            <Button
              children="초기화"
              startIcon={<RotateLeftSharpIcon fontSize="small" />}
              size="large"
              type="button"
              variant="outlined"
              onClick={handleReset}
            />
          </CardActions>
        </form>
      </Box>
    </Card>
  );
};
