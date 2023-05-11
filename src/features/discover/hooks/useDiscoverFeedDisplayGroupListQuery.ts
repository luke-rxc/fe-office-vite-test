import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverFeedDisplayGroupList } from '../apis';
import { DiscoverFeedQueryKeys } from '../constants';
import { DiscoverFeedDisplayGroupModel, toDiscoverFeedDisplayGroupListModel } from '../models';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';
import { DiscoverFeedDisplayGroupParams } from '../types';

/**
 * 디스커버 피드 전시그룹 리스트 조회 query
 */
export const useDiscoverFeedDisplayGroupListQuery = (
  params: DiscoverFeedDisplayGroupParams,
  option: UseQueryOptions<
    PaginationResponse<DiscoverFeedDisplayGroupSchema>,
    ErrorModel,
    PaginationResponse<DiscoverFeedDisplayGroupModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverFeedQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getDiscoverFeedDisplayGroupList(params);
    },
    [],
  );

  return useQuery(DiscoverFeedQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toDiscoverFeedDisplayGroupListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
