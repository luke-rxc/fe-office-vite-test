import React from 'react';
import { Card, Link } from '@material-ui/core';
import { Table, TableProps, TableColumnProps } from '@components/table/Table';
import { BrandModel } from '../models';

interface BrandListProps extends Omit<TableProps<BrandModel>, 'columns'> {
  onManageClick: (item: BrandModel) => void;
}

export const BrandList = ({
  items,
  isLoading,
  pagination,
  rowKey,
  sort,
  onManageClick: handleManageClick,
}: BrandListProps) => {
  const columns: Array<TableColumnProps<BrandModel>> = [
    {
      label: '브랜드 ID',
      dataKey: 'id',
      width: '10%',
      align: 'center',
      useSort: true,
    },
    {
      label: '브랜드명(메인)',
      dataKey: 'name',
      width: '15%',
      align: 'center',
      useSort: true,
      render: (value, item) => (value ? <Link href={`/brands/${item.id}`}>{value}</Link> : value),
    },
    {
      label: '브랜드명(서브)',
      dataKey: 'subName',
      width: '15%',
      align: 'center',
      useSort: true,
    },
    {
      label: '입점사명',
      dataKey: 'providerName',
      width: '15%',
      align: 'center',
      useSort: true,
      /** @todo 차후 입점사 페이지 연결시 사용 */
      // render: (value, item) => <Link href={`/provider/${item.providerId || 1}`}>{value}</Link>,
    },
    {
      label: '최초 생성일시',
      dataKey: 'createdDate',
      align: 'center',
      useSort: true,
    },
    {
      label: 'MD',
      dataKey: 'md',
      width: '12%',
      align: 'center',
      useSort: true,
    },
    {
      label: 'AM',
      dataKey: 'amd',
      width: '12%',
      align: 'center',
      useSort: true,
    },
  ];

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
        mt: 5,
      }}
    >
      <Table
        columns={columns}
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        rowKey={rowKey}
        sort={sort}
      />
    </Card>
  );
};
