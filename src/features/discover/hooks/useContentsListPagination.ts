import { PaginationProps } from '@components/table/Table';
import { useState } from 'react';
import { CONTENTS_DEFAULT_PAGE, CONTENTS_DEFAULT_LIMIT } from '../constants';

interface Props extends Partial<PaginationProps> {
  onChangePagination: (page: number, size: number) => void;
}

interface ReturnPagination extends PaginationProps {
  initPagination: () => void;
  onUpdatePage: (changePage: number) => void;
}

/**
 * 콘텐츠 리스트 pagination hook
 */
export const useContentsListPagination = ({ total, onChangePagination }: Props): ReturnPagination => {
  const [page, setPage] = useState<number>(CONTENTS_DEFAULT_PAGE);
  const [limit, setLimit] = useState<number>(CONTENTS_DEFAULT_LIMIT);

  const handleChangePagination = (changePage: number, changeLimit: number) => {
    page !== changePage && setPage(changePage);
    limit !== changeLimit && setLimit(changeLimit);
    onChangePagination(changePage, changeLimit);
  };

  const initPagination = () => {
    setPage(CONTENTS_DEFAULT_PAGE);
    setLimit(CONTENTS_DEFAULT_LIMIT);
  };

  const handleUpdatePage = (changePage: number) => {
    page !== changePage && setPage(changePage);
  };

  return {
    limit,
    page,
    total,
    onChange: handleChangePagination,
    onUpdatePage: handleUpdatePage,
    initPagination,
  };
};
