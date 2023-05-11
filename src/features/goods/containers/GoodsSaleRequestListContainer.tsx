import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Box, Divider, Card, Tab, Tabs, Grid, Button } from '@material-ui/core';
import { Layout } from '@components/Layout';
import { SaleRequestSearchForm, SaleRequestOptionModal } from '../components/saleRequest';
import { useSaleRequestListSearchService } from '../services/saleRequest';
import { SaleRequestTabs, SaleRequestType, SaleRequestMessage } from '../constants';
import { SaleRequestListModel, SaleRequestModifyListModel, SaleRequestRejectListModel } from '../models';
import {
  SaleRequestSaleList,
  SaleRequestModifyList,
  SaleRequestRejectList,
  SaleRequestDialog,
} from '../components/saleRequest';

export const GoodsSaleRequestListContainer: React.FC = () => {
  // dialog message
  const { DIALOG: SaleRequestDialogMessage } = SaleRequestMessage;

  const {
    methods,
    isSearchLoading,
    searchLists,
    pagination,
    rowSelection,
    brandListOptions,
    providerListOptions,
    mdListOptions,
    managerListOptions,
    isBaseSourceLoading,
    handleSearchSubmit,
    handleReset,
    handleDatePreset,

    // tab
    currentTab,
    handleTabsChange,

    // option
    handleOptionOpen,
    handleOptionClose,
    selectOptionRequestId,
    optionLists,
    isOptionLoading,

    // Approval
    handleApproval,

    // reject
    handleReject,
    handleRejectOpen,
    handleRejectClose,
    isRejectDialogOpen,
  } = useSaleRequestListSearchService();

  if (isBaseSourceLoading) {
    return null;
  }

  // console.log('searchLists', searchLists, isSearchLoading);
  // console.log('optionLists', optionLists, isOptionLoading);

  return (
    <Layout
      title="검수 상품 관리"
      locations={[
        { path: '/', text: '홈' },
        { path: '/sale-request', text: '검수 상품 관리' },
      ]}
    >
      <FormProvider {...methods}>
        <SaleRequestSearchForm
          methods={methods}
          brandListOptions={brandListOptions}
          providerListOptions={providerListOptions}
          mdListOptions={mdListOptions}
          managerListOptions={managerListOptions}
          onSubmit={handleSearchSubmit}
          onReset={handleReset}
          onDatePreset={handleDatePreset}
        />
      </FormProvider>
      <Card
        sx={{
          backgroundColor: 'background.paper',
          minHeight: '500px',
          p: 3,
          mt: 3,
        }}
      >
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {SaleRequestTabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Grid>
          {currentTab !== SaleRequestType.REJECT && (
            <Grid item md={6} xs={12} display="flex" justifyContent="flex-end">
              <Button color="primary" variant="contained" sx={{ width: 100 }} onClick={handleApproval}>
                승인
              </Button>
              <Button color="secondary" variant="contained" sx={{ ml: 1, width: 100 }} onClick={handleRejectOpen}>
                반려
              </Button>
            </Grid>
          )}
        </Grid>
        <Divider />
        {(isSearchLoading || searchLists) && (
          <Box sx={{ mt: 3 }}>
            {currentTab === SaleRequestType.SALE && (
              <SaleRequestSaleList
                isLoading={isSearchLoading}
                searchLists={searchLists as SaleRequestListModel[]}
                pagination={pagination}
                rowSelection={rowSelection}
                onOptionOpen={handleOptionOpen}
              />
            )}
            {currentTab === SaleRequestType.MODIFY && (
              <SaleRequestModifyList
                isLoading={isSearchLoading}
                searchLists={searchLists as SaleRequestModifyListModel[]}
                pagination={pagination}
                rowSelection={rowSelection}
                onOptionOpen={handleOptionOpen}
              />
            )}
            {currentTab === SaleRequestType.REJECT && (
              <SaleRequestRejectList
                isLoading={isSearchLoading}
                searchLists={searchLists as SaleRequestRejectListModel[]}
                pagination={pagination}
              />
            )}
          </Box>
        )}
      </Card>
      {/* Option Modal */}
      {(isOptionLoading || optionLists) && (
        <SaleRequestOptionModal
          isOpen={!!selectOptionRequestId}
          isOptionLoading={isOptionLoading}
          optionLists={optionLists}
          onClose={handleOptionClose}
        />
      )}

      {/* 반려요청시 Dialog */}
      <SaleRequestDialog
        isOpen={isRejectDialogOpen}
        title={SaleRequestDialogMessage.REJECT.TITLE}
        placeholder={SaleRequestDialogMessage.REJECT.PLACEHOLDER}
        onClose={handleRejectClose}
        onConfirm={handleReject}
      />
    </Layout>
  );
};
