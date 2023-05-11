import React, { forwardRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { DetailSubmit } from '../components/detail';
import { DetailTemp } from '../components/detailTemp';
import { useCreateService, useDetailTabService } from '../services/detail';
import { useLogger, usePageType } from '../hooks';
import { PageLoadStatus } from '../constants';
// Container
import { DetailProviderContainer } from './DetailProviderContainer';
import { DetailBaseContainer } from './DetailBaseContainer';
import { DetailOptionContainer } from './DetailOptionContainer';
import { DetailNoticeContainer } from './DetailNoticeContainer';
import { DetailMediaContainer } from './DetailMediaContainer';
import { DetailDeliveryContainer } from './DetailDeliveryContainer';

export const GoodsCreateContainer: React.FC = () => {
  const { type: pageType, isPartnerSite } = usePageType();

  // tab
  const { elementsRefs } = useDetailTabService();
  const { baseRef, mediaRef, optionRef, noticeRef, deliveryTabRef } = elementsRefs;

  // detail
  const {
    methods,
    pageLoadState,
    selectedGoodsKind,
    temporaryList,
    tempListItem,
    isTempListLoadStatus,
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
    selectedCommission,
    handleUpdateCommission,
    handleSelectProvider,
    handleSaveTemporary,
    handleLoadTemporaryList,
    handleDeleteTempMutate,
    handleSelectTicketAgent,
    handleSelectTicketAgentGroup,
    handleSelectTicketInfo,
    handleChangeGoodsKind,
    handleSaveSubmit,
    handleDebug,
  } = useCreateService();

  useLogger('[[[GoodsCreateContainer]]]');

  if (pageLoadState === PageLoadStatus.LOADING) {
    return null;
  }

  return (
    <Layout title="상품 등록" locations={[{ path: '/', text: '홈' }, { text: '상품 관리' }, { text: '상품 등록' }]}>
      <>
        <FormProvider {...methods}>
          <form>
            <SectionBox>
              <DetailTemp
                temporaryList={temporaryList}
                onLoadTemporaryList={handleLoadTemporaryList}
                onDeleteTemporary={handleDeleteTempMutate}
              />
            </SectionBox>
            <SectionBox isView={!isPartnerSite}>
              <DetailProviderContainer
                providerInfo={selectedProviderInfo}
                providerListOptions={providerListOptions}
                mdListOptions={mdListOptions}
                initMdId={tempListItem?.adminMdId}
                managerListOptions={managerListOptions}
                initManagerId={tempListItem?.adminGoodsManagerId}
                onSelectProvider={handleSelectProvider}
              />
            </SectionBox>
            <SectionBox ref={baseRef}>
              <DetailBaseContainer
                initCategoryItemInfos={tempListItem?.categories}
                initKcFileList={tempListItem?.kcFileList}
                initCertFileList={tempListItem?.certificationList}
                initTicket={tempListItem?.ticket}
                providerInfo={selectedProviderInfo}
                keywordListOptions={keywordListOptions}
                ticketNormalListOptions={ticketNormalListOptions}
                ticketAgentListOptions={ticketAgentListOptions}
                ticketAgentGroupListOptions={ticketAgentGroupListOptions}
                selectedGoodsKind={selectedGoodsKind}
                selectedTicketInfo={selectedTicketInfo}
                isTempListLoadStatus={isTempListLoadStatus}
                onSelectTicketAgent={handleSelectTicketAgent}
                onSelectTicketAgentGroup={handleSelectTicketAgentGroup}
                onSelectTicketInfo={handleSelectTicketInfo}
                onChangeGoodsKind={handleChangeGoodsKind}
                onUpdateCommission={handleUpdateCommission}
              />
            </SectionBox>
            <SectionBox ref={optionRef}>
              <DetailOptionContainer
                ticketAgentId={selectedTicketAgentId}
                ticketAgentList={selectedTicketAgentList}
                selectedGoodsKind={selectedGoodsKind}
                selectedTicketInfo={selectedTicketInfo}
                initOptionTitles={tempListItem?.optionTitles}
                initOptionLists={tempListItem?.optionLists}
                isTempListLoadStatus={isTempListLoadStatus}
                selectedCommission={selectedCommission}
              />
            </SectionBox>
            <SectionBox ref={noticeRef}>
              <DetailNoticeContainer />
            </SectionBox>
            <SectionBox ref={mediaRef}>
              <DetailMediaContainer
                initMainImage={tempListItem?.primaryImage}
                initSubImages={tempListItem?.subMediaFiles}
                initComponents={tempListItem?.components}
              />
            </SectionBox>
            <SectionBox ref={deliveryTabRef}>
              <DetailDeliveryContainer
                providerInfo={selectedProviderInfo}
                selectedGoodsKind={selectedGoodsKind}
                initProviderShippingId={tempListItem?.providerShippingId}
                initDeliveryTodayEndTime={tempListItem?.deliveryPolicy?.deliveryTodayEndTime}
              />
            </SectionBox>
            <DetailSubmit
              pageType={pageType}
              onTempSave={handleSaveTemporary}
              onDebug={handleDebug}
              onSubmit={handleSaveSubmit}
            />
          </form>
        </FormProvider>
      </>
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
