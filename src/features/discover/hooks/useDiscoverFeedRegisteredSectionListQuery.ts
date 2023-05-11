import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDiscoverSectionAllList } from '../apis';
import { DiscoverSectionQueryKeys } from '../constants';
import { DiscoverSectionItemModel, toDiscoverSectionListModel } from '../models';
import { DiscoverSectionItemSchema } from '../schemas';

/**
 * 디스커버 피드 기등록된 전시그룹 리스트 조회 query
 */
export const useDiscoverFeedRegisteredSectionListQuery = (
  option: UseQueryOptions<Array<DiscoverSectionItemSchema>, ErrorModel, Array<DiscoverSectionItemModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getDiscoverSectionAllList();
  }, []);

  return useQuery(DiscoverSectionQueryKeys.registeredList(), queryFn, {
    select: (data) => toDiscoverSectionListModel(data),
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
