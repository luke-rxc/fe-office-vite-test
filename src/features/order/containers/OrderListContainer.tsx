import { Layout } from '@components/Layout';
import { Box } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { OrderList, OrderSearchForm, OrderActions } from '../components';
import { useOrderListService } from '../services';

export const OrderListContainer = () => {
  const { form, orderList, providerCombo, mdCombo, brandCombo, isLoading, pagination, rowSelection, action } =
    useOrderListService();

  return (
    <Layout title="주문 조회/관리" locations={[{ path: '/', text: '홈' }, { text: '주문' }]}>
      <FormProvider {...form.formMethod}>
        <OrderSearchForm form={form} providerCombo={providerCombo} mdCombo={mdCombo} brandCombo={brandCombo} />
      </FormProvider>
      <Box sx={{ p: '10px' }} />
      <OrderList
        items={orderList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
        actions={<OrderActions action={action} isExistSelection={rowSelection.selectedRowKeys.length > 0} />}
      />
    </Layout>
  );
};
