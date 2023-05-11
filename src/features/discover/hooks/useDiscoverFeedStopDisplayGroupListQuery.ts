import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverFeedStopDisplayGroupList } from '../apis';
import { DiscoverFeedQueryKeys } from '../constants';
import { DiscoverFeedDisplayGroupModel, toDiscoverFeedDisplayGroupListModel } from '../models';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';
import { DiscoverFeedDisplayGroupParams } from '../types';

/**
 * 디스커버 피드 전시그룹(중지) 리스트 조회 query
 */
export const useDiscoverFeedStopDisplayGroupListQuery = (
  params: DiscoverFeedDisplayGroupParams,
  discoverFeedDisplayGroupItems?: PaginationResponse<DiscoverFeedDisplayGroupModel>,
  option: UseQueryOptions<
    PaginationResponse<DiscoverFeedDisplayGroupSchema>,
    ErrorModel,
    PaginationResponse<DiscoverFeedDisplayGroupModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverFeedQueryKeys['stopList']>>) => {
      const [{ params }] = queryKey;
      return getDiscoverFeedStopDisplayGroupList(params);
    },
    [],
  );

  return useQuery(DiscoverFeedQueryKeys.stopList(params), queryFn, {
    select: (data) => {
      const content = toDiscoverFeedDisplayGroupListModel(data.content);
      if (discoverFeedDisplayGroupItems?.content.length > 0) {
        content[content.length - 1].displayEndDateText = discoverFeedDisplayGroupItems.content[0].displayStartDateText;
      }
      return {
        ...data,
        content,
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
