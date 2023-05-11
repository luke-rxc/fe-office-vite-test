import React, { useState } from 'react';
import type { VFC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import { Link } from '@material-ui/core';
import { Table, TableColumnProps } from '@components/table/Table';
import { SortOrderType } from '@constants/table';
import { ProviderBrandModel, ProviderListModel } from '../models';

const useStyles = makeStyles(() => ({
  table: {
    '& table': {
      minWidth: 'initial',
    },
  },
}));

const columns: TableColumnProps<ProviderListModel>[] = [
  {
    label: '입점사 ID',
    dataKey: 'id',
    width: '5%',
  },
  {
    label: '입점사명',
    dataKey: 'name',
    width: '25%',
    render: (value: string, item: ProviderListModel) => {
      return <Link href={`/provider/${item.id}`}>{item.name}</Link>;
    },
  },
  {
    label: '브랜드',
    dataKey: 'brandName',
    width: '24%',
    render: (value: string, item: ProviderListModel) => {
      const brands = item.brands;
      return brands.map((brand: ProviderBrandModel) => {
        return (
          <React.Fragment key={brand.id}>
            {brand.name}
            &nbsp;&nbsp;
          </React.Fragment>
        );
      });
    },
  },
  {
    label: '입점일자',
    dataKey: 'createdDate',
    useSort: true,
    width: '15%',
    align: 'center',
  },
  {
    label: '사업자유형',
    dataKey: 'businessType',
    width: '14%',
    align: 'center',
  },
  {
    label: '수수료(%)',
    dataKey: 'commissionRate',
    width: '7%',
    align: 'center',
  },
  {
    label: '정산방식',
    dataKey: 'calculate',
    width: '10%',
    align: 'center',
  },
];

interface ProviderListProps {
  providerList: ProviderListModel[];
  totalCount: number;
  page: number;
  limit: number;
  orderType: SortOrderType;
  selectedRowKeys: number[];
  isLoading: boolean;
  onUpdateSelectedKeyList: (list: number[]) => void;
  onChangeSort: (orderKey: string, orderType: SortOrderType) => void;
  onChangePaging: (page: number, limit: number) => void;
}
export const ProviderList: VFC<ProviderListProps> = ({
  providerList,
  totalCount,
  page,
  limit,
  orderType,
  selectedRowKeys,
  isLoading,
  onUpdateSelectedKeyList,
  onChangeSort,
  onChangePaging,
}) => {
  const classes: ClassNameMap = useStyles();
  const [sortValue, setSortValue] = useState<{ orderType: SortOrderType; orderKey: string }>({
    orderType,
    orderKey: 'createdDate',
  });
  const handleSort = (orderKey: string, orderType: SortOrderType) => {
    setSortValue({ orderKey, orderType });
    onChangeSort(orderKey, orderType);
  };

  return (
    <div className={classes.table}>
      <Table
        isLoading={isLoading}
        columns={columns}
        items={providerList}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: onUpdateSelectedKeyList,
        }}
        sort={{
          orderType: sortValue.orderType,
          orderKey: sortValue.orderKey,
          handleSort,
        }}
        pagination={{
          page,
          limit,
          total: totalCount,
          onChange: onChangePaging,
        }}
      ></Table>
    </div>
  );
};
