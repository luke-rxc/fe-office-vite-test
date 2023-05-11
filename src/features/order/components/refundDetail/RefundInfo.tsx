import { Table, TableColumnProps } from '@components/table/Table';
import { OrderRefundItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { Box, Chip, Link } from '@material-ui/core';
import { useMemo } from 'react';
import { ImageBoxStyled } from '@features/order/components';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';

interface Props {
  item: ReturnTypeUseOrderRefundDetailService['orderRefundDetail'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 환불정보 component
 */
export const RefundInfo = ({ item: { itemOptionList }, onClickOpenService: handleClickOpenService }: Props) => {
  // const getRowspan = (item: OrderRefundItemOptionModel) => item.rowspan;

  const columns: Array<TableColumnProps<OrderRefundItemOptionModel>> = useMemo(
    () => [
      {
        label: '입점사',
        dataKey: 'provider.name',
        align: 'center',
        render: (value, item) => {
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
        label: '환불신청상품',
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
        label: '환불사유',
        dataKey: 'refundReasonName',
        align: 'center',
        render: (value, item) => {
          return (
            <Box>
              <Box>
                <Chip label={value} />
              </Box>
              <Box>{item.refundReasonText}</Box>
            </Box>
          );
        },
      },
      { label: '환불수량', dataKey: 'refundEa', align: 'center' },
      { label: '환불접수일시', dataKey: 'createdDateText', align: 'center' },
      { label: '환불완료일시', dataKey: 'completedDateText', align: 'center' },
      { label: '처리자', dataKey: 'actorName', align: 'center' },
      { label: '반품상태', dataKey: 'returnStatusName', align: 'center' },
      { label: '상태', dataKey: 'statusName', align: 'center' },
    ],
    [handleClickOpenService],
  );

  // if (code !== 'return') {
  //   return null;
  // }

  return <Table columns={columns} items={itemOptionList} rowKey="id" pagination={false} minHeight="20px" />;
};
