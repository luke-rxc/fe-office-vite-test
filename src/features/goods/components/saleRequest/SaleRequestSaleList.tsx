import React from 'react';
import { Link, TextField, Button, Typography } from '@material-ui/core';
import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import { SaleRequestListModel } from '../../models';

interface Props {
  isLoading: boolean;
  searchLists: SaleRequestListModel[];
  pagination: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
  onOptionOpen: (requestId: number) => void;
}

export const SaleRequestSaleList: React.FC<Props> = ({
  isLoading,
  searchLists,
  pagination,
  rowSelection,
  onOptionOpen: handleOptionOpen,
}) => {
  const tableColumns: Array<TableColumnProps<SaleRequestListModel>> = [
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
      label: '썸네일',
      dataKey: 'primaryImagePath',
      align: 'center',
      render: (value) => {
        return (
          <Link href={value} target="_blank">
            보기
          </Link>
        );
      },
    },
    {
      label: '대표컨텐츠',
      dataKey: 'mainContents',
      align: 'center',
      render: (_, { goodsId }) => {
        return (
          <Link href={`/goods-content/main/${goodsId}`} target="_blank">
            보기
          </Link>
        );
      },
    },
    {
      label: '상세컨텐츠',
      dataKey: 'subContents',
      align: 'center',
      render: (_, { goodsId }) => {
        return (
          <Link href={`/goods-content/detail/${goodsId}`} target="_blank">
            보기
          </Link>
        );
      },
    },
    {
      label: '상품설명',
      dataKey: 'description',
      align: 'center',
      width: '400px',
      render: (value) => {
        return (
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={value}
            sx={{ mt: 1 }}
            inputProps={{ readOnly: true }}
          />
        );
      },
    },
    {
      label: '전시시작일',
      dataKey: 'displayStartDateText',
      align: 'center',
    },
    {
      label: '판매시작일/종료일',
      dataKey: 'saleDate',
      align: 'center',
      width: '200px',
      render: (_, { saleStartDateText, saleEndDateText }) => {
        return (
          <>
            <Typography variant="body2">{saleStartDateText}</Typography>
            <Typography variant="body2">{saleEndDateText}</Typography>
          </>
        );
      },
    },
    {
      label: '1인 최대구매수량',
      dataKey: 'userMaxPurchaseText',
      align: 'center',
    },
    {
      label: '옵션',
      dataKey: 'option',
      align: 'center',
      render: (_, { requestId }) => {
        return (
          <Button
            onClick={() => {
              handleOptionOpen(requestId);
            }}
          >
            상세보기
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      columns={tableColumns}
      items={searchLists}
      rowKey="requestId"
      isLoading={isLoading}
      pagination={pagination}
      rowSelection={rowSelection}
    />
  );
};
