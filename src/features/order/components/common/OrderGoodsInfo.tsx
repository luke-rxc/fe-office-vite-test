import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { OrderItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderDetailActionService, ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box, Button, Card, CardContent, CardHeader, Chip, Link, makeStyles } from '@material-ui/core';
import { useMemo } from 'react';

interface Props {
  items: ReturnTypeUseOrderDetailService['orderDetailCommon']['itemOption']['itemOptionList'];
  isManager: ReturnTypeUseOrderDetailService['isManager'];
  isOrderDetail: boolean;
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
  onClickChangeDirectShippingMethod?: ReturnTypeUseOrderDetailActionService['actions']['handleClickChangeDirectShippingMethod'];
}

/**
 * 주문상품 component (공통)
 */
export const OrderGoodsInfo = ({
  items,
  isManager,
  isOrderDetail,
  onClickOpenService: handleClickOpenService,
  onClickChangeDirectShippingMethod: handleClickChangeDirectShippingMethod,
}: Props) => {
  const classes = useStyles();

  const columns: Array<TableColumnProps<OrderItemOptionModel>> = useMemo(() => {
    return [
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
        label: '상품유형',
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
        hide: !isOrderDetail,
      },
      {
        label: '상품명',
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
      { label: '수량', dataKey: 'ea', align: 'center' },
      { label: '판매가격', dataKey: 'goods.option.priceText', align: 'center' },
      {
        label: '재고/가용재고',
        dataKey: 'goods.option.stockText',
        align: 'center',
        render: (value, item) => {
          return `${value} / ${item.goods.option.purchasableStockText}`;
        },
      },
      // { label: '결제확인', dataKey: 'step20Ea', align: 'center' },
      { label: '상품준비', dataKey: 'step30Ea', align: 'center' },
      { label: '출고준비', dataKey: 'step40Ea', align: 'center' },
      { label: '출고완료', dataKey: 'step50Ea', align: 'center' },
      { label: '배송중', dataKey: 'step60Ea', align: 'center' },
      { label: '배송완료', dataKey: 'step70Ea', align: 'center' },
      { label: '취소', dataKey: 'refundEa', align: 'center' },
      { label: '상태', dataKey: 'status.name', align: 'center' },
      {
        label: '배송비',
        dataKey: 'shipping.costText',
        align: 'center',
        rowSpan: (item) => {
          return item.shippingRowspan;
        },
        render: (value, item) => {
          const addCostInfo = item.shipping.addCost ? ` (도서산간 ${item.shipping.addCostText} 포함)` : '';
          return (
            <>
              <Box>
                {value}
                {addCostInfo}
              </Box>
              {item.shipping.text && <Box>({item.shipping.text})</Box>}
            </>
          );
        },
      },
      {
        label: '배송방법',
        dataKey: 'test',
        align: 'center',
        rowSpan: (item) => {
          return item.itemRowspan;
        },
        render: (_, item) => {
          return (
            <>
              <Box>{item.shippingMethodText}</Box>
              {isManager && isOrderDetail && item.isChangeShippingMethod && (
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mt: '10px' }}
                    onClick={handleClickChangeDirectShippingMethod?.(item.itemId.toString())}
                  >
                    직접배송으로 변경
                  </Button>
                </Box>
              )}
            </>
          );
        },
      },
    ];
  }, [handleClickChangeDirectShippingMethod, handleClickOpenService, isManager, isOrderDetail]);

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader title="주문 상품" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="id" pagination={false} minHeight="20px" />
      </CardContent>
    </Card>
  );
};

const ImageBoxStyled = styled(Box)<{ path: string }>`
  width: 40px;
  height: 40px;
  margin: 10px;
  background-image: ${({ path }) => `url(${path})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border: 1px solid #0000001f;
  border-radius: 4px;
`;

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
