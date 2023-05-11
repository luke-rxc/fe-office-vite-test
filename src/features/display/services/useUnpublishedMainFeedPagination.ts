import { PaginationProps } from '@components/table/Table';
import { FEED_DEFAULT_LIMIT, FEED_DEFAULT_PAGE } from '../constants';
import { MainFeedQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  queryState: MainFeedQueryState;
  updateQueryState: (newState: MainFeedQueryState) => void;
}

export const useUnpublishedMainFeedPagination = ({ total, queryState, updateQueryState }: Props) => {
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: String(page),
      limit: String(limit),
    });
  };

  return {
    limit: Number(queryState.limit ?? FEED_DEFAULT_LIMIT),
    page: Number(queryState.page ?? FEED_DEFAULT_PAGE),
    total,
    onChange: handleChangePagination,
    showFirstButton: true,
    showLastButton: true,
  };
};
