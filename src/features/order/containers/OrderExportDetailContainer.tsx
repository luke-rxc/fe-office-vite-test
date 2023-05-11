import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import {
  Section,
  OrderDetailCommon,
  ExportGoods,
  ToggleFoldInfoButton,
  ExportEditDeliveryButton,
  ExportDeliveryInfoModify,
} from '../components';
import { UsedServiceType } from '../constants';
import { useLandingPage, useToggleFoldInfo } from '../hooks';
import { useOrderExportDetailService, useOrderDeliveryModifyService } from '../services';

interface Props {
  exportId: string;
}

export const OrderExportDetailContainer = ({ exportId }: Props) => {
  const { orderDetailCommon, orderExportDetail, isLoading, isManager, handleClickCopyClipboard } =
    useOrderExportDetailService({
      exportId,
    });

  const { handleOpenModal, ...orderDeliveryModifyServiceProps } = useOrderDeliveryModifyService({
    exportId,
    deliveryCompanyName: orderExportDetail?.delivery?.company,
    deliveryNumber: orderExportDetail?.delivery?.number,
  });

  const { isFold, handleToggleFold } = useToggleFoldInfo();
  const { handleClickOpenService } = useLandingPage();

  if (isLoading) {
    return (
      <Layout title="출고상세">
        <Box>로딩중</Box>
      </Layout>
    );
  }

  return (
    <>
      <Layout title="출고상세">
        <Section title="기본 정보" action={<ToggleFoldInfoButton isFold={isFold} onToggleFold={handleToggleFold} />}>
          <OrderDetailCommon
            commonItem={orderDetailCommon}
            isManager={isManager}
            isFold={isFold}
            usedServiceType={UsedServiceType.EXPORT}
            usedServiceId={exportId}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
          <Box p="10px 0" />
        </Section>
        <Section
          title="출고 상품"
          action={<ExportEditDeliveryButton show={!orderExportDetail.ticket} onClick={handleOpenModal} />}
        >
          <ExportGoods
            orderExportDetail={orderExportDetail}
            isLoading={isLoading}
            isManager={isManager}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
        </Section>
      </Layout>
      <ExportDeliveryInfoModify {...orderDeliveryModifyServiceProps} />
    </>
  );
};
