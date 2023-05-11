import styled from '@emotion/styled';
import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';
import { MemberModel } from '../models';

interface Props {
  actions?: ReactNode;
  items: MemberModel[];
  isLoading: boolean;
  pagination?: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
}

const columns: Array<TableColumnProps<MemberModel>> = [
  { label: '사용자 ID', dataKey: 'id', align: 'center' },
  {
    label: '이메일',
    dataKey: 'email',
    align: 'center',
    render: (email, { id }) => {
      return (
        <Link href={`/member/${id}`}>
          <CellStyled>{email}</CellStyled>
        </Link>
      );
    },
  },
  { label: '닉네임', dataKey: 'nickName', align: 'center' },
  { label: '이름', dataKey: 'name', align: 'center' },
  {
    label: '연락처',
    dataKey: 'phone',
    align: 'center',
  },
  { label: '휴대폰 인증여부', dataKey: 'isIdentifyText', align: 'center' },
  { label: '성인인증여부', dataKey: 'isAdultText', align: 'center' },
  { label: '소셜가입', dataKey: 'ssoConnect', align: 'center' },
  { label: '상태', dataKey: 'statusText', align: 'center' },
  { label: '가입일', dataKey: 'createdDateText', align: 'center' },
  { label: '최종방문일', dataKey: 'lastLoginDateText', align: 'center' },
];

const rowsPerPageOptions = [10, 25, 50, 100, 500, 1000];

/**
 * 주문 리스트 component
 */
export const MemberList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
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
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    </Card>
  );
};

const CellStyled = styled.span`
  word-break: break-all;
`;
