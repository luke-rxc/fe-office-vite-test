import { PaginationProps } from '@components/table/Table';
import { useState } from 'react';
import { SECTION_DEFAULT_LIMIT, SECTION_DEFAULT_PAGE } from '../constants';

/**
 * 디스커버 섹션타입별 리스트 pagination hook
 */
export const useDiscoverSectionTypeListPagination = (): PaginationProps => {
  const [page, setPage] = useState<number>(SECTION_DEFAULT_PAGE);
  const [limit, setLimit] = useState<number>(SECTION_DEFAULT_LIMIT);

  const handleChangePagination = (pageNumber: number, limitCount: number) => {
    page !== pageNumber && setPage(pageNumber);
    limit !== limitCount && setLimit(limitCount);
  };

  return {
    limit,
    page,
    total: 0,
    onChange: handleChangePagination,
  };
};
