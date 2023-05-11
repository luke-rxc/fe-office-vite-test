import { ReturnTypeUseOrderExportDetailService } from '@features/order/services';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { ExportTicketGoods } from './ExportTicketGoods';
import { ExportRealGoods } from './ExportRealGoods';

interface Props {
  orderExportDetail: ReturnTypeUseOrderExportDetailService['orderExportDetail'];
  isLoading: ReturnTypeUseOrderExportDetailService['isLoading'];
  isManager: ReturnTypeUseOrderExportDetailService['isManager'];
  onClickCopyClipboard: ReturnTypeUseOrderExportDetailService['handleClickCopyClipboard'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 출고 상품 component
 */
export const ExportGoods = ({ orderExportDetail, ...props }: Props) => {
  if (!orderExportDetail) {
    return null;
  }

  if (orderExportDetail.ticket) {
    return <ExportTicketGoods {...props} orderExportDetail={orderExportDetail} />;
  }

  return <ExportRealGoods {...props} orderExportDetail={orderExportDetail} />;
};
