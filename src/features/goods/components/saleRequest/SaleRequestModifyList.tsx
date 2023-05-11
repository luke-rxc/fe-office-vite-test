import React from 'react';
import { Link, Typography, TextField, Button } from '@material-ui/core';
import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import { SaleRequestModifyListModel } from '../../models';

interface Props {
  isLoading: boolean;
  searchLists: SaleRequestModifyListModel[];
  pagination: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
  onOptionOpen: (requestId: number) => void;
}

export const SaleRequestModifyList: React.FC<Props> = ({
  isLoading,
  searchLists,
  pagination,
  rowSelection,
  onOptionOpen: handleOptionOpen,
}) => {
  const tableColumns: Array<TableColumnProps<SaleRequestModifyListModel>> = [
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
      label: '판매상태',
      dataKey: 'goodsStatus',
      align: 'center',
    },
    {
      label: '판매시작일/종료일',
      dataKey: 'saleDate',
      align: 'center',
      width: '200px',
      render: (_, { fromStartDate, fromEndDate, toStartDate, toEndDate, isChangeFromSaleDate, isChangeToSaleDate }) => {
        const changeTypoProps = {
          color: 'secondary',
          fontWeight: 'bold',
        };
        const startDateProps = isChangeFromSaleDate ? changeTypoProps : {};
        const endDateProps = isChangeToSaleDate ? changeTypoProps : {};
        return (
          <>
            <Typography variant="body2">{fromStartDate}</Typography>
            <Typography variant="body2">{fromEndDate}</Typography>
            <br />
            ▽
            <br />
            <Typography variant="body2" {...startDateProps}>
              {toStartDate}
            </Typography>
            <Typography variant="body2" {...endDateProps}>
              {toEndDate}
            </Typography>
          </>
        );
      },
    },
    {
      label: '1인 최대구매수량',
      dataKey: 'purchaseEa',
      align: 'center',
      render: (_, { fromUserMaxEaText, toUserMaxEaText, isChangeUserMaxEa }) => {
        const changeTypoProps = {
          color: 'secondary',
          fontWeight: 'bold',
        };
        const toUserMaxEaProps = isChangeUserMaxEa ? changeTypoProps : {};
        return (
          <>
            <span>{fromUserMaxEaText}</span>
            <br />
            ▽
            <br />
            <Typography variant="body2" {...toUserMaxEaProps}>
              {toUserMaxEaText}
            </Typography>
          </>
        );
      },
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
    {
      label: '수정 요청 사유',
      dataKey: 'reason',
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
