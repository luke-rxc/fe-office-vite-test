import { Table, TableColumnProps } from '@components/table/Table';
import { OrderExportItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderExportDetailService } from '@features/order/services';
import { Box, Card, Chip, Link } from '@material-ui/core';
import { useMemo } from 'react';
import { ImageBoxStyled } from '../ImageBoxStyled';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';

interface Props {
  orderExportDetail: ReturnTypeUseOrderExportDetailService['orderExportDetail'];
  isLoading: ReturnTypeUseOrderExportDetailService['isLoading'];
  isManager: ReturnTypeUseOrderExportDetailService['isManager'];
  onClickCopyClipboard: ReturnTypeUseOrderExportDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 출고(티켓) 상품 component
 */
export const ExportTicketGoods = ({
  orderExportDetail,
  isLoading,
  isManager,
  onClickCopyClipboard: handleClickCopyClipboard,
  onClickOpenService: handleClickOpenService,
}: Props) => {
  const columns: Array<TableColumnProps<OrderExportItemOptionModel>> = useMemo(
    () => [
      {
        label: '입점사',
        dataKey: 'provider.name',
        align: 'center',
        render: (value, item) => {
          if (!isManager) {
            return value;
          }

          return (
            <Link
              color="primary"
              component="a"
              onClick={handleClickOpenService(`/provider/${item.provider.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              {value}
            </Link>
          );
        },
      },
      { label: 'MD', dataKey: 'md.name', align: 'center', hide: !isManager },
      {
        label: '상품타입',
        dataKey: 'goods.type.name',
        align: 'center',
        render: (value, item) => {
          return <Chip label={value} color={item.goods.type.code === 'auction' ? 'secondary' : 'default'} />;
        },
      },
      {
        label: '상품분류',
        dataKey: 'goods.kind.name',
        align: 'center',
        render: (value, item) => {
          return <Chip label={value} color={item.goods.kind.code === 'real' ? 'default' : 'secondary'} />;
        },
      },
      {
        label: '취소가능여부',
        dataKey: 'goods.isCancelable',
        align: 'center',
        render: (_, item) => {
          return (
            <Chip
              label={item.goods.isCancelable ? '취소 가능' : '취소 불가'}
              color={item.goods.isCancelable ? 'default' : 'secondary'}
            />
          );
        },
      },
      {
        label: '출고상품',
        dataKey: 'goods.name',
        align: 'center',
        render: (value, item) => {
          const path = item.goods.primaryImage.path || '';
          return (
            <Box display="flex" alignItems="center">
              <ImageBoxStyled path={path} />
              <Link
                color="primary"
                component="a"
                onClick={handleClickOpenService(`/goods/${item.goods.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <Box display="flex" flexDirection="column" justifyContent="flexStart">
                  <Box textAlign="left">{value}</Box>
                  {item.goods.option.optionLabel && <Box textAlign="left">(옵션) {item.goods.option.optionLabel}</Box>}
                </Box>
              </Link>
            </Box>
          );
        },
      },
      {
        label: '재고/가용재고',
        dataKey: 'goods.option.stockText',
        align: 'center',
        render: (value, item) => {
          return `${value} / ${item.goods.option.purchasableStockText}`;
        },
      },
      {
        label: '출고수량/주문수량',
        dataKey: 'exportEa',
        align: 'center',
        render: (value, item) => {
          return `${value} / ${item.exportEa}`;
        },
      },
      { label: '출고금액', dataKey: 'goods.option.priceText', align: 'center' },
      { label: '출고일', dataKey: 'exportedDateText', align: 'center', rowSpan: (item) => item.shippingGroupRowspan },
      {
        label: '티켓 유효기간',
        dataKey: 'ticket',
        align: 'center',
        render: (_, item) => {
          return `${item.ticket.startDateText} ~ ${item.ticket.endDateText}`;
        },
      },
      {
        label: '티켓상태',
        dataKey: 'ticket.status',
        align: 'center',
        render: (_, item) => {
          return (
            <>
              <Box>{`${item.ticket.status.name}${item.ticket.isExpired ? '(기간만료)' : ''}`}</Box>
              <Box mt="3px">{`재발송 횟수: ${item.ticket.resendCount ?? '없음'}`}</Box>
            </>
          );
        },
      },
      { label: '출고상태', dataKey: 'status.name', align: 'center', rowSpan: (item) => item.shippingGroupRowspan },
    ],
    [handleClickOpenService, isManager],
  );

  if (!orderExportDetail) {
    return null;
  }

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <Table
        columns={columns}
        items={orderExportDetail.itemOptionList}
        rowKey="id"
        isLoading={isLoading}
        pagination={false}
      />
    </Card>
  );
};
