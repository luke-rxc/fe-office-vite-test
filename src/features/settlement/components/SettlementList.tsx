import React from 'react';
import { Card, Button, Link } from '@material-ui/core';
import { Table } from '@components/table/Table';
import { Row, SettlementListItem } from '../types';

/** 정산 목록 Props Type */
export interface SettlementListProps {
  page: number;
  size: number;
  total: number;
  isLoading: boolean;
  items: SettlementListItem[];
  onChangePage: (page: number, size: number) => void;
  /** 정산 요청 */
  onSettlement: (item: SettlementListItem) => void;
}

/** 정산 목록 */
export const SettlementList: React.FC<SettlementListProps> = ({
  page,
  size: limit,
  total,
  isLoading,
  items,
  onChangePage: onChange,
  onSettlement,
}) => {
  const rowFormat = React.useMemo<Row<SettlementListItem>>(
    () => [
      {
        label: '정산회차',
        align: 'center',
        dataKey: 'yearMonth',
      },
      {
        label: '정산 대상 기간',
        align: 'center',
        dataKey: 'range',
      },
      {
        label: '정산 완료',
        align: 'center',
        dataKey: 'isComplete',
        render: (isComplete, { completeCount, url }) =>
          isComplete ? <Link href={url} children={completeCount} /> : completeCount,
      },
      {
        label: '정산금 지급완료',
        align: 'center',
        dataKey: 'paidCount',
      },
      {
        label: '세금계산서 발행완료',
        align: 'center',
        dataKey: 'taxBillCount',
      },
      {
        label: '정산 대상',
        align: 'center',
        dataKey: 'totalCount',
      },
      {
        label: '관리',
        align: 'center',
        dataKey: 'isRunnable',
        render: (isRunnable, item) =>
          isRunnable && (
            <Button size="small" variant="contained" children="정산처리" onClick={() => onSettlement(item)} />
          ),
      },
    ],
    [onSettlement],
  );

  return (
    <Card sx={{ backgroundColor: 'background.paper', minHeight: '200px', px: 2, pt: 3, mt: 4 }}>
      <Table
        rowKey="yearMonth"
        items={items}
        columns={rowFormat}
        isLoading={isLoading}
        pagination={{ page, limit, total, onChange }}
      />
    </Card>
  );
};
