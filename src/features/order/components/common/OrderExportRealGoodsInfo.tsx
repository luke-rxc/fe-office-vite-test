import ContentCopy from '@material-ui/icons/ContentCopy';
import { IconButton } from '@components/IconButton';
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
 * 출고정보 component (공통 - 실물상품)
 */
export const OrderExportRealGoodsInfo = ({
  items,
  targetServiceId,
  onClickCopyClipboard: handleClickCopyClipboard,
  onClickOpenService: handleClickOpenService,
}: Props) => {
  if (items === null) {
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
    { label: '배송', dataKey: 'delivery.company', align: 'center', rowSpan: getRowspan },
    {
      label: '운송장번호',
      dataKey: 'delivery.number',
      align: 'center',
      rowSpan: getRowspan,
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
    { label: '배송시작일', dataKey: 'inShippingDateText', align: 'center', rowSpan: getRowspan },
    { label: '배송완료일', dataKey: 'completeDateText', align: 'center', rowSpan: getRowspan },
    { label: '구매확정일', dataKey: 'confirmDateText', align: 'center', rowSpan: getRowspan },
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
      <Box p="5px 0 10px">[실물 상품]</Box>
      <Table columns={columns} items={items} rowKey="rowKey" pagination={false} minHeight="20px" hover={false} />
    </>
  );
};
