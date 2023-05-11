import React from 'react';
import { Box, Link, TextField } from '@material-ui/core';
import { PaginationProps, Table, TableColumnProps } from '@components/table/Table';
import { SaleRequestRejectListModel } from '../../models';

interface Props {
  isLoading: boolean;
  searchLists: SaleRequestRejectListModel[];
  pagination: PaginationProps;
}

export const SaleRequestRejectList: React.FC<Props> = ({ isLoading, searchLists, pagination }) => {
  const tableColumns: Array<TableColumnProps<SaleRequestRejectListModel>> = [
    {
      label: '상품 ID',
      dataKey: 'goodsId',
      align: 'center',
    },
    {
      label: '브랜드',
      dataKey: 'brandName',
      align: 'center',
    },
    {
      label: '상품명',
      dataKey: 'goodsName',
      align: 'center',
      render: (value, { goodsId }) => {
        return (
          <Link href={`/goods/${goodsId}`} target="_blank">
            {value}
          </Link>
        );
      },
    },
    {
      label: '반려유형',
      dataKey: 'responseStatus',
      align: 'center',
    },
    {
      label: '반려사유',
      dataKey: 'responseMemo',
      align: 'center',
      width: '400px',
      render: (value) => {
        return <TextField fullWidth multiline variant="outlined" value={value} inputProps={{ readOnly: true }} />;
      },
    },
    {
      label: '반려처리일',
      dataKey: 'responseDate',
      align: 'center',
    },
  ];

  return (
    <Box>
      <Table
        columns={tableColumns}
        items={searchLists}
        rowKey="requestId"
        isLoading={isLoading}
        pagination={pagination}
      />
    </Box>
  );
};
