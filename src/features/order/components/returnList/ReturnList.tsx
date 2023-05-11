import { Table, TableColumnProps } from '@components/table/Table';
import { OrderReturnListItemModel } from '@features/order/models';
import { ReturnTypeUseOrderReturnListService } from '@features/order/services';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  actions?: ReactNode;
  items: ReturnTypeUseOrderReturnListService['returnList'];
  isLoading: ReturnTypeUseOrderReturnListService['isLoading'];
  pagination?: ReturnTypeUseOrderReturnListService['pagination'];
  rowSelection?: ReturnTypeUseOrderReturnListService['rowSelection'];
}

const columns: Array<TableColumnProps<OrderReturnListItemModel>> = [
  { label: '반품접수일시', dataKey: 'createdDateText', align: 'center' },
  {
    label: '주문번호',
    dataKey: 'orderId',
    align: 'center',
    render: (orderId, { id: returnId }) => {
      return <Link href={`/return/detail/${returnId}`}>{orderId}</Link>;
    },
  },
  { label: '반품상품', dataKey: 'goodsName', align: 'left' },
  { label: '수량', dataKey: 'quantity', align: 'center' },
  { label: '결제', dataKey: 'paymentType.name', align: 'center' },
  { label: '반품종류', dataKey: 'type.name', align: 'center' },
  { label: '주문자', dataKey: 'ordererName', align: 'center' },
  {
    label: '회수상태',
    dataKey: 'returnAutomationStatus',
    align: 'center',
    render: (_, item) => {
      return item.returnAutomationStatus ? item.returnAutomationStatus.name : '';
    },
  },
  { label: '반품상태', dataKey: 'status.name', align: 'center' },
  { label: '처리일시', dataKey: 'completedDateText', align: 'center' },
];

/**
 * 반품 리스트 component
 */
export const ReturnList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
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
