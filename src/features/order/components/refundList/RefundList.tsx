import { Table, TableColumnProps } from '@components/table/Table';
import { OrderRefundListItemModel } from '@features/order/models';
import { ReturnTypeUseOrderRefundListService } from '@features/order/services';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  actions?: ReactNode;
  items: ReturnTypeUseOrderRefundListService['refundList'];
  isLoading: ReturnTypeUseOrderRefundListService['isLoading'];
  pagination?: ReturnTypeUseOrderRefundListService['pagination'];
  rowSelection?: ReturnTypeUseOrderRefundListService['rowSelection'];
}

const columns: Array<TableColumnProps<OrderRefundListItemModel>> = [
  { label: '환불접수일시', dataKey: 'createdDateText', align: 'center' },
  { label: '주문번호', dataKey: 'orderId', align: 'center' },
  {
    label: '환불상품',
    dataKey: 'goodsName',
    align: 'center',
    render: (value, { id }) => {
      return <Link href={`/refund/detail/${id}`}>{value}</Link>;
    },
  },
  { label: '결제', dataKey: 'paymentType.name', align: 'center' },
  { label: '수량', dataKey: 'quantity', align: 'center' },
  { label: '환불종류', dataKey: 'type.name', align: 'center' },
  { label: '환불방법', dataKey: 'refundMethod.name', align: 'center' },
  {
    label: '환불금액',
    dataKey: 'refundPriceText',
    align: 'center',
    render: (value) => (!!value ? value : '-'),
  },
  { label: '주문자', dataKey: 'ordererName', align: 'center' },
  { label: '환불상태', dataKey: 'status.name', align: 'center' },
  { label: '처리일시', dataKey: 'completedDateText', align: 'center', render: (value) => (!!value ? value : '-') },
];

/**
 * 환불 리스트 component
 */
export const RefundList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
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
          rowKey="id"
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Box>
    </Card>
  );
};
