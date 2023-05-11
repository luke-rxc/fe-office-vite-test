import { Table, TableColumnProps } from '@components/table/Table';
import { OrderExportRegistModel } from '@features/order/models';
import { ReturnTypeUseOrderBulkExportService } from '@features/order/services';
import { Box, Typography, Chip } from '@material-ui/core';

interface Props {
  orderExportSummary: ReturnTypeUseOrderBulkExportService['orderExportSummary'];
}

const columns: Array<TableColumnProps<OrderExportRegistModel>> = [
  {
    label: '주문번호',
    dataKey: 'orderId',
    width: '150px',
    align: 'center',
  },
  {
    label: '주문 옵션번호',
    dataKey: 'optionId',
    width: '120px',
    align: 'center',
  },
  {
    label: '에러메세지',
    dataKey: 'message',
    align: 'left',
  },
];

/**
 * 출고 처리결과 component
 */
export const OrderBulkExportResult = ({ orderExportSummary }: Props) => {
  if (!orderExportSummary) {
    return null;
  }

  return (
    <Box sx={{ p: '10px', mt: '20px', border: '1px solid #e8e8e8' }}>
      <Typography variant="h5" gutterBottom mb={2}>
        출고처리 결과
      </Typography>
      <Box mb="10px">
        <Chip
          label={`요청 주문건: ${orderExportSummary.total}건`}
          color="default"
          variant="outlined"
          sx={{ mr: '10px' }}
        />
        <Chip
          label={`성공 주문건: ${orderExportSummary.success}건`}
          color="primary"
          variant="outlined"
          sx={{ mr: '10px' }}
        />
        <Chip
          label={`실패 주문건: ${orderExportSummary.total - orderExportSummary.success}건`}
          color="secondary"
          variant="outlined"
          sx={{ mr: '10px' }}
        />
      </Box>
      <Table columns={columns} items={orderExportSummary.items} rowKey="rowKey" />
    </Box>
  );
};
