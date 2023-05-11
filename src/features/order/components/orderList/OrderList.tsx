import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import { OrderModel } from '@features/order/models';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  actions?: ReactNode;
  items: Array<OrderModel>;
  isLoading: boolean;
  pagination?: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
}

const columns: Array<TableColumnProps<OrderModel>> = [
  { label: '주문일', dataKey: 'createdDateText', align: 'center' },
  {
    label: '주문번호',
    dataKey: 'orderId',
    align: 'center',
    render: (orderId) => {
      return <Link href={`/order/detail/${orderId}`}>{orderId}</Link>;
    },
  },
  { label: '주문상품', dataKey: 'goodsName', align: 'left' },
  { label: '수량', dataKey: 'quantity', align: 'center' },
  {
    label: '받는분/주문자',
    dataKey: 'recipientName',
    align: 'center',
    render: (value, item) => {
      return `${value} / ${item.ordererName}`;
    },
  },
  { label: '결제', dataKey: 'paymentType.name', align: 'center' },
  { label: '처리상태', dataKey: 'orderStatus.name', align: 'center' },
];

const rowsPerPageOptions = [10, 25, 50, 100, 500, 1000];

/**
 * 주문 리스트 component
 */
export const OrderList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <CardHeader action={actions} />
      <Box>
        <Table
          columns={columns}
          items={items}
          rowKey="rowKey"
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    </Card>
  );
};
