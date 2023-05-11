import { PaginationProps } from '@components/table/Table';
import { BANNER_DEFAULT_LIMIT, BANNER_DEFAULT_PAGE } from '../constants';
import { DiscoverBannerQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  queryState: DiscoverBannerQueryState;
  updateQueryState: (newState: DiscoverBannerQueryState) => void;
}

export const useUnpublishedDiscoverBannerPagination = ({
  total,
  queryState,
  updateQueryState,
}: Props): PaginationProps => {
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
  };
};
