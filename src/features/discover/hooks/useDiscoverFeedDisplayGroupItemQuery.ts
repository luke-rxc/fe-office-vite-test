import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverFeedDisplayGroup } from '../apis';
import { DiscoverFeedQueryKeys } from '../constants';
import { DiscoverFeedDisplayGroupModel, toDiscoverFeedDisplayGroupModel } from '../models';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';

/**
 * 디스커버 피드 전시그룹 아이템 조회 query
 */
export const useDiscoverFeedDisplayGroupItemQuery = (
  feedId: string,
  option: UseQueryOptions<DiscoverFeedDisplayGroupSchema, ErrorModel, DiscoverFeedDisplayGroupModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverFeedQueryKeys['detail']>>) => {
      const [{ feedId }] = queryKey;
      return getDiscoverFeedDisplayGroup(feedId);
    },
    [],
  );

  return useQuery(DiscoverFeedQueryKeys.detail(feedId), queryFn, {
    select: (data) => {
      return toDiscoverFeedDisplayGroupModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
