import { forwardRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { DetailSubmit, DetailRequestLog } from '../components/detail';
import { SaleRequestDialog } from '../components/saleRequest';
import { useModifyService, useDetailTabService } from '../services/detail';
import { usePageType } from '../hooks';
import { SaleRequestMessage } from '../constants';
// Container
import { DetailProviderContainer } from './DetailProviderContainer';
import { DetailBaseContainer } from './DetailBaseContainer';
import { DetailOptionContainer } from './DetailOptionContainer';
import { DetailNoticeContainer } from './DetailNoticeContainer';
import { DetailMediaContainer } from './DetailMediaContainer';
import { DetailDeliveryContainer } from './DetailDeliveryContainer';

export const GoodsModifyContainer: React.FC = () => {
  const { type: pageType, isPartnerSite } = usePageType();

  // tab
  const { elementsRefs } = useDetailTabService();
  const { baseRef, mediaRef, optionRef, noticeRef, deliveryTabRef } = elementsRefs;

  // dialog message
  const { DIALOG: SaleRequestDialogMessage } = SaleRequestMessage;

  // detail
  const {
    methods,
    isContentLoaded,
    selectedGoodsKind,
    detailListItem,
    mdListOptions,
    managerListOptions,
    keywordListOptions,
    providerListOptions,
    selectedProviderInfo,
    ticketNormalListOptions,
    ticketAgentListOptions,
    ticketAgentGroupListOptions,
    selectedTicketAgentId,
    selectedTicketAgentList,
    selectedTicketInfo,
    requestLogItem,
    selectedCommission,
    handleUpdateCommission,
    handleSelectTicketAgent,
    handleSelectTicketAgentGroup,
    handleSelectTicketInfo,
    handleSelectProvider,
    handleSaveSubmit,
    handleDebug,
    handlePartnerSaleRequest,
    handleManagerApproval,
    partnerRequestMemoDialog: { isModifyRequestDialogOpen, handleModifyRequestDialogClose, handleModifyRequest },
    managerRejectMemoDialog: {
      isRejectDialogOpen,
      handleManagerRejectDialogClose,
      handleManagerRejectDialogOpen,
      handleManagerReject,
    },
  } = useModifyService();

  if (!isContentLoaded) {
    return null;
  }

  return (
    <Layout title="상품 수정" locations={[{ path: '/', text: '홈' }, { text: '상품 관리' }, { text: '상품 수정' }]}>
      <FormProvider {...methods}>
        <form>
          <SectionBox>
            <DetailRequestLog logs={requestLogItem} />
          </SectionBox>
          <SectionBox isView={!isPartnerSite}>
            <DetailProviderContainer
              providerInfo={selectedProviderInfo}
              providerListOptions={providerListOptions}
              mdListOptions={mdListOptions}
              initMdId={detailListItem.adminMdId}
              managerListOptions={managerListOptions}
              initManagerId={detailListItem.adminGoodsManagerId}
              onSelectProvider={handleSelectProvider}
            />
          </SectionBox>
          <SectionBox ref={baseRef}>
            <DetailBaseContainer
              initCategoryItemInfos={detailListItem.categories}
              initKcFileList={detailListItem.kcFileList}
              initCertFileList={detailListItem.certificationList}
              initTicket={detailListItem.ticket}
              providerInfo={selectedProviderInfo}
              keywordListOptions={keywordListOptions}
              ticketNormalListOptions={ticketNormalListOptions}
              ticketAgentListOptions={ticketAgentListOptions}
              ticketAgentGroupListOptions={ticketAgentGroupListOptions}
              selectedGoodsKind={selectedGoodsKind}
              selectedTicketInfo={selectedTicketInfo}
              onSelectTicketAgent={handleSelectTicketAgent}
              onSelectTicketAgentGroup={handleSelectTicketAgentGroup}
              onSelectTicketInfo={handleSelectTicketInfo}
              onUpdateCommission={handleUpdateCommission}
            />
          </SectionBox>
          <SectionBox ref={optionRef}>
            <DetailOptionContainer
              ticketAgentId={selectedTicketAgentId}
              ticketAgentList={selectedTicketAgentList}
              selectedGoodsKind={selectedGoodsKind}
              selectedTicketInfo={selectedTicketInfo}
              initOptionTitles={detailListItem.optionTitles}
              initOptionLists={detailListItem.optionLists}
              selectedCommission={selectedCommission}
            />
          </SectionBox>
          <SectionBox ref={noticeRef}>
            <DetailNoticeContainer />
          </SectionBox>
          <SectionBox ref={mediaRef}>
            <DetailMediaContainer
              initMainImage={detailListItem.primaryImage}
              initSubImages={detailListItem.subMediaFiles}
              initComponents={detailListItem.components}
            />
          </SectionBox>
          <SectionBox ref={deliveryTabRef}>
            <DetailDeliveryContainer
              providerInfo={selectedProviderInfo}
              selectedGoodsKind={selectedGoodsKind}
              initProviderShippingId={detailListItem.providerShippingId}
              initDeliveryTodayEndTime={detailListItem.deliveryPolicy.deliveryTodayEndTime}
            />
          </SectionBox>
          <DetailSubmit
            pageType={pageType}
            onDebug={handleDebug}
            onSubmit={handleSaveSubmit}
            onPartnerSaleRequest={handlePartnerSaleRequest}
            onManagerApproval={handleManagerApproval}
            onManagerReject={handleManagerRejectDialogOpen}
            requestStatus={detailListItem.requestStatus}
            isPartnerSite={isPartnerSite}
          />
        </form>
      </FormProvider>

      {/* 파트너 : 수정 요청시 Dialog */}
      {isPartnerSite && (
        <SaleRequestDialog
          isOpen={isModifyRequestDialogOpen}
          title={SaleRequestDialogMessage.MODIFY.TITLE}
          placeholder={SaleRequestDialogMessage.MODIFY.PLACEHOLDER}
          description={SaleRequestDialogMessage.MODIFY.DESCRIPTION}
          onClose={handleModifyRequestDialogClose}
          onConfirm={handleModifyRequest}
        />
      )}

      {/* 매니저 : 반려 피드백 Dialog */}
      {!isPartnerSite && (
        <SaleRequestDialog
          isOpen={isRejectDialogOpen}
          title={SaleRequestDialogMessage.REJECT.TITLE}
          placeholder={SaleRequestDialogMessage.REJECT.PLACEHOLDER}
          onClose={handleManagerRejectDialogClose}
          onConfirm={handleManagerReject}
        />
      )}
    </Layout>
  );
};

const SectionBox = forwardRef(
  ({ children, isView = true }: { children: React.ReactNode | React.ReactNode[]; isView?: boolean }, ref) => {
    if (!isView) {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }} ref={ref}>
        {children}
      </Box>
    );
  },
);
