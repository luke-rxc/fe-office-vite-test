import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DiscoverFeedDisplayGroupType } from '../constants';
import {
  useDiscoverFeedDisplayGroupListQuery,
  useDiscoverFeedDisplayGroupPagination,
  useDiscoverFeedStopDisplayGroupListQuery,
} from '../hooks';
import { DiscoverFeedQueryState, toDiscoverFeedDisplayGroupParams } from '../types';

export type ReturnTypeUseDiscoverFeedListService = ReturnType<typeof useDiscoverFeedListService>;

/**
 * 디스커버 피드 리스트 관련 service
 */
export const useDiscoverFeedListService = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [displayGroupType, setDisplayGroupType] = useState<DiscoverFeedDisplayGroupType>(
    DiscoverFeedDisplayGroupType.ENABLED,
  );
  const { queryState, updateQueryState } = useQueryState<DiscoverFeedQueryState>();

  useEffect(() => {
    const type = queryState.type ?? DiscoverFeedDisplayGroupType.ENABLED;
    setDisplayGroupType((prev) => {
      if (prev !== type) {
        return type as DiscoverFeedDisplayGroupType;
      }

      return prev;
    });
  }, [queryState]);

  const { data: discoverFeedDisplayGroupItems, isLoading: isLoadingDiscoverFeedDisplayGroupItems } =
    useDiscoverFeedDisplayGroupListQuery(
      toDiscoverFeedDisplayGroupParams(queryState, DiscoverFeedDisplayGroupType.ENABLED),
      { refetchOnMount: true },
    );
  const { data: discoverFeedStopDisplayGroupItems, isLoading: isLoadingDiscoverFeedStopDisplayGroupItems } =
    useDiscoverFeedStopDisplayGroupListQuery(
      toDiscoverFeedDisplayGroupParams(queryState, DiscoverFeedDisplayGroupType.DISABLED),
      discoverFeedDisplayGroupItems,
      { refetchOnMount: true },
    );

  const discoverFeedDisplayGroupPagination = useDiscoverFeedDisplayGroupPagination({
    total: discoverFeedDisplayGroupItems?.totalElements ?? 0,
    discoverFeedDisplayGroupItems,
    discoverFeedStopDisplayGroupItems,
    queryState,
    updateQueryState,
  });

  useEffect(() => {
    if (isLoadingDiscoverFeedDisplayGroupItems || isLoadingDiscoverFeedStopDisplayGroupItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDiscoverFeedDisplayGroupItems, isLoadingDiscoverFeedStopDisplayGroupItems]);

  /**
   * 전시그룹 생성 페이지 이동
   */
  const handleClickCreateDisplayGroup = (displayStartDate?: number) => {
    return () => {
      navigate(
        `/display/discover/feed/create${
          displayStartDate ? `?displayStartDate=${displayStartDate + 60 * 60 * 1000}` : ''
        }`,
      );
    };
  };

  /**
   * 전시그룹 상세 페이지 이동
   */
  const handleClickDisplayGroupItem = (feedId: number) => {
    return () => {
      navigate(`/display/discover/feed/${feedId}`);
    };
  };

  return {
    discoverFeedDisplayGroupItems:
      displayGroupType === DiscoverFeedDisplayGroupType.ENABLED
        ? discoverFeedDisplayGroupItems?.content ?? []
        : discoverFeedStopDisplayGroupItems?.content ?? [],
    discoverFeedDisplayGroupPagination,
    displayGroupType,
    handleClickCreateDisplayGroup,
    handleClickDisplayGroupItem,
  };
};
