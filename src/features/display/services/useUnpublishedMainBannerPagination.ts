import { PaginationProps } from '@components/table/Table';
import { BANNER_DEFAULT_LIMIT, BANNER_DEFAULT_PAGE } from '../constants';
import { MainBannerQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  queryState: MainBannerQueryState;
  updateQueryState: (newState: MainBannerQueryState) => void;
}

export const useUnpublishedMainBannerPagination = ({ total, queryState, updateQueryState }: Props) => {
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: String(page),
      limit: String(limit),
    });
  };

  return {
    limit: Number(queryState.limit ?? BANNER_DEFAULT_LIMIT),
    page: Number(queryState.page ?? BANNER_DEFAULT_PAGE),
    total,
    onChange: handleChangePagination,
    showFirstButton: true,
    showLastButton: true,
  };
};
