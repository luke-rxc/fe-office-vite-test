import { useMemo } from 'react';
import { Layout } from '@components/Layout';
import { useProviderSettlementListService } from '../services';
import { SettlementPageLocation, ProviderSettlementLocation } from '../constants';
import { ProviderSettlementList, ProviderSettlementSearch } from '../components';

/** 입점사별 정산 목록 페이지 */
export const ProviderSettlementListContainer = (): JSX.Element => {
  const {
    list,
    total,
    isLoading,
    isManager,
    formMethods,
    formOptions,
    checkboxIds,
    handleSearch,
    handleResetSearchForm,
    handleChangePagination,
    handleChangeCheckboxIds,
    handleSettlementReExecute,
    handlePaidPrice,
    handlePublishTaxBill,
    handleExportExcel,
    handleAllExportExcel,
  } = useProviderSettlementListService();

  const location = useMemo(() => {
    return isManager ? ProviderSettlementLocation : SettlementPageLocation;
  }, [isManager]);

  return (
    <Layout {...location}>
      <ProviderSettlementSearch
        formMethods={formMethods}
        formOptions={formOptions}
        isManager={isManager}
        onSearch={handleSearch}
        onReset={handleResetSearchForm}
      />
      <ProviderSettlementList
        items={list}
        total={total}
        isLoading={isLoading}
        isManager={isManager}
        page={formMethods.getValues('page')}
        size={formMethods.getValues('size')}
        checkedItemsIds={checkboxIds}
        onPaid={handlePaidPrice}
        onAllExport={handleAllExportExcel}
        onChangePage={handleChangePagination}
        onDetailExport={handleExportExcel}
        onResettlement={handleSettlementReExecute}
        onChangeCheckbox={handleChangeCheckboxIds}
        onTaxBillPublished={handlePublishTaxBill}
      />
    </Layout>
  );
};
