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
 * 반품정보 component
 */
export const ReturnInfo = ({
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
        label: '신청상품',
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
        label: '사유',
        dataKey: 'returnReasonName',
        align: 'center',
        render: (value, item) => {
          return (
            <Box>
              <Box>
                <Chip label={value} />
              </Box>
              <Box>{item.returnReasonText}</Box>
            </Box>
          );
        },
      },
      { label: '수량', dataKey: 'returnEa', align: 'center', rowSpan: getRowspan },
      { label: '접수일시', dataKey: 'createdDateText', align: 'center', rowSpan: getRowspan },
      { label: '완료일시', dataKey: 'completedDateText', align: 'center', rowSpan: getRowspan },
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
      { label: '상태', dataKey: 'statusName', align: 'center', rowSpan: getRowspan },
      { label: '환불상태', dataKey: 'refundStatus.name', align: 'center', rowSpan: getRowspan },
    ],
    [handleClickCopyClipboard, handleClickOpenService, isManager],
  );

  if (code !== 'return') {
    return null;
  }

  return (
    <Section title="반품 정보">
      <Table columns={columns} items={itemOptionList} rowKey="id" pagination={false} minHeight="20px" />
    </Section>
  );
};
