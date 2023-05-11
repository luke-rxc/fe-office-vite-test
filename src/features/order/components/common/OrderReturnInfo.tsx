import { Table, TableColumnProps } from '@components/table/Table';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { OrderDetailCommonReturnItemModel } from '@features/order/models';
import { Box, Button, CardContent, CardHeader, Chip } from '@material-ui/core';
import { CardStyled } from './OrderCardStyle';
import { IconButton } from '@components/IconButton';
import { ReturnTypeUseOrderDetailService } from '@features/order/services';
import ContentCopy from '@material-ui/icons/ContentCopy';

interface Props {
  items: Array<OrderDetailCommonReturnItemModel>;
  targetServiceId: string;
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
  onClickCopyClipboard: ReturnTypeUseOrderDetailService['handleClickCopyClipboard'];
}

/**
 * 반품/교환 정보 component (공통)
 */
export const OrderReturnInfo = ({
  items,
  targetServiceId,
  onClickOpenService: handleClickOpenService,
  onClickCopyClipboard: handleClickCopyClipboard,
}: Props) => {
  const getRowspan = (item: OrderDetailCommonReturnItemModel) => item.idRowspan;

  const columns: Array<TableColumnProps<OrderDetailCommonReturnItemModel>> = [
    { label: '반품접수일', dataKey: 'createdDateText', align: 'center', rowSpan: getRowspan },
    { label: '반품상품', dataKey: 'goods.name', align: 'center' },
    { label: '반품수량', dataKey: 'ea', align: 'center' },
    { label: '반품종류', dataKey: 'type.name', align: 'center', rowSpan: getRowspan },
    { label: '처리자', dataKey: 'actorName', align: 'center', rowSpan: getRowspan },
    {
      label: '회수상태',
      dataKey: 'returnAutomationStatus',
      align: 'center',
      rowSpan: getRowspan,
      render: (_, item) => {
        if (!item.returnAutomationStatus) {
          return '-';
        }

        return (
          <Box>
            <Box>{item.returnAutomationStatus.name}</Box>
            {item.returnDeliveryCompanyText && item.returnDeliveryNumber && (
              <Box mt="10px">
                <Chip label={item.returnDeliveryCompanyText} />
                <Box>
                  {item.returnDeliveryNumber}
                  <IconButton
                    icon={<ContentCopy fontSize="small" />}
                    sx={{ padding: 0, ml: '5px' }}
                    onClick={() => handleClickCopyClipboard(item.returnDeliveryNumber)}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      label: '반품상태',
      dataKey: 'status.name',
      align: 'center',
      rowSpan: getRowspan,
      render: (_, item) => {
        return item.status ? item.status.name : '-';
      },
    },
    {
      label: '환불상태',
      dataKey: 'refundStatus.name',
      align: 'center',
      rowSpan: getRowspan,
      render: (_, item) => {
        return item.refundStatus ? item.refundStatus.name : '-';
      },
    },
    { label: '처리완료일시', dataKey: 'completedDateText', align: 'center', rowSpan: getRowspan },
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
            onClick={handleClickOpenService(`/return/detail/${item.id}`)}
          >
            열기
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <CardStyled variant="outlined" targetid={targetServiceId}>
      <CardHeader title="반품/교환 정보" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="rowKey" pagination={false} minHeight="20px" hover={false} />
      </CardContent>
    </CardStyled>
  );
};
