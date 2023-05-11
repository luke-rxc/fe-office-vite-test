import { Table, TableColumnProps } from '@components/table/Table';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { OrderDetailCommonRefundItemModel } from '@features/order/models';
import { Button, CardContent, CardHeader } from '@material-ui/core';
import { CardStyled } from './OrderCardStyle';

interface Props {
  items: Array<OrderDetailCommonRefundItemModel>;
  targetServiceId: string;
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 환불정보 component (공통)
 */
export const OrderRefundInfo = ({ items, targetServiceId, onClickOpenService: handleClickOpenService }: Props) => {
  const getRowspan = (item: OrderDetailCommonRefundItemModel) => item.idRowspan;

  const columns: Array<TableColumnProps<OrderDetailCommonRefundItemModel>> = [
    { label: '환불접수일', dataKey: 'createdDateText', align: 'center', rowSpan: getRowspan },
    { label: '환불상품', dataKey: 'goods.name', align: 'center' },
    { label: '환불수량', dataKey: 'ea', align: 'center' },
    { label: '환불종류', dataKey: 'type.name', align: 'center', rowSpan: getRowspan },
    { label: '환불방법', dataKey: 'refundMethod.name', align: 'center', rowSpan: getRowspan },
    { label: '환불금액', dataKey: 'refundPriceText', align: 'center', rowSpan: getRowspan },
    { label: '환불적립금', dataKey: 'refundPointText', align: 'center', rowSpan: getRowspan },
    { label: '처리자', dataKey: 'actorName', align: 'center', rowSpan: getRowspan },
    { label: '환불상태', dataKey: 'status.name', align: 'center', rowSpan: getRowspan },
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
            onClick={handleClickOpenService(`/refund/detail/${item.id}`)}
          >
            열기
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <CardStyled variant="outlined" targetid={targetServiceId}>
      <CardHeader title="환불정보" />
      <CardContent>
        <Table columns={columns} items={items} rowKey="rowKey" pagination={false} minHeight="20px" hover={false} />
      </CardContent>
    </CardStyled>
  );
};
