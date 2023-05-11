import { Table, TableColumnProps } from '@components/table/Table';
import { ReturnTypeUseOrderExportBulkBookingDateService } from '@features/order/services';
import { OrderExportStatusChangeResponse } from '@features/order/types';
import { Box, Typography, Chip } from '@material-ui/core';

interface Props {
  orderExportTicketBulkBookingDateSummary: ReturnTypeUseOrderExportBulkBookingDateService['orderExportTicketBulkBookingDateSummary'];
}

const columns: Array<TableColumnProps<OrderExportStatusChangeResponse>> = [
  {
    label: '처리결과',
    dataKey: 'success',
    align: 'center',
    render: (_, { success }) => {
      return <Chip label={success ? '성공' : '실패'} color={success ? 'primary' : 'secondary'} variant="outlined" />;
    },
  },
  {
    label: '출고번호',
    dataKey: 'exportId',
    width: '150px',
    align: 'center',
  },
  {
    label: '주문번호',
    dataKey: 'orderId',
    width: '150px',
    align: 'center',
  },
  {
    label: '투숙일',
    dataKey: 'bookingDate',
    width: '150px',
    align: 'center',
  },
  {
    label: '에러메세지',
    dataKey: 'message',
    align: 'left',
    render: (text) => {
      if (!text) {
        return '-';
      }
      return text;
    },
  },
];

/**
 * 출고(티켓) 상태변경 결과 component
 */
export const ExportTicketBulkBookingDateResult = ({ orderExportTicketBulkBookingDateSummary }: Props) => {
  if (!orderExportTicketBulkBookingDateSummary) {
    return null;
  }

  const { total, success, items } = orderExportTicketBulkBookingDateSummary;

  return (
    <Box sx={{ p: '10px', mt: '20px', border: '1px solid #e8e8e8' }}>
      <Typography variant="h5" gutterBottom mb={2}>
        투숙일지정 처리 결과
      </Typography>
      <Box mb="10px">
        <Chip label={`요청 출고건: ${total}건`} color="default" variant="outlined" sx={{ mr: '10px' }} />
        <Chip label={`성공 출고건: ${success}건`} color="primary" variant="outlined" sx={{ mr: '10px' }} />
        <Chip label={`실패 출고건: ${total - success}건`} color="secondary" variant="outlined" sx={{ mr: '10px' }} />
      </Box>
      <Table columns={columns} items={items} rowKey="exportId" />
    </Box>
  );
};
