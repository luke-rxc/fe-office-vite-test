import { PaginationProps, Table, TableColumnProps } from '@components/table/Table';
import { Card, Box } from '@material-ui/core';
import { ShowtimeContentsModel } from '../models';

interface Props {
  columns: Array<TableColumnProps<ShowtimeContentsModel>>;
  items: Array<ShowtimeContentsModel>;
  isLoading: boolean;
  pagination: PaginationProps;
}

export const ShowtimeContentList = ({ columns, items, isLoading, pagination }: Props) => {
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
        mt: 4,
      }}
    >
      <Box>
        <Table columns={columns} items={items} rowKey="id" isLoading={isLoading} pagination={pagination} />
      </Box>
    </Card>
  );
};
