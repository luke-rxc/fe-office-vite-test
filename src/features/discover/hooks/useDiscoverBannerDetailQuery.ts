import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverBannerDetail } from '../apis';
import { DiscoverBannerQueryKeys } from '../constants';
import { DiscoverBannerDetailModel, toDiscoverBannerDetailModel } from '../models';
import { DiscoverBannerDetailSchema } from '../schemas';

/**
 * 디스커버 상세 조회 query
 */
export const useDiscoverBannerDetailQuery = (
  bannerId: string,
  option: UseQueryOptions<DiscoverBannerDetailSchema, ErrorModel, DiscoverBannerDetailModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverBannerQueryKeys['detail']>>) => {
      const [{ bannerId }] = queryKey;
      return getDiscoverBannerDetail(bannerId);
    },
    [],
  );

  return useQuery(DiscoverBannerQueryKeys.detail(bannerId), queryFn, {
    select: (data) => {
      return toDiscoverBannerDetailModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
