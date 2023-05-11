import { Table, TableProps } from '@components/table/Table';
import { Box } from '@material-ui/core';
import { GoodsModel } from '../models/GoodsModel';

interface Props {
  tableProps: Omit<TableProps<GoodsModel>, 'rowKey'>;
}

export const ShowtimeGoodsList = ({ tableProps }: Props) => {
  return (
    <Box sx={{ mt: '20px', minHeight: '500px' }}>
      <Table {...tableProps} rowKey="id" />
    </Box>
  );
};
