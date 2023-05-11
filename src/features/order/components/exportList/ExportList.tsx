import { Table, TableColumnProps } from '@components/table/Table';
import { OrderExportListItemModel } from '@features/order/models';
import { ReturnTypeUseOrderExportListService } from '@features/order/services';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  actions?: ReactNode;
  items: ReturnTypeUseOrderExportListService['exportList'];
  isLoading: ReturnTypeUseOrderExportListService['isLoading'];
  pagination?: ReturnTypeUseOrderExportListService['pagination'];
  rowSelection?: ReturnTypeUseOrderExportListService['rowSelection'];
}

const columns: Array<TableColumnProps<OrderExportListItemModel>> = [
  { label: '출고번호', dataKey: 'id', align: 'center' },
  { label: '주문번호', dataKey: 'orderId', align: 'center' },
  {
    label: '상품명',
    dataKey: 'goodsName',
    align: 'center',
    render: (value, item) => {
      return <Link href={`/export/detail/${item.id}`}>{value}</Link>;
    },
  },
  { label: '수량/종', dataKey: 'quantity', align: 'center' },
  { label: '받는분/주문자', dataKey: 'recipientName', align: 'center' },
  { label: '배송', dataKey: 'deliveryCompany', align: 'center' },
  { label: '운송장번호', dataKey: 'deliveryNumber', align: 'center' },
  { label: '출고일', dataKey: 'exportedDateText', align: 'center' },
  { label: '배송시작일', dataKey: 'inShippingDateText', align: 'center' },
  { label: '배송종료일', dataKey: 'completeDateText', align: 'center' },
  { label: '구매확정일', dataKey: 'confirmDateText', align: 'center' },
  { label: '출고상태', dataKey: 'exportStatus.name', align: 'center' },
];

/**
 * 출고 리스트 component
 */
export const ExportList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
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
