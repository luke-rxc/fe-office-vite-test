import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import useLoading from '@hooks/useLoading';
import { PartnerSearchForm, PartnerSearchList, ListLayout } from '../components/list';
import { usePartnerListSearchService } from '../services/list';

export const PartnerGoodsListContainer: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();

  /** goods list search */
  const {
    isSearchLoading,
    searchLists = [],
    pagination,
    rowSelection,
    methods,
    brandListOptions,
    // base Source Loading
    isBaseSourceLoading,
    handleSearchSubmit,
    handleAllListExport,
    handleDuplicateTableList,
    handleDeleteTableList,
    handleReset,
    handleSaleRequest,
    handleDatePreset,
  } = usePartnerListSearchService();

  useEffect(() => {
    isSearchLoading ? showLoading() : hideLoading();
  }, [isSearchLoading, showLoading, hideLoading]);

  if (isBaseSourceLoading) {
    return null;
  }

  return (
    <ListLayout>
      <Box sx={{ mt: 3 }}>
        <PartnerSearchForm
          methods={methods}
          brandListOptions={brandListOptions}
          onSubmit={handleSearchSubmit}
          onReset={handleReset}
          onDatePreset={handleDatePreset}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <PartnerSearchList
          lists={searchLists}
          pagination={pagination}
          rowSelection={rowSelection}
          onAllListExport={handleAllListExport}
          onDeleteTableList={handleDeleteTableList}
          onDuplicateTableList={handleDuplicateTableList}
          onSaleRequest={handleSaleRequest}
        />
      </Box>
    </ListLayout>
  );
};
