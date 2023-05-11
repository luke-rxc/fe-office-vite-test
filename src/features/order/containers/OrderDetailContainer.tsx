import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  Messages,
  OrderBasicInfo,
  OrderDelivery,
  Section,
  OrderAddressModal,
  OrderDetailActions,
  OrderDetailCommon,
  OrderMemo,
  ToggleFoldInfoButton,
} from '../components';
import { OrderRequestModal } from '../components/common/OrderRequestModal';
import { OrderMemoDomainType, UsedServiceType } from '../constants';
import { useLandingPage, useToggleFoldInfo } from '../hooks';
import {
  useOrderSearchAddressService,
  useOrderDetailActionService,
  useOrderDetailService,
  useOrderRequestService,
  useOrderMemoService,
} from '../services';

interface Props {
  orderId: string;
}

export const OrderDetailContainer = ({ orderId }: Props) => {
  const {
    orderDetailCommon,
    orderDetail,
    orderLog,
    isLoading,
    isError,
    form: { formMethodForRecipient, handleSubmitRecipient },
    isManager,
    handleClickCopyClipboard,
    handleUpdateAddress,
    handleRefreshOrderDetail,
  } = useOrderDetailService({ orderId });

  const { orderManagerMemos, orderPartnerMemos, handleRegistOrderMemo } = useOrderMemoService({
    orderId,
    orderMemoDomain: OrderMemoDomainType.ORDER,
  });

  const { showAddressModal, handleClickShowAddressModal, handleClickHideAddressModal, addressRef, loadAddress } =
    useOrderSearchAddressService({ onUpdateAddress: handleUpdateAddress });

  const { actions } = useOrderDetailActionService({ orderId });

  const { orderRequestType, openRequestModal, handleClickShowRequestModal, handleClickHideRequestModal } =
    useOrderRequestService({ handleRefreshOrderDetail });

  const { isFold, handleToggleFold } = useToggleFoldInfo(false);
  const { handleClickOpenService } = useLandingPage();

  if (isLoading || isError) {
    return <Layout title="주문상세">{isLoading && <Box>로딩중</Box>}</Layout>;
  }

  return (
    <>
      <Layout
        title="주문상세"
        actions={
          isManager && (
            <OrderDetailActions
              orderStatus={orderDetailCommon.order.orderStatus.step}
              isExchangeable={orderDetail.isExchangeable}
              isRefundable={orderDetail.isRefundable}
              isReturnable={orderDetail.isReturnable}
              actions={actions}
              onClickShowRequestModal={handleClickShowRequestModal}
            />
          )
        }
      >
        <Section title="기본 정보" action={<ToggleFoldInfoButton isFold={isFold} onToggleFold={handleToggleFold} />}>
          <OrderDetailCommon
            commonItem={orderDetailCommon}
            isManager={isManager}
            isFold={isFold}
            usedServiceType={UsedServiceType.ORDER}
            usedServiceId={null}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
            onClickChangeDirectShippingMethod={actions.handleClickChangeDirectShippingMethod}
          />
          <Box p="10px 0" />
        </Section>
        <FormProvider {...formMethodForRecipient}>
          <form onSubmit={handleSubmitRecipient}>
            <Section
              title="배송지 정보"
              action={
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  disabled={!orderDetail.recipient.isChangeShippingInfo}
                >
                  변경
                </Button>
              }
            >
              <OrderDelivery
                isChangeShippingInfo={orderDetail.recipient.isChangeShippingInfo}
                onClickShowAddressModal={handleClickShowAddressModal}
              />
            </Section>
            <Section title="주문 정보">
              <OrderBasicInfo item={orderDetail} />
            </Section>
            <Section title="처리내역 로그">
              <Messages items={orderLog?.logs || []} height="130px" />
            </Section>
          </form>
        </FormProvider>
        <Section title="주문 메모">
          <OrderMemo
            isManager={isManager}
            orderManagerMemos={orderManagerMemos}
            orderPartnerMemos={orderPartnerMemos}
            onRegistOrderMemo={handleRegistOrderMemo}
          />
        </Section>
      </Layout>
      <OrderAddressModal
        openAddressModal={showAddressModal}
        ref={addressRef}
        loadAddressModule={loadAddress}
        onCloseModal={handleClickHideAddressModal}
      />
      <OrderRequestModal
        orderId={orderId}
        requestType={orderRequestType}
        openRequestModal={openRequestModal}
        onCloseModal={handleClickHideRequestModal}
      />
    </>
  );
};
