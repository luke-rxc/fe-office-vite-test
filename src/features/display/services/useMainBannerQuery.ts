import { useQuery } from '@hooks/useQuery';
import { useCallback } from 'react';
import { QueryFunctionContext } from 'react-query';
import { getBanner, getBannerLandingInfo, getBannerList, getUnpublishedBannerList } from '../apis';
import { MainBannerQueryKeys } from '../constants';
import { toMainBannerDetailModel, toMainBannerModels, toUnpublishedMainBannerModel } from '../models';
import { GetBannerLandingInfoQueryParams, GetBannerQueryParams, MainBannerQueryState } from '../types';
import { isEveryValuesOccupied } from '../utils';

export const useBannerQuery = () => {
  const { data, isLoading } = useQuery(MainBannerQueryKeys.publishedList(), getBannerList, {
    select: toMainBannerModels,
    cacheTime: 0,
  });

  return { data, isLoading };
};

export const useUnpublishedBannerQuery = ({ queryState }: { queryState: MainBannerQueryState }) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainBannerQueryKeys['unpublishedList']>>) => {
      const [, , params] = queryKey;
      return getUnpublishedBannerList(params);
    },
    [],
  );

  const { data, isLoading } = useQuery(MainBannerQueryKeys.unpublishedList(queryState), queryFn, {
    select: toUnpublishedMainBannerModel,
    enabled: Boolean(queryState) && isEveryValuesOccupied(queryState),
    cacheTime: 0,
  });

  return { data, isLoading };
};

export const useBannerDetailQuery = (params: GetBannerQueryParams) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainBannerQueryKeys['detail']>>) => {
      const [, , params] = queryKey;
      return getBanner(params);
    },
    [],
  );

  const { data, status } = useQuery(MainBannerQueryKeys.detail(params), queryFn, {
    select: toMainBannerDetailModel,
  });

  return { data, status };
};

export const useBannerLandingInfoQuery = (params: GetBannerLandingInfoQueryParams | null) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainBannerQueryKeys['landingInfo']>>) => {
      const [, , params] = queryKey;
      return getBannerLandingInfo(params);
    },
    [],
  );

  const { data, status } = useQuery(MainBannerQueryKeys.landingInfo(params), queryFn, {
    enabled: Boolean(params) && isEveryValuesOccupied(params) && !!params.referenceId,
  });

  return { data, status };
};
