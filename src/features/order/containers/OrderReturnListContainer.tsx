import { Layout } from '@components/Layout';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ReturnList, ReturnSearchForm } from '../components';
import { useOrderReturnListService } from '../services';
import Download from '@material-ui/icons/Download';

export const OrderReturnListContainer = () => {
  const { form, returnList, providerCombo, isLoading, isManager, pagination, rowSelection, handleDownloadExcel } =
    useOrderReturnListService();
  return (
    <Layout title="반품/교환 목록" locations={[{ path: '/', text: '홈' }, { text: '주문' }]}>
      <FormProvider {...form.formMethod}>
        <ReturnSearchForm form={form} providerCombo={providerCombo} />
      </FormProvider>
      <Box sx={{ p: '10px' }} />
      <ReturnList
        actions={
          isManager ? (
            <Button
              type="button"
              variant="outlined"
              onClick={handleDownloadExcel}
              startIcon={<Download />}
              disabled={returnList.length === 0}
              sx={{ ml: '10px' }}
            >
              엑셀 전체 다운로드 (검색결과)
            </Button>
          ) : null
        }
        items={returnList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
      />
    </Layout>
  );
};
