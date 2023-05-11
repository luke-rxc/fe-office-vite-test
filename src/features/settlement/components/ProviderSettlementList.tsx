/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Card, CardActions, Button } from '@material-ui/core';
import { Table } from '@components/table/Table';
import { toKRW } from '../utils';
import { Row, ProviderSettlementListItem } from '../types';

/** 입점사별 정산 목록 Props Type */
export interface ProviderSettlementListProps {
  page: number;
  size: number;
  total: number;
  isLoading: boolean;
  isManager: boolean;
  items: ProviderSettlementListItem[];
  checkedItemsIds: number[];
  onChangePage: (page: number, size: number) => void;
  /** 테이블 체크박스 클릭 이벤트 */
  onChangeCheckbox?: (selectedRowKeys: number[]) => void;
  /** 재정산 요청 이벤트 */
  onResettlement?: (item: ProviderSettlementListItem) => void;
  /** 상세 다운로드 이벤트 */
  onDetailExport?: (item: ProviderSettlementListItem) => void;
  /** 전체다운로드 이벤트 */
  onAllExport?: () => void;
  /** 정산금 지급 이벤트 */
  onPaid?: (ids: ThisType<'checkedItemsIds'>) => void;
  /** 세금계산서 발행 이벤트 */
  onTaxBillPublished?: (ids: ThisType<'checkedItemsIds'>) => void;
}

/** 입점사별 정산 목록 */
export const ProviderSettlementList: React.FC<ProviderSettlementListProps> = ({
  page,
  size: limit,
  total,
  isLoading,
  isManager,
  items,
  checkedItemsIds,
  onChangePage: onChange,
  onChangeCheckbox,
  onResettlement,
  onDetailExport,
  onAllExport,
  onPaid,
  onTaxBillPublished,
}) => {
  const rowFormat = React.useMemo<Row<ProviderSettlementListItem>>(
    () => [
      {
        dataKey: 'yyyyMm',
        label: '정산회차',
        align: 'center',
      },
      {
        dataKey: 'providerName',
        label: '입점사명',
        align: 'center',
        hide: !isManager,
      },
      {
        dataKey: 'status',
        label: '상태',
        align: 'center',
      },
      {
        dataKey: 'range',
        label: '정산대상기간',
        align: 'center',
      },
      {
        dataKey: 'price',
        label: '판매금액',
        align: 'center',
        render: (_, { price }) => toKRW(price),
      },
      {
        dataKey: 'commissionPrice',
        label: '수수료',
        align: 'center',
        render: (_, { commissionPrice }) => toKRW(commissionPrice),
      },
      {
        dataKey: 'salesCostManagerCoupon',
        label: '프리즘부담 쿠폰액',
        align: 'center',
        render: (_, { salesCostManagerCoupon }) => toKRW(salesCostManagerCoupon),
      },
      {
        dataKey: 'salesCostProviderCoupon',
        label: '파트너부담 쿠폰액',
        align: 'center',
        render: (_, { salesCostProviderCoupon }) => toKRW(salesCostProviderCoupon),
      },
      {
        dataKey: 'point',
        label: '프리즘부담 적립금',
        align: 'center',
        render: (_, { point }) => toKRW(point),
      },
      {
        dataKey: 'shippingCost',
        label: '배송비',
        align: 'center',
        render: (_, { shippingCost }) => toKRW(shippingCost),
      },
      {
        dataKey: 'returnShippingCost',
        label: '반품/교환 배송비',
        align: 'center',
        render: (_, { returnShippingCost }) => toKRW(returnShippingCost),
      },
      {
        dataKey: 'returnPrice',
        label: '환불 금액',
        align: 'center',
        render: (_, { returnPrice }) => toKRW(returnPrice),
      },
      {
        dataKey: 'settlementPrice',
        label: '정산금액',
        align: 'center',
        render: (_, { settlementPrice }) => toKRW(settlementPrice),
      },
      {
        dataKey: 'isPaid',
        label: '정산금 지급상태',
        align: 'center',
      },
      {
        dataKey: 'isTaxBillPublished',
        label: '세금계산서 발행상태',
        align: 'center',
      },
      {
        dataKey: 'downloadable',
        label: '상세다운로드',
        align: 'center',
        render: (_, { downloadable, ...rest }) =>
          downloadable && (
            <Button
              size="small"
              variant="outlined"
              children="다운로드"
              onClick={() => onDetailExport({ downloadable, ...rest })}
            />
          ),
      },
      {
        dataKey: 'reExecutable',
        label: '관리',
        align: 'center',
        hide: !isManager,
        render: (_, { reExecutable, ...rest }) =>
          reExecutable && (
            <Button
              size="small"
              variant="contained"
              children="재정산"
              onClick={() => onResettlement({ reExecutable, ...rest })}
            />
          ),
      },
    ],
    [],
  );

  return (
    <Card sx={{ backgroundColor: 'background.paper', minHeight: '200px', px: 2, pt: 2, mt: 4 }}>
      <CardActions sx={{ justifyContent: 'right', mb: 2, mx: -1 }}>
        {isManager && (
          <Button
            variant="contained"
            children="정산금 지급"
            onClick={() => onPaid(checkedItemsIds)}
            disabled={!checkedItemsIds.length}
          />
        )}
        {isManager && (
          <Button
            variant="contained"
            children="세금계산서 발행"
            onClick={() => onTaxBillPublished(checkedItemsIds)}
            disabled={!checkedItemsIds.length}
          />
        )}
        <Button variant="outlined" children="전체 다운로드" disabled={!items.length} onClick={onAllExport} />
      </CardActions>
      <Table
        rowKey="id"
        items={items}
        columns={rowFormat}
        isLoading={isLoading}
        pagination={{ page, limit, total, onChange }}
        rowSelection={isManager && { selectedRowKeys: checkedItemsIds, onChange: onChangeCheckbox }}
      />
    </Card>
  );
};
