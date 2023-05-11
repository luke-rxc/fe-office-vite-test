import ContentCopy from '@material-ui/icons/ContentCopy';
import { IconButton } from '@components/IconButton';
import { Table, TableColumnProps } from '@components/table/Table';
import { OrderDetailCommonOrderItemModel } from '@features/order/models';
import { ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box, Button, Card, CardContent, CardHeader, Chip, makeStyles } from '@material-ui/core';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';

interface Props {
  item: OrderDetailCommonOrderItemModel;
  isManager: ReturnTypeUseOrderDetailService['isManager'];
  isOrderDetail: boolean;
  onClickCopyClipboard: ReturnTypeUseOrderDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 주문 정보 component (공통)
 */
export const OrderInfo = ({
  item,
  isManager,
  isOrderDetail,
  onClickCopyClipboard: handleClickCopyClipboard,
  onClickOpenService: handleClickOpenService,
}: Props) => {
  const classes = useStyles();

  const columns: Array<TableColumnProps<OrderDetailCommonOrderItemModel>> = [
    {
      label: '주문번호',
      dataKey: 'orderId',
      align: 'center',
      render: (value) => {
        return (
          <Box display="flex" alignItems="center" justifyContent="center" gap="5px">
            {value}
            <IconButton
              icon={<ContentCopy fontSize="small" />}
              sx={{ padding: 0 }}
              onClick={() => handleClickCopyClipboard(value)}
            />
          </Box>
        );
      },
    },
    { label: '주문일', dataKey: 'createdDateText', align: 'center' },
    { label: '주문자', dataKey: 'ordererName', align: 'center' },
    {
      label: '블랙리스트 여부',
      dataKey: 'blacklistLabel',
      align: 'center',
      render: (value, item) => {
        return <Chip label={value} color={item.isBlack ? 'secondary' : 'default'} />;
      },
    },
    { label: '수령자', dataKey: 'recipientName', align: 'center' },
    { label: '결제수단', dataKey: 'paymentType.name', align: 'center' },
    { label: '주문상태', dataKey: 'orderStatus.name', align: 'center', hide: !isManager },
    {
      label: '1:1 문의하기 등록여부',
      dataKey: 'hasZendeskTicketText',
      align: 'center',
      render: (value, item) => {
        return item.hasZendeskTicket ? <Chip variant="outlined" label={value} color="secondary" /> : value;
      },
    },
    { label: '결제일', dataKey: 'paymentDateText', align: 'center' },
    {
      label: '비고',
      dataKey: 'link',
      align: 'center',
      render: (_, item) => {
        return (
          <Button
            type="button"
            size="small"
            variant="outlined"
            sx={{ mt: '10px' }}
            onClick={handleClickOpenService(`/order/detail/${item.orderId}`)}
          >
            열기
          </Button>
        );
      },
      hide: isOrderDetail,
    },
  ];

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader title="주문정보" />
      <CardContent>
        <Table columns={columns} items={[item]} rowKey="orderId" pagination={false} />
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    '&.MuiCard-root': {
      border: 'none',
    },

    '& .MuiCardContent-root': {
      padding: '0 16px 24px',
    },
  },
}));
