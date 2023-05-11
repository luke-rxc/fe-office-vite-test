import { PaginationProps } from '@components/table/Table';
import { KEYWORD_DEFAULT_LIMIT, KEYWORD_DEFAULT_PAGE } from '../constants';
import { DiscoverKeywordQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  queryState: DiscoverKeywordQueryState;
  updateQueryState: (newState: DiscoverKeywordQueryState) => void;
}

export const useDiscoverKeywordPagination = ({ total, queryState, updateQueryState }: Props): PaginationProps => {
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: String(page),
      limit: String(limit),
    });
  };

  return {
    limit: Number(queryState.limit ?? KEYWORD_DEFAULT_LIMIT),
    page: Number(queryState.page ?? KEYWORD_DEFAULT_PAGE),
    total,
    onChange: handleChangePagination,
  };
};
