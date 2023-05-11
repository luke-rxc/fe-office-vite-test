import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverSectionList } from '../apis';
import { DiscoverSectionQueryKeys } from '../constants';
import { DiscoverSectionItemModel, toDiscoverSectionListModel } from '../models';
import { DiscoverSectionItemSchema } from '../schemas';
import { DiscoverSectionQueryState } from '../types';

/**
 * 디스커버 섹션 리스트 조회 query
 */
export const useDiscoverSectionListQuery = (
  params: DiscoverSectionQueryState,
  option: UseQueryOptions<
    PaginationResponse<DiscoverSectionItemSchema>,
    ErrorModel,
    PaginationResponse<DiscoverSectionItemModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverSectionQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getDiscoverSectionList(params);
    },
    [],
  );

  return useQuery(DiscoverSectionQueryKeys.list(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toDiscoverSectionListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
