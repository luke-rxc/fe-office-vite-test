import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverKeywordList } from '../apis';
import { DiscoverKeywordQueryKeys } from '../constants';
import { DiscoverKeywordItemModel, toDiscoverKeywordListModel } from '../models/DiscoverKeywordModel';
import { DiscoverKeywordItemSchema } from '../schemas/DiscoverKeywordSchema';
import { DiscoverKeywordSearchParams } from '../types';

/**
 * 디스커버 키워드 리스트 조회 query
 */
export const useDiscoverKeywordListQuery = (
  params: DiscoverKeywordSearchParams,
  option: UseQueryOptions<
    PaginationResponse<DiscoverKeywordItemSchema>,
    ErrorModel,
    PaginationResponse<DiscoverKeywordItemModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverKeywordQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getDiscoverKeywordList(params);
    },
    [],
  );

  return useQuery(DiscoverKeywordQueryKeys.list(params), queryFn, {
    select: (data) => {
      return { ...data, content: toDiscoverKeywordListModel(data.content) };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
