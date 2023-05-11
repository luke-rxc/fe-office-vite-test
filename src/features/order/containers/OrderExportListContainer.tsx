import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ExportActions, ExportList, ExportSearchForm } from '../components';
import { useOrderExportListService } from '../services';

export const OrderExportListContainer = () => {
  const { form, exportList, providerCombo, mdCombo, actions, isLoading, pagination, rowSelection } =
    useOrderExportListService();
  return (
    <Layout title="출고/배송 목록" locations={[{ path: '/', text: '홈' }, { text: '출고/배송 목록' }]}>
      <FormProvider {...form.formMethod}>
        <ExportSearchForm form={form} providerCombo={providerCombo} mdCombo={mdCombo} isManager={actions.isManager} />
      </FormProvider>
      <Box sx={{ p: '10px' }} />
      <ExportList
        items={exportList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
        actions={<ExportActions actions={actions} />}
      />
    </Layout>
  );
};
