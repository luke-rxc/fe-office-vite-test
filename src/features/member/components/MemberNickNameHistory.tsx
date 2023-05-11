import { Table, TableColumnProps, PaginationProps } from '@components/table/Table';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { MemberNickNameModel } from '../models';

interface MemberNickNameProps {
  items: MemberNickNameModel[];
  pagination?: PaginationProps;
}

export const MemberNickNameHistory = ({ items, pagination }: MemberNickNameProps) => {
  const columns: Array<TableColumnProps<MemberNickNameModel>> = [
    {
      label: '날짜',
      dataKey: 'createdDateText',
      align: 'center',
    },
    { label: '닉네임', dataKey: 'nickName', align: 'center' },
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
      <CardHeader title="닉네임 변경 이력" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="createdDate" pagination={pagination} minHeight="20px" />
      </CardContent>
    </Card>
  );
};
