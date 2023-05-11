import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDiscoverBannerPublishedList } from '../apis';
import { DiscoverBannerQueryKeys } from '../constants';
import { DiscoverBannerModel, toDiscoverBannerListModel } from '../models';
import { DiscoverBannerSchema } from '../schemas';

/**
 * 편성 배너 리스트 조회 query
 */
export const useDiscoverBannerPublishedListQuery = (
  option: UseQueryOptions<Array<DiscoverBannerSchema>, ErrorModel, Array<DiscoverBannerModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getDiscoverBannerPublishedList();
  }, []);

  return useQuery(DiscoverBannerQueryKeys.bannerPublishedList(), queryFn, {
    select: (data) => toDiscoverBannerListModel(data),
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
