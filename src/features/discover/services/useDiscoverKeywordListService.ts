import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { useEffect, useState } from 'react';
import { KEYWORD_DEFAULT_LIMIT, KEYWORD_DEFAULT_PAGE, DiscoverKeywordStatus } from '../constants';
import { useDiscoverKeywordListQuery } from '../hooks';
import { useDiscoverKeywordPagination } from '../hooks/useDiscoverKeywordPagination';
import { toDiscoverKeywordSearchParams } from '../models';
import { DiscoverKeywordQueryState } from '../types';

/**
 * 디스커버 키워드 리스트 service
 */
export const useDiscoverKeywordListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const { queryState, updateQueryState } = useQueryState<DiscoverKeywordQueryState>({
    page: KEYWORD_DEFAULT_PAGE,
    limit: KEYWORD_DEFAULT_LIMIT,
  });
  const [keywordSearchStatus, setKeywordSearchStatus] = useState<DiscoverKeywordStatus>(DiscoverKeywordStatus.ALL);

  const { data: discoverKeywordItems, isLoading: isLoadingDiscoverKeywordItems } = useDiscoverKeywordListQuery(
    toDiscoverKeywordSearchParams(queryState, keywordSearchStatus),
    {
      refetchOnMount: true,
    },
  );
  const pagination = useDiscoverKeywordPagination({
    total: discoverKeywordItems?.totalElements ?? 0,
    queryState,
    updateQueryState,
  });

  useEffect(() => {
    if (isLoadingDiscoverKeywordItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDiscoverKeywordItems]);

  const handleUpdateKeywordSearchStatus = (status: DiscoverKeywordStatus) => {
    if (status !== keywordSearchStatus) {
      setKeywordSearchStatus(status);
      updateQueryState({
        ...queryState,
        page: KEYWORD_DEFAULT_PAGE.toString(),
      });
    }
  };

  return {
    discoverKeywordItems: discoverKeywordItems?.content ?? [],
    isLoading: isLoadingDiscoverKeywordItems,
    pagination,
    keywordSearchStatus,
    handleUpdateKeywordSearchStatus,
  };
};
