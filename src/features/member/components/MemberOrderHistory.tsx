import { Table, TableColumnProps, PaginationProps } from '@components/table/Table';
import { Card, CardContent, CardHeader, Link } from '@material-ui/core';
import { MemberOrderModel } from '../models';

interface MemberOrderHistoryProps {
  items: MemberOrderModel[];
  pagination?: PaginationProps;
}

export const MemberOrderHistory = ({ items, pagination }: MemberOrderHistoryProps) => {
  const columns: Array<TableColumnProps<MemberOrderModel>> = [
    {
      label: '주문번호',
      dataKey: 'orderId',
      align: 'center',
      render: (orderId) => {
        return (
          <Link href={`/order/detail/${orderId}`} target="_blank">
            {orderId}
          </Link>
        );
      },
    },
    { label: '주문일', dataKey: 'createdDateText', align: 'center' },
    { label: '상품', dataKey: 'goodsName', align: 'center' },
    { label: '받는분', dataKey: 'recipientName', align: 'center' },
    { label: '결제수단', dataKey: 'paymentTypeText', align: 'center' },
    { label: '결제금액', dataKey: 'amountText', align: 'center' },
    { label: '상태', dataKey: 'orderStatusText', align: 'center' },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <CardHeader title="주문 내역" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="orderId" pagination={pagination} minHeight="20px" />
      </CardContent>
    </Card>
  );
};
