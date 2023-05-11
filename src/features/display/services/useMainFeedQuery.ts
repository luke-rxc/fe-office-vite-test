import { useQuery } from '@hooks/useQuery';
import { useCallback } from 'react';
import { QueryFunctionContext } from 'react-query';
import { getFeed, getFeedLandingInfo, getFeedList, getUnpublishedFeedList } from '../apis/feed';
import { MainFeedQueryKeys } from '../constants';
import { toMainFeedDetailModel, toMainFeedModels, toUnpublishedMainFeedModel } from '../models';
import { GetFeedLandingInfoQueryParams, GetFeedQueryParams, MainFeedQueryState } from '../types';
import { isEveryValuesOccupied } from '../utils';

export const useMainFeedQuery = () => {
  const { data, isLoading } = useQuery(MainFeedQueryKeys.publishedList(), getFeedList, {
    select: toMainFeedModels,
    cacheTime: 0,
  });

  return { data, isLoading };
};

export const useUnpublishedFeedQuery = ({ queryState }: { queryState: MainFeedQueryState }) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainFeedQueryKeys['unpublishedList']>>) => {
      const [, , params] = queryKey;
      return getUnpublishedFeedList(params);
    },
    [],
  );

  const { data, isLoading } = useQuery(MainFeedQueryKeys.unpublishedList(queryState), queryFn, {
    select: toUnpublishedMainFeedModel,
    enabled: Boolean(queryState) && isEveryValuesOccupied(queryState),
    cacheTime: 0,
  });

  return { data, isLoading };
};

export const useFeedDetailQuery = (params: GetFeedQueryParams) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof MainFeedQueryKeys['detail']>>) => {
    const [, , params] = queryKey;
    return getFeed(params);
  }, []);

  const { data, status } = useQuery(MainFeedQueryKeys.detail(params), queryFn, {
    select: toMainFeedDetailModel,
  });

  return { data, status };
};

export const useFeedLandingInfoQuery = (params: GetFeedLandingInfoQueryParams | null) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainFeedQueryKeys['landingInfo']>>) => {
      const [, , params] = queryKey;
      return getFeedLandingInfo(params);
    },
    [],
  );

  const { data, status } = useQuery(MainFeedQueryKeys.landingInfo(params), queryFn, {
    enabled: Boolean(params) && isEveryValuesOccupied(params) && !!params.referenceId,
  });

  return { data, status };
};
