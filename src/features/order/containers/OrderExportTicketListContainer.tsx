import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import {
  ExportTicketBulkStatusModal,
  ExportTicketActions,
  ExportTicketList,
  ExportTicketSearchForm,
  ExportTicketBulkStatusResult,
} from '../components';
import { ExportTicketBulkBookingDateModal } from '../components/exportTicketList/ExportTicketBulkBookingDateModal';
import { ExportTicketBulkBookingDateResult } from '../components/exportTicketList/ExportTicketBulkBookingDateResult';
import {
  useOrderExportBulkBookingDateService,
  useOrderExportBulkStatusService,
  useOrderExportTicketListService,
} from '../services';

export const OrderExportTicketListContainer = () => {
  const {
    form,
    exportTicketList,
    providerCombo,
    mdCombo,
    ticketCombo,
    actions,
    isLoading,
    pagination,
    rowSelection,
    reloadExportTicketList,
  } = useOrderExportTicketListService();

  const { orderExportTicketBulkStatusSummary, handleOpenStatusChangeUploadModal, ...bulkStatusModal } =
    useOrderExportBulkStatusService({ reloadExportTicketList });

  const {
    orderExportTicketBulkBookingDateSummary,
    handleOpenModal: handleOpenBookingDateChangeUploadModal,
    ...bulkBookingDateModal
  } = useOrderExportBulkBookingDateService({ reloadExportTicketList });
  return (
    <>
      <Layout title="출고(티켓) 목록" locations={[{ path: '/', text: '홈' }, { text: '출고(티켓) 목록' }]}>
        <FormProvider {...form.formMethod}>
          <ExportTicketSearchForm
            form={form}
            providerCombo={providerCombo}
            mdCombo={mdCombo}
            ticketCombo={ticketCombo}
          />
        </FormProvider>
        <Box sx={{ p: '10px' }} />
        <ExportTicketList
          items={exportTicketList}
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
          actions={
            <ExportTicketActions
              actions={actions}
              onOpenStatusChangeUploadModal={handleOpenStatusChangeUploadModal}
              onOpenBookingDateChangeUploadModal={handleOpenBookingDateChangeUploadModal}
            />
          }
        />
      </Layout>
      <ExportTicketBulkStatusModal {...bulkStatusModal}>
        <ExportTicketBulkStatusResult orderExportTicketBulkStatusSummary={orderExportTicketBulkStatusSummary} />
      </ExportTicketBulkStatusModal>
      <ExportTicketBulkBookingDateModal {...bulkBookingDateModal}>
        <ExportTicketBulkBookingDateResult
          orderExportTicketBulkBookingDateSummary={orderExportTicketBulkBookingDateSummary}
        />
      </ExportTicketBulkBookingDateModal>
    </>
  );
};
