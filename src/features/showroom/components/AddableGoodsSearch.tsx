import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Info } from '@material-ui/icons/';
import { Button, Grid } from '@material-ui/core';
import { FormControlTextField, FormControlSelect, FormControlCheckbox } from '@components/form';
import { GoodsSearchFields as Fields, GoodsSearchFieldOptions } from '../types';
import { FormControlAutoComplete } from './form';
import { Tooltip } from './base';

export interface AddableGoodsSearchProps {
  formMethods: UseFormReturn<Fields>;
  formOptions: GoodsSearchFieldOptions;
  /** 초기화 액션 */
  onReset: () => void;
  /** 검색 액션 */
  onSearch: () => void;
}

/**
 * 추가 가능한 상품 검색폼 컴포넌트
 */
export const AddableGoodsSearch: React.FC<AddableGoodsSearchProps> = ({
  formMethods,
  formOptions: { searchType, provider, brand, status },
  onReset: handleReset,
  onSearch: handleSearch,
}) => {
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSearch}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            {/* prettier-ignore */}
            <FormControlSelect<Fields> 
              name="searchType" 
              label="검색조건" 
              options={searchType} 
            />
          </Grid>

          <Grid item md={6} xs={12}>
            {/* prettier-ignore */}
            <FormControlTextField<Fields>
              fullWidth
              triggerPressEnterSubmit
              name="keyword"
              label="검색어" 
              placeholder="검색어를 입력하세요"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            {/* prettier-ignore */}
            <FormControlSelect<Fields>
              name="status"
              label="상품상태"
              options={status}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControlAutoComplete<Fields>
              name="provider"
              label="입점사"
              placeholder="입점사명을 선택하세요"
              InputLabelProps={{ shrink: true }}
              options={provider}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControlAutoComplete<Fields>
              name="brand"
              label="브랜드"
              placeholder="브랜드를 선택하세요"
              noOptionsText="선택 가능한 브랜드가 없습니다"
              InputLabelProps={{ shrink: true }}
              options={brand}
            />
          </Grid>

          <Grid item container md={6} xs={12} justifyContent="space-between" alignItems="center">
            <Grid item display="inline-flex" alignItems="center">
              <FormControlCheckbox<Fields> name="myBrand" label="나의 브랜드 상품 조회" />
              <Tooltip title="나의 쇼룸과 연결된 브랜드의 등록된 전시/판매가능 상품이 모두 조회 됩니다.">
                <Info fontSize="small" color="disabled" sx={{ ml: -1 }} />
              </Tooltip>
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
