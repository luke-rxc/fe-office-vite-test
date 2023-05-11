import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import { FormProvider } from 'react-hook-form';
import {
  Messages,
  Section,
  OrderDetailCommon,
  RefundInfo,
  OrderMemo,
  ToggleFoldInfoButton,
  OrderAccountInfo,
  RefundAccountForm,
  RefundPriceInfo,
  RefundSummary,
  RefundAction,
  RefundStatusConfirmMessage,
} from '../components';
import { OrderMemoDomainType, UsedServiceType } from '../constants';
import { useLandingPage, useToggleFoldInfo } from '../hooks';
import { useOrderMemoService, useOrderRefundDetailService } from '../services';
import { OrderRefundStatusRequestParams } from '../types';

interface Props {
  refundId: string;
}

export const OrderRefundDetailContainer = ({ refundId }: Props) => {
  const getRefundStatusConfirmMessage = (refundStatusText: string, params: OrderRefundStatusRequestParams) => {
    return <RefundStatusConfirmMessage refundStatusText={refundStatusText} params={params} />;
  };

  const {
    orderDetailCommon,
    orderRefundDetail,
    orderRefundLog,
    bankCodes,
    orderRefundPriceInfo,
    isLoading,
    isManager,
    form: {
      refundAccountFormField,
      refundPriceFormField,
      handleSubmitRefundAccount,
      handleSubmitRefundPrice,
      handleChangeShippingCost,
    },
    handleClickCopyClipboard,
    handleClickCopyUserRefundAccount,
  } = useOrderRefundDetailService({ refundId, getRefundStatusConfirmMessage });

  const { orderManagerMemos, orderPartnerMemos, handleRegistOrderMemo } = useOrderMemoService({
    orderId: orderDetailCommon ? orderDetailCommon?.order.orderId.toString() : undefined,
    orderMemoDomain: OrderMemoDomainType.REFUND,
    subId: refundId,
  });

  const { isFold, handleToggleFold } = useToggleFoldInfo();
  const { handleClickOpenService } = useLandingPage();

  if (isLoading || !orderRefundDetail) {
    return (
      <Layout title="환불 상세">
        <Box>로딩중</Box>
      </Layout>
    );
  }

  return (
    <>
      <Layout title="환불 상세">
        <Section title="기본 정보" action={<ToggleFoldInfoButton isFold={isFold} onToggleFold={handleToggleFold} />}>
          <OrderDetailCommon
            commonItem={orderDetailCommon}
            isManager={isManager}
            isFold={isFold}
            usedServiceType={UsedServiceType.REFUND}
            usedServiceId={refundId}
            onClickCopyClipboard={handleClickCopyClipboard}
            onClickOpenService={handleClickOpenService}
          />
          <Box p="10px 0" />
        </Section>

        <Section title="환불 정보">
          <RefundInfo item={orderRefundDetail} onClickOpenService={handleClickOpenService} />
        </Section>

        <Section title="사용자 계좌정보">
          <OrderAccountInfo userRefundAccount={orderRefundDetail.userRefundAccount} />
        </Section>

        <FormProvider {...refundAccountFormField}>
          <form onSubmit={handleSubmitRefundAccount}>
            <Section
              title="환불 계좌정보"
              action={
                <>
                  {orderRefundDetail.userRefundAccount && (
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      color="inherit"
                      sx={{ marginRight: '10px' }}
                      startIcon={<ContentCopyIcon />}
                      onClick={handleClickCopyUserRefundAccount}
                    >
                      사용자 계좌정보 복사
                    </Button>
                  )}

                  {orderRefundDetail.isChangeRefundBankInfo && (
                    <Button type="submit" size="small" variant="contained">
                      계좌정보 변경
                    </Button>
                  )}
                </>
              }
            >
              <RefundAccountForm bankCodes={bankCodes} />
            </Section>
          </form>
        </FormProvider>

        <Section title="처리내역 로그">
          <Messages items={orderRefundLog?.logs || []} height="130px" />
        </Section>
        <Section title="주문 메모">
          <OrderMemo
            isManager={isManager}
            orderManagerMemos={orderManagerMemos}
            orderPartnerMemos={orderPartnerMemos}
            onRegistOrderMemo={handleRegistOrderMemo}
          />
        </Section>
        <FormProvider {...refundPriceFormField}>
          <form onSubmit={handleSubmitRefundPrice}>
            <Section title="환불 처리">
              <RefundPriceInfo
                item={orderRefundPriceInfo}
                refundTypeCode={orderRefundDetail.type.code}
                refundStatusCode={orderRefundDetail.status.code}
                onChangeShippingCost={handleChangeShippingCost}
                onClickOpenService={handleClickOpenService}
              />
              <RefundSummary item={orderRefundPriceInfo} />
            </Section>
            <RefundAction item={orderRefundPriceInfo} refundStatusCode={orderRefundDetail.status.code} />
          </form>
        </FormProvider>
      </Layout>
    </>
  );
};
