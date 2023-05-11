import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { OrderRefundActions, RefundList, RefundSearchForm } from '../components';
import { useOrderRefundListService } from '../services';

export const OrderRefundListContainer = () => {
  const { form, refundList, providerCombo, isLoading, pagination, rowSelection, action } = useOrderRefundListService();
  return (
    <Layout title="환불 목록" locations={[{ path: '/', text: '홈' }, { text: '주문' }]}>
      <FormProvider {...form.formMethod}>
        <RefundSearchForm form={form} providerCombo={providerCombo} />
      </FormProvider>
      <Box sx={{ p: '10px' }} />
      <RefundList
        actions={<OrderRefundActions action={action} />}
        items={refundList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
      />
    </Layout>
  );
};
