import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDiscoverFeedRegisteredDisplayGroupList } from '../apis';
import { DiscoverFeedQueryKeys } from '../constants';
import { DiscoverFeedDisplayGroupModel, toDiscoverFeedDisplayGroupListModel } from '../models';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';

/**
 * 디스커버 피드 기등록된 전시그룹 리스트 조회 query
 */
export const useDiscoverFeedRegisteredDisplayGroupListQuery = (
  option: UseQueryOptions<Array<DiscoverFeedDisplayGroupSchema>, ErrorModel, Array<DiscoverFeedDisplayGroupModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getDiscoverFeedRegisteredDisplayGroupList();
  }, []);

  return useQuery(DiscoverFeedQueryKeys.registeredList(), queryFn, {
    select: (data) => {
      return toDiscoverFeedDisplayGroupListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
