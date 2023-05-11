import { Layout } from '@components/Layout';
import { SettlementPageLocation } from '../constants';
import { useSettlementListService } from '../services';
import { SettlementList, SettlementSearch } from '../components';

/** only manager - 정산 목록 페이지 */
export const SettlementListContainer = (): JSX.Element => {
  const {
    list,
    total,
    isLoading,
    formMethods,
    formOptions,
    handleSearch,
    handleSearchFormReset,
    handleChangePagination,
    handleSettlementExecute,
  } = useSettlementListService();

  return (
    <Layout {...SettlementPageLocation}>
      <SettlementSearch
        formMethods={formMethods}
        formOptions={formOptions}
        onReset={handleSearchFormReset}
        onSearch={handleSearch}
      />
      <SettlementList
        items={list}
        total={total}
        isLoading={isLoading}
        page={formMethods.getValues('page')}
        size={formMethods.getValues('size')}
        onChangePage={handleChangePagination}
        onSettlement={handleSettlementExecute}
      />
    </Layout>
  );
};
