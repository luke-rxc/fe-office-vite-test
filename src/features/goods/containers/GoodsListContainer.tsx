import { useEffect } from 'react';
import { Box } from '@material-ui/core';
import useLoading from '@hooks/useLoading';
import { ManagerSearchForm, ManagerSearchList, ManagerSearchBulkModal, ListLayout } from '../components/list';
import { useManagerListSearchService } from '../services/list';

export const GoodsListContainer: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();

  /** goods list search */
  const {
    isSearchLoading,
    searchLists = [],
    pagination,
    rowSelection,
    methods,
    brandListOptions,
    providerListOptions,
    keywordListOptions,
    // base Source Loading
    isBaseSourceLoading,
    bulk: {
      isBulkModalOpen,
      isBulkDownloading,
      bulkCbList,
      bulkHeaderEntries,
      handleBulkExcelDownload,
      handleBulkModalOpen,
      handleBulkModalClose,
    },
    handleSearchSubmit,
    handleAllListExport,
    handleDuplicateTableList,
    handleDeleteTableList,
    handleReset,
    handleDatePreset,
    /* categoryInfos,
    handleChangeCategory, */
  } = useManagerListSearchService();

  useEffect(() => {
    isSearchLoading ? showLoading() : hideLoading();
  }, [isSearchLoading, showLoading, hideLoading]);

  if (isBaseSourceLoading) {
    return null;
  }

  return (
    <ListLayout>
      <Box sx={{ mt: 3 }}>
        <ManagerSearchForm
          methods={methods}
          brandListOptions={brandListOptions}
          providerListOptions={providerListOptions}
          keywordListOptions={keywordListOptions}
          onSubmit={handleSearchSubmit}
          onReset={handleReset}
          onDatePreset={handleDatePreset}
          /* categoryInfos={categoryInfos}
            onChangeCategory={handleChangeCategory} */
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <ManagerSearchList
          lists={searchLists}
          pagination={pagination}
          rowSelection={rowSelection}
          onAllListExport={handleAllListExport}
          onDeleteTableList={handleDeleteTableList}
          onDuplicateTableList={handleDuplicateTableList}
          onBulkModalOpen={handleBulkModalOpen}
        />
      </Box>
      {bulkCbList && bulkHeaderEntries && (
        <ManagerSearchBulkModal
          isBulkModalOpen={isBulkModalOpen}
          isBulkDownloading={isBulkDownloading}
          bulkCbList={bulkCbList}
          bulkHeaderEntries={bulkHeaderEntries}
          onBulkModalClose={handleBulkModalClose}
          onBulkExcelDownload={handleBulkExcelDownload}
        />
      )}
    </ListLayout>
  );
};
