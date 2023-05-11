import { PaginationProps } from '@components/table/Table';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { useMemo } from 'react';
import { DiscoverFeedDisplayGroupType, FEED_DEFAULT_LIMIT, FEED_DEFAULT_PAGE } from '../constants';
import { DiscoverFeedDisplayGroupModel } from '../models';
import { DiscoverFeedPaginationProps, DiscoverFeedQueryState } from '../types';

interface Props extends Partial<PaginationProps> {
  discoverFeedDisplayGroupItems: PaginationResponse<DiscoverFeedDisplayGroupModel>;
  discoverFeedStopDisplayGroupItems: PaginationResponse<DiscoverFeedDisplayGroupModel>;
  queryState: DiscoverFeedQueryState;
  updateQueryState: (newState: DiscoverFeedQueryState) => void;
}

/**
 * 디스커버 피드 전시그룹 pagination hook
 */
export const useDiscoverFeedDisplayGroupPagination = ({
  total,
  discoverFeedDisplayGroupItems,
  discoverFeedStopDisplayGroupItems,
  queryState,
  updateQueryState,
}: Props): DiscoverFeedPaginationProps => {
  const { type = DiscoverFeedDisplayGroupType.ENABLED, page = '1' } = queryState;
  /**
   * 현재 전시그룹 페이지 이동
   */
  const handleChangeViewActiveDisplayGroupPagination = () => {
    updateQueryState({
      ...queryState,
      page: String(FEED_DEFAULT_PAGE),
      type: DiscoverFeedDisplayGroupType.ENABLED,
    });
  };

  /**
   * 이전 전시그룹 페이지 이동
   *
   * 활성화 type일 경우 page-1, 비활성화 type일 경우 page+1
   */
  const handleChangePrevPagination = () => {
    if (type === DiscoverFeedDisplayGroupType.ENABLED) {
      if (page === '1') {
        updateQueryState({
          ...queryState,
          page: String(page),
          type: DiscoverFeedDisplayGroupType.DISABLED,
        });
      } else {
        updateQueryState({
          ...queryState,
          page: (Number(page) - 1).toString(),
        });
      }
    } else {
      updateQueryState({
        ...queryState,
        page: (Number(page) + 1).toString(),
      });
    }
  };

  /**
   * 다음 전시그룹 페이지 이동
   *
   * 활성화 type일 경우 page+1, 비활성화 type일 경우 page11
   */
  const handleChangeNextPagination = () => {
    if (type === DiscoverFeedDisplayGroupType.DISABLED) {
      if (page === '1') {
        updateQueryState({
          ...queryState,
          page: String(page),
          type: DiscoverFeedDisplayGroupType.ENABLED,
        });
      } else {
        updateQueryState({
          ...queryState,
          page: (Number(page) - 1).toString(),
        });
      }
    } else {
      updateQueryState({
        ...queryState,
        page: (Number(page) + 1).toString(),
      });
    }
  };

  /**
   * 이전 페이지 전환 가능여부
   */
  const enabledPrev = useMemo(() => {
    if (type === DiscoverFeedDisplayGroupType.ENABLED) {
      if (Number(page) > 1) {
        return true;
      } else if ((discoverFeedStopDisplayGroupItems?.totalPages ?? 0) > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return (discoverFeedStopDisplayGroupItems?.totalPages ?? 0) > Number(page);
    }
  }, [discoverFeedStopDisplayGroupItems?.totalPages, page, type]);

  /**
   * 다음 페이지 전환 가능여부
   */
  const enabledNext = useMemo(() => {
    if (type === DiscoverFeedDisplayGroupType.DISABLED) {
      if (Number(page) > 1) {
        return true;
      } else if ((discoverFeedDisplayGroupItems?.totalPages ?? 0) > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return (discoverFeedDisplayGroupItems?.totalPages ?? 0) > Number(page);
    }
  }, [discoverFeedDisplayGroupItems?.totalPages, page, type]);

  return {
    limit: Number(queryState.limit ?? FEED_DEFAULT_LIMIT),
    page: Number(queryState.page ?? FEED_DEFAULT_PAGE),
    total,
    onCurrent: handleChangeViewActiveDisplayGroupPagination,
    enabledPrev,
    enabledNext,
    onPrev: handleChangePrevPagination,
    onNext: handleChangeNextPagination,
  };
};
