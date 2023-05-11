import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverBannerList } from '../apis';
import { DiscoverBannerQueryKeys } from '../constants';
import { DiscoverBannerModel, toDiscoverBannerListModel } from '../models';
import { DiscoverBannerSchema } from '../schemas';
import { DiscoverBannerListParams } from '../types';

/**
 * 미편성 배너 리스트 조회 query
 */
export const useDiscoverBannerListQuery = (
  params: DiscoverBannerListParams,
  option: UseQueryOptions<
    PaginationResponse<DiscoverBannerSchema>,
    ErrorModel,
    PaginationResponse<DiscoverBannerModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverBannerQueryKeys['bannerList']>>) => {
      const [{ params }] = queryKey;
      return getDiscoverBannerList(params);
    },
    [],
  );

  return useQuery(DiscoverBannerQueryKeys.bannerList(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toDiscoverBannerListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
