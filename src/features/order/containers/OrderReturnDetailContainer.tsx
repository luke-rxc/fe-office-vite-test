import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  Messages,
  Section,
  OrderAddressModal,
  OrderDetailCommon,
  OrderRetrieval,
  ReturnInfo,
  ExchangeInfo,
  OrderMemo,
  ReturnDetailActions,
  ReturnActionModal,
  ReturnStatusChange,
  ToggleFoldInfoButton,
} from '../components';
import { OrderMemoDomainType, UsedServiceType } from '../constants';
import { useLandingPage, useToggleFoldInfo } from '../hooks';
import { useOrderMemoService, useOrderReturnDetailService, useOrderReturnActionService } from '../services';

interface Props {
  returnId: string;
}

export const OrderReturnDetailContainer = ({ returnId }: Props) => {
  const {
    orderDetailCommon,
    orderReturnDetail,
    orderReturnLog,
    exportTicketLog,
    isLoading,
    form: { formMethodReturnInfo, formMethodReturnStatus, handleSubmitReturnInfo, handleSubmitReturnStatus },
    address,
    isManager,
    handleClickCopyClipboard,
    handleClickExportTicketCancelTicket,
  } = useOrderReturnDetailService({ returnId });

  const {
    returnRequest: { formMethod: returnRequestFormMethod, handleOpenModal: handleOpenRequestModel, ...returnRequest },
  } = useOrderReturnActionService({ returnId, typeName: orderReturnDetail?.type?.name || '' });

  const { orderManagerMemos, orderPartnerMemos, handleRegistOrderMemo } = useOrderMemoService({
    orderId: orderDetailCommon ? orderDetailCommon?.order.orderId.toString() : undefined,
    orderMemoDomain: OrderMemoDomainType.RETURN,
    subId: returnId,
  });

  const { isFold, handleToggleFold } = useToggleFoldInfo();
  const { handleClickOpenService } = useLandingPage();

  if (isLoading || !orderReturnDetail) {
    return (
      <Layout title="반품/교환 상세">
        <Box>로딩중</Box>
      </Layout>
    );
  }

  return (
    <>
      <Layout
        title="반품/교환 상세"
        actions={
          <ReturnDetailActions
            isReturnableReject={orderReturnDetail.isRejectable}
            isReturnableWithdraw={orderReturnDetail.isWithdrawable}
            onOpenRequestModel={handleOpenRequestModel}
            typeName={orderReturnDetail.type.name}
          />
        }
      >
        <Section title="기본 정보" action={<ToggleFoldInfoButton isFold={isFold} onToggleFold={handleToggleFold} />}>
          <OrderDetailCommon
            commonItem={orderDetailCommon}
            isManager={isManager}
            isFold={isFold}
            usedServiceType={UsedServiceType.RETURN}
            usedServiceId={returnId}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
        </Section>

        <ReturnInfo
          item={orderReturnDetail}
          isManager={isManager}
          onClickOpenService={handleClickOpenService}
          onClickCopyClipboard={handleClickCopyClipboard}
        />
        <ExchangeInfo
          item={orderReturnDetail}
          isManager={isManager}
          onClickOpenService={handleClickOpenService}
          onClickCopyClipboard={handleClickCopyClipboard}
        />

        <FormProvider {...formMethodReturnInfo}>
          <form onSubmit={handleSubmitReturnInfo}>
            <Section
              title="회수정보"
              action={
                orderReturnDetail.isChangeableReturnInfo ? (
                  <Button type="submit" size="small" variant="contained">
                    회수정보 변경
                  </Button>
                ) : null
              }
            >
              <OrderRetrieval
                returnReason={orderReturnDetail.returnReason}
                isAutoReturnable={orderReturnDetail.isAutoReturnable}
                isChangeableReturnInfo={orderReturnDetail.isChangeableReturnInfo}
                isCancelExportTicket={orderReturnDetail.isCancelExportTicket}
                onClickShowAddressModal={address.handleClickShowAddressModal}
              />
            </Section>

            <Section title="처리내역 로그">
              <Messages items={orderReturnLog?.logs || []} height="130px" />
            </Section>
            {exportTicketLog && (
              <Section title="티켓처리 로그">
                <Messages items={exportTicketLog.logs || []} height="130px" />
              </Section>
            )}
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

        <FormProvider {...formMethodReturnStatus}>
          <form onSubmit={handleSubmitReturnStatus}>
            <ReturnStatusChange
              changeableStatusList={orderReturnDetail.changeableStatusList}
              isManager={isManager}
              status={orderReturnDetail.status.code}
              type={orderReturnDetail.type}
              tempReturnShippingCostText={orderReturnDetail.tempReturnShippingCostText}
              returnShippingCostText={orderReturnDetail.returnShippingCostText}
              isCancelExportTicket={orderReturnDetail.isCancelExportTicket}
              exportTicketInfo={orderReturnDetail.exportTicketInfo}
              handleClickExportTicketCancelTicket={handleClickExportTicketCancelTicket}
            />
          </form>
        </FormProvider>
      </Layout>
      <OrderAddressModal
        openAddressModal={address.showAddressModal}
        ref={address.addressRef}
        loadAddressModule={address.loadAddress}
        onCloseModal={address.handleClickHideAddressModal}
      />

      <FormProvider {...returnRequestFormMethod}>
        <ReturnActionModal {...returnRequest} typeName={orderReturnDetail.type.name} />
      </FormProvider>
    </>
  );
};
