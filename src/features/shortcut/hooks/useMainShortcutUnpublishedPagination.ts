import { PaginationProps } from '@components/table/Table';
import { SHORTCUT_DEFAULT_LIMIT, SHORTCUT_DEFAULT_PAGE } from '../constants';
import { MainShortcutQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  queryState: MainShortcutQueryState;
  updateQueryState: (newState: MainShortcutQueryState) => void;
}

export const useMainShortcutUnpublishedPagination = ({
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
    limit: Number(queryState.limit ?? SHORTCUT_DEFAULT_LIMIT),
    page: Number(queryState.page ?? SHORTCUT_DEFAULT_PAGE),
    total,
    onChange: handleChangePagination,
  };
};
