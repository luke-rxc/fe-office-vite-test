import { Table, TableColumnProps } from '@components/table/Table';
import { OrderDetailCommonExportItemModel } from '@features/order/models';
import { ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box, Button } from '@material-ui/core';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';

interface Props {
  items: Array<OrderDetailCommonExportItemModel>;
  targetServiceId: string;
  onClickCopyClipboard: ReturnTypeUseOrderDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 출고정보 component (공통 - 티켓상품)
 */
export const OrderExportTicketGoodsInfo = ({
  items,
  targetServiceId,
  onClickOpenService: handleClickOpenService,
}: Props) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getRowspan = (item: OrderDetailCommonExportItemModel) => item.idRowspan;

  const columns: Array<TableColumnProps<OrderDetailCommonExportItemModel>> = [
    {
      label: '출고일',
      dataKey: 'exportedDateText',
      align: 'center',
      rowSpan: getRowspan,
    },
    { label: '출고 상품', dataKey: 'goods.name', align: 'center' },
    { label: '출고수량', dataKey: 'ea', align: 'center' },
    {
      label: '티켓 유효기간',
      dataKey: 'ticket',
      align: 'center',
      render: (_, item) => {
        return `${item.ticket.startDateText} ~ ${item.ticket.endDateText}`;
      },
    },
    { label: '구매확정일', dataKey: 'confirmDateText', align: 'center', rowSpan: getRowspan },
    {
      label: '티켓상태',
      dataKey: 'ticket.status',
      align: 'center',
      render: (_, item) => {
        return (
          <>
            <Box>
              {`${item.ticket.status.name}`}
              {item.ticket.isExpired ? (
                <Box display="inline-block" ml="3px">
                  (
                  <Box display="inline-block" color="red">
                    기간만료
                  </Box>
                  )
                </Box>
              ) : (
                ''
              )}
            </Box>
            <Box mt="3px">{`재발송 횟수: ${item.ticket.resendCount ?? '없음'}`}</Box>
          </>
        );
      },
    },
    { label: '출고상태', dataKey: 'status.name', align: 'center', rowSpan: getRowspan },
    {
      label: '비고',
      dataKey: 'link',
      align: 'center',
      rowSpan: getRowspan,
      render: (_, item) => {
        return item.id !== Number(targetServiceId) ? (
          <Button
            type="button"
            size="small"
            variant="outlined"
            sx={{ mt: '10px' }}
            onClick={handleClickOpenService(`/export/detail/${item.id}`)}
          >
            열기
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <>
      <Box p="5px 0 10px">[티켓 상품]</Box>
      <Table columns={columns} items={items} rowKey="rowKey" pagination={false} minHeight="20px" hover={false} />
    </>
  );
};
