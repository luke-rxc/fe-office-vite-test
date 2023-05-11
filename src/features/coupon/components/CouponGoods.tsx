import { Box, Button, Grid, InputAdornment } from '@material-ui/core';
import SearchIcon from '@assets/icons/Search';
import { Table, TableProps } from '@components/table/Table';
import { GoodsModel } from '../models';
import { CouponFormProps, SearchGoodsFormField } from '../types';
import { FormProvider } from 'react-hook-form';
import { CouponGoodsSearchType, CouponGoodsSearchTypeLabel } from '../constants';
import { FormControlSelect, FormControlTextField } from '@components/form';

interface Props {
  form: Omit<CouponFormProps<SearchGoodsFormField>, 'handleReset'>;
  tableProps: Omit<TableProps<GoodsModel>, 'rowKey'>;
  handleAddSelectItem: () => void;
}

const searchTypeOption = Object.keys(CouponGoodsSearchType).map((key) => {
  return {
    label: CouponGoodsSearchTypeLabel[key],
    value: CouponGoodsSearchType[key],
  };
});

export const CouponGoods = ({ form: { formMethod, handleSubmit }, tableProps, handleAddSelectItem }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormProvider {...formMethod}>
        <Grid container justifyContent="flex-end">
          <FormControlSelect<SearchGoodsFormField>
            name="searchType"
            size="small"
            options={searchTypeOption}
            sx={{ width: '100px' }}
          />
          <FormControlTextField<SearchGoodsFormField>
            name="value"
            size="small"
            sx={{ width: '280px', marginLeft: '10px' }}
            rules={{ required: '' }}
            placeholder="상품명 또는 코드검색"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: '10px' }}>
            검색
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ marginLeft: '10px' }}
            disabled={tableProps.rowSelection?.selectedRowKeys.length === 0}
            onClick={handleAddSelectItem}
          >
            선택항목 추가
          </Button>
        </Grid>
        <Box sx={{ mt: '20px' }}>
          <Table {...tableProps} rowKey="id" />
        </Box>
      </FormProvider>
    </form>
  );
};
