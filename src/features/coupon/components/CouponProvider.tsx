import { Box, Button, Grid, InputAdornment } from '@material-ui/core';
import SearchIcon from '@assets/icons/Search';
import { Table, TableProps } from '@components/table/Table';
import { ProviderModel } from '../models';
import { CouponFormProps, SearchFormField } from '../types';
import { FormProvider } from 'react-hook-form';
import { FormControlTextField } from '@components/form';

interface Props {
  form: Omit<CouponFormProps<SearchFormField>, 'handleReset'>;
  tableProps: Omit<TableProps<ProviderModel>, 'rowKey'>;
  onAddSelectItem: () => void;
}

export const CouponProvider = ({
  form: { formMethod, handleSubmit },
  tableProps,
  onAddSelectItem: handleAddSelectItem,
}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormProvider {...formMethod}>
        <Grid container justifyContent="flex-end">
          <FormControlTextField<SearchFormField>
            name="keyword"
            size="small"
            sx={{ width: '280px' }}
            rules={{ required: '' }}
            placeholder="입점사명 검색"
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
            disabled={tableProps.rowSelection.selectedRowKeys.length === 0}
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
