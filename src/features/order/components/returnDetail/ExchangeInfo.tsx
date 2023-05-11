import { Table, TableColumnProps } from '@components/table/Table';
import { OrderReturnItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderReturnDetailService } from '@features/order/services';
import { Box, Chip, Link } from '@material-ui/core';
import { useMemo } from 'react';
import { Section, ImageBoxStyled } from '@features/order/components';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { IconButton } from '@components/IconButton';
import ContentCopy from '@material-ui/icons/ContentCopy';

interface Props {
  item: ReturnTypeUseOrderReturnDetailService['orderReturnDetail'];
  isManager: ReturnTypeUseOrderReturnDetailService['isManager'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
  onClickCopyClipboard: ReturnTypeUseOrderReturnDetailService['handleClickCopyClipboard'];
}

/**
 * 교환정보 component
 */
export const ExchangeInfo = ({
  item: {
    type: { code },
    itemOptionList,
  },
  isManager,
  onClickOpenService: handleClickOpenService,
  onClickCopyClipboard: handleClickCopyClipboard,
}: Props) => {
  const getRowspan = (item: OrderReturnItemOptionModel) => item.rowspan;

  const columns: Array<TableColumnProps<OrderReturnItemOptionModel>> = useMemo(
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
        label: '교환신청상품',
        dataKey: 'goods.name',
        align: 'center',
        render: (value, item) => {
          const path = item.goods.primaryImage.path || '';
          return (
            <Box display="flex" alignItems="center">
              <ImageBoxStyled path={path} />
              <Box display="flex" flexDirection="column" justifyContent="flexStart">
                <Box textAlign="left">{value}</Box>
                {item.goods.option.optionLabel && <Box textAlign="left">(옵션) {item.goods.option.optionLabel}</Box>}
              </Box>
            </Box>
          );
        },
      },
      {
        label: '변경옵션',
        dataKey: 'exchange.goods.name',
        align: 'center',
        render: (value, item) => {
          return (
            <Box display="flex" flexDirection="column" justifyContent="flexStart">
              {item.exchange.goods.option.optionLabel && (
                <Box textAlign="left">(옵션) {item.exchange.goods.option.optionLabel}</Box>
              )}
            </Box>
          );
        },
      },
      { label: '교환수량', dataKey: 'exchange.exchangeEa', align: 'center' },
      { label: '교환접수일시', dataKey: 'createdDateText', align: 'center', rowSpan: getRowspan },
      { label: '교환완료일시', dataKey: 'completedDateText', align: 'center', rowSpan: getRowspan },
      {
        label: '교환주문번호',
        dataKey: 'exchange.exchangeOrderIdText',
        align: 'center',
        rowSpan: getRowspan,
        render: (value, item) => {
          if (!item.exchange.exchangeOrderId) {
            return '-';
          }

          return (
            <Box>
              <Link
                color="primary"
                component="a"
                onClick={handleClickOpenService(`/order/detail/${item.exchange.exchangeOrderId}`)}
                sx={{ cursor: 'pointer' }}
              >
                {value}
              </Link>
              <IconButton
                icon={<ContentCopy fontSize="small" />}
                sx={{ padding: 0, ml: '5px' }}
                onClick={() => handleClickCopyClipboard(item.exchange.exchangeOrderIdText)}
              />
            </Box>
          );
        },
      },
      { label: '처리자', dataKey: 'actorName', align: 'center', rowSpan: getRowspan },
      {
        label: '회수상태',
        dataKey: 'returnAutomationStatusName',
        align: 'center',
        rowSpan: getRowspan,
        render: (_, item) => {
          if (!item.returnAutomationStatusName) {
            return '-';
          }

          return (
            <Box>
              <Box>{item.returnAutomationStatusName}</Box>
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
      { label: '반품상태', dataKey: 'statusName', align: 'center', rowSpan: getRowspan },
      { label: '환불상태', dataKey: 'refundStatus', align: 'center', rowSpan: getRowspan },
    ],
    [handleClickCopyClipboard, handleClickOpenService, isManager],
  );

  if (code !== 'exchange') {
    return null;
  }

  return (
    <Section title="교환 정보">
      <Table columns={columns} items={itemOptionList} rowKey="rowKey" pagination={false} minHeight="20px" />
    </Section>
  );
};
