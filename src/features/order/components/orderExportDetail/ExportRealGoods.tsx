import ContentCopy from '@material-ui/icons/ContentCopy';
import { IconButton } from '@components/IconButton';
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
 * 출고(실물) 상품 component
 */
export const ExportRealGoods = ({
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
                {value}
              </Link>
            </Box>
          );
        },
      },
      {
        label: '옵션명',
        dataKey: 'goods.option.optionLabel',
        align: 'center',
      },
      {
        label: '관리코드',
        dataKey: 'goods.option.id',
        align: 'center',
      },
      {
        label: '출고명',
        dataKey: 'partnerExportCode',
        align: 'center',
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
      { label: '배송', dataKey: 'delivery.company', align: 'center', rowSpan: (item) => item.shippingGroupRowspan },
      {
        label: '운송장번호',
        dataKey: 'delivery.number',
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
        rowSpan: (item) => item.shippingGroupRowspan,
      },
      {
        label: '배송시작일',
        dataKey: 'inShippingDateText',
        align: 'center',
        rowSpan: (item) => item.shippingGroupRowspan,
      },
      {
        label: '배송종료일',
        dataKey: 'completeDateText',
        align: 'center',
        rowSpan: (item) => item.shippingGroupRowspan,
      },
      { label: '출고상태', dataKey: 'status.name', align: 'center', rowSpan: (item) => item.shippingGroupRowspan },
    ],
    [handleClickCopyClipboard, handleClickOpenService, isManager],
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
