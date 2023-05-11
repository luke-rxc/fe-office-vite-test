import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  OrderList,
  OrderExportPrepareSearchForm,
  OrderExportPrepareActions,
  OrderBulkExportModal,
  OrderBulkExportResult,
} from '../components';
import { useOrderExportPrepareListService } from '../services';
import { useOrderBulkExportService } from '../services/useOrderBulkExportService';

/**
 * 송장 등록 대기 container
 */
export const OrderExportPrepareListContainer = () => {
  const {
    form,
    orderList,
    providerCombo,
    mdCombo,
    brandCombo,
    isLoading,
    pagination,
    rowSelection,
    action,
    openExportModal,
  } = useOrderExportPrepareListService();

  const {
    orderExportSummary,
    handleDownloadDeliveryCompanies,
    handleDownloadExportableItems,
    handleUploadExportExcelData,
    handleCloseOrderExportModel,
  } = useOrderBulkExportService({
    selectedRowKeys: rowSelection.selectedRowKeys,
    onCloseBulkExportModal: action.handleCloseOrderExportModel,
    onReloadOrderList: action.handleReloadOrderList,
  });
  return (
    <>
      <Layout title="송장 등록 대기" locations={[{ path: '/', text: '홈' }, { text: '송장 등록 대기' }]}>
        <FormProvider {...form.formMethod}>
          <OrderExportPrepareSearchForm
            form={form}
            providerCombo={providerCombo}
            mdCombo={mdCombo}
            brandCombo={brandCombo}
          />
        </FormProvider>
        <Box sx={{ p: '10px' }} />
        <OrderList
          items={orderList}
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
          actions={
            <OrderExportPrepareActions
              action={action}
              isExistSelection={rowSelection.selectedRowKeys.length > 0}
              onDownloadExportableItems={handleDownloadExportableItems}
            />
          }
        />
      </Layout>
      <OrderBulkExportModal
        open={openExportModal}
        onDownloadDeliveryCompanies={handleDownloadDeliveryCompanies}
        onUploadExportExcelData={handleUploadExportExcelData}
        onCloseOrderExportModel={handleCloseOrderExportModel}
      >
        <OrderBulkExportResult orderExportSummary={orderExportSummary} />
      </OrderBulkExportModal>
    </>
  );
};
