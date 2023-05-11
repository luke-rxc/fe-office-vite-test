import { OrderDetailCommonExportListModal } from '@features/order/models';
import { ReturnTypeUseOrderDetailService } from '@features/order/services';
import { Box, CardContent, CardHeader } from '@material-ui/core';
import { CardStyled } from './OrderCardStyle';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { OrderExportRealGoodsInfo, OrderExportTicketGoodsInfo } from '.';

interface Props {
  item: OrderDetailCommonExportListModal;
  targetServiceId: string;
  onClickCopyClipboard: ReturnTypeUseOrderDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 출고정보 component (공통)
 */
export const OrderExportInfo = ({
  item: { real: exportRealList, ticket: exportTicketList },
  targetServiceId,
  ...props
}: Props) => {
  const realList = exportRealList.length > 0 ? exportRealList : exportTicketList.length === 0 ? [] : null;

  return (
    <CardStyled variant="outlined" targetid={targetServiceId}>
      <CardHeader title="출고정보" />
      <CardContent>
        <OrderExportRealGoodsInfo {...props} items={realList} targetServiceId={targetServiceId} />
        {exportRealList.length > 0 && exportTicketList.length > 0 && <Box p="10px 0" />}
        <OrderExportTicketGoodsInfo {...props} items={exportTicketList} targetServiceId={targetServiceId} />
      </CardContent>
    </CardStyled>
  );
};
