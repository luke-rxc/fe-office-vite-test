import { TableColumnProps, Table } from '@components/table/Table';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { MemberAddressModel } from '../models';

export interface MemberAddressListProps {
  items: MemberAddressModel[];
}

export const MemberAddressList = ({ items }: MemberAddressListProps) => {
  const columns: Array<TableColumnProps<MemberAddressModel>> = [
    {
      label: '기본배송지 유무',
      dataKey: 'isDefaultYn',
      align: 'center',
    },
    { label: '이름', dataKey: 'name', align: 'center' },
    { label: '연락처', dataKey: 'phone', align: 'center' },
    { label: '우편번호', dataKey: 'postCode', align: 'center' },
    { label: '주소', dataKey: 'address', align: 'center' },
    { label: '상세주소', dataKey: 'addressDetail', align: 'center' },
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
      <CardHeader title="배송지" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="id" pagination={false} minHeight="20px" />
      </CardContent>
    </Card>
  );
};
