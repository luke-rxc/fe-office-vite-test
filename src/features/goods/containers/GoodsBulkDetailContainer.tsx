import React from 'react';
import { Layout } from '@components/Layout';
import { useBulkDetailService } from '../services/bulk';
import { BulkDetailTable } from '../components/bulk';

interface Props {
  id: string;
}

export const GoodsBulkDetailContainer: React.FC<Props> = ({ id }) => {
  const { isPageLoading, bulkDetailInfo, bookDetailTable, bulkDetailType } = useBulkDetailService({ id });

  if (isPageLoading || !bulkDetailInfo || !bookDetailTable) {
    return null;
  }

  return (
    <>
      <Layout
        title="수정 내역 상세"
        locations={[{ path: '/', text: '홈' }, { path: '/bulk', text: '상품 일괄수정' }, { text: '수정 내역 상세' }]}
      >
        <BulkDetailTable
          type={bulkDetailType}
          tableColumns={bookDetailTable}
          list={bulkDetailInfo.goods ?? bulkDetailInfo.option ?? []}
        />
      </Layout>
    </>
  );
};
