import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { OrderExportTicketItemModel } from '@features/order/models';
import { ReturnTypeUseOrderExportTicketListService } from '@features/order/services';
import { Card, Box, CardHeader, Link } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  actions?: ReactNode;
  items: ReturnTypeUseOrderExportTicketListService['exportTicketList'];
  isLoading: ReturnTypeUseOrderExportTicketListService['isLoading'];
  pagination?: ReturnTypeUseOrderExportTicketListService['pagination'];
  rowSelection?: ReturnTypeUseOrderExportTicketListService['rowSelection'];
}

const columns: Array<TableColumnProps<OrderExportTicketItemModel>> = [
  { label: '출고번호', dataKey: 'id', align: 'center' },
  { label: '주문번호', dataKey: 'orderId', align: 'center' },
  {
    label: '티켓상품',
    dataKey: 'goodsName',
    align: 'center',
    render: (value, item) => {
      return <Link href={`/export/detail/${item.id}`}>{value}</Link>;
    },
  },
  {
    label: '옵션',
    dataKey: 'itemOptionList',
    align: 'center',
    render: (_value, item) => {
      return (
        <>
          {item.itemOptionList.map((option) => {
            return <Box key={option}>{option}</Box>;
          })}
        </>
      );
    },
  },
  { label: '수량', dataKey: 'quantity', align: 'center' },
  { label: '받는분', dataKey: 'recipientName', align: 'center' },
  { label: '받는분 연락처', dataKey: 'recipientPhone', align: 'center' },
  { label: '주문자', dataKey: 'ordererName', align: 'center' },
  { label: '구매일', dataKey: 'orderPaymentDateText', align: 'center' },
  {
    label: '유효기간',
    dataKey: 'usableStartDate',
    align: 'center',
    render: (_value, item) => {
      return `${item.usableStartDateText} ~ ${item.usableEndDateText}`;
    },
  },
  {
    label: '티켓상태',
    dataKey: 'exportTicketStatus.name',
    align: 'center',
    render: (value, item) => {
      return `${value}${item.isExpired ? `(기간만료)` : ''}`;
    },
  },
  {
    label: '반품상태',
    dataKey: 'returnStatusName',
    align: 'center',
    render: (value, item) => {
      if (!item.returnStatus) {
        return '-';
      }

      return <ReturnStatusStyled>{value}</ReturnStatusStyled>;
    },
  },
  { label: '사용일', dataKey: 'usedDateText', align: 'center' },
  { label: '투숙일', dataKey: 'bookingDateText', align: 'center' },
];

/**
 * 출고 리스트 component
 */
export const ExportTicketList = ({ actions, items, isLoading, pagination, rowSelection }: Props) => {
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
        />
      </Box>
    </Card>
  );
};

const ReturnStatusStyled = styled(Box)`
  color: #ff0000;
`;
