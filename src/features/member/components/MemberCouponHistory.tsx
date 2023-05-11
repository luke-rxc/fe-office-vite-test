import { Table, TableColumnProps, PaginationProps } from '@components/table/Table';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { MemberCouponModel } from '../models';

interface MemberCouponHistoryProps {
  items: MemberCouponModel[];
  pagination?: PaginationProps;
}

export const MemberCouponHistory = ({ items, pagination }: MemberCouponHistoryProps) => {
  const columns: Array<TableColumnProps<MemberCouponModel>> = [
    {
      label: '쿠폰명',
      dataKey: 'name',
      align: 'center',
    },
    { label: '쿠폰타입', dataKey: 'useType', align: 'center' },
    { label: '할인', dataKey: 'saleText', align: 'center' },
    { label: '유효기한', dataKey: 'rangeDateText', align: 'center' },
    { label: '상태', dataKey: 'status', align: 'center' },
    { label: '사용일', dataKey: 'usedDateText', align: 'center' },
    { label: '제한정책', dataKey: 'policyText', align: 'center' },
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
      <CardHeader title="쿠폰 내역" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="id" pagination={pagination} minHeight="20px" />
      </CardContent>
    </Card>
  );
};
