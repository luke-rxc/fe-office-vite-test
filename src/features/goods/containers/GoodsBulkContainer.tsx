import React from 'react';
import { Layout } from '@components/Layout';
import { FormProvider } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { BulkSearchForm, BulkSearchList, BulkUploadModal, BulkUploadErrorModal } from '../components/bulk';
import { useBulkListSearchService, useBulkExcelUploadService } from '../services/bulk';

export const GoodsBulkContainer: React.FC = () => {
  const {
    formMethod,
    handleReset,
    handleCancelList,
    handleSearchSubmit,
    handleListRefresh,
    isBaseResrcLoading,
    brandListOptions,
    providerListOptions,
    isSearchLoading,
    searchLists,
    pagination,
    rowSelection,
  } = useBulkListSearchService();

  const {
    formMethod: bulkUploadFormMethod,
    isOpenUploadModal,
    registeredExcelFileName,
    uploadErrorModal,
    handleCloseUploadErrorModal,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleExcelUploadSubmit,
    handleExcelUpload,
  } = useBulkExcelUploadService({
    onListRefresh: handleListRefresh,
  });

  if (isBaseResrcLoading) {
    return null;
  }
  return (
    <>
      <Layout
        title="수정 목록 조회"
        locations={[{ path: '/', text: '홈' }, { path: '/bulk', text: '상품 일괄수정' }, { text: '수정 목록 조회' }]}
      >
        <FormProvider {...formMethod}>
          <BulkSearchForm
            brandListOptions={brandListOptions}
            providerListOptions={providerListOptions}
            onReset={handleReset}
            onSubmit={handleSearchSubmit}
          />
        </FormProvider>
        <Box sx={{ p: 3 }} />
        <BulkSearchList
          isLoading={isSearchLoading}
          searchLists={searchLists}
          pagination={pagination}
          rowSelection={rowSelection}
          onCancelList={handleCancelList}
          onOpenUploadModal={handleOpenUploadModal}
        />
      </Layout>
      <FormProvider {...bulkUploadFormMethod}>
        <BulkUploadModal
          isOpen={isOpenUploadModal}
          registeredExcelFileName={registeredExcelFileName}
          onCloseModal={handleCloseUploadModal}
          onSubmit={handleExcelUploadSubmit}
          onExcelUpload={handleExcelUpload}
        />
      </FormProvider>
      {uploadErrorModal && <BulkUploadErrorModal {...uploadErrorModal} onCloseModal={handleCloseUploadErrorModal} />}
    </>
  );
};
