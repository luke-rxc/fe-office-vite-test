import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getDiscoverKeyword } from '../apis';
import { DiscoverKeywordQueryKeys } from '../constants';
import { DiscoverKeywordItemModel, toDiscoverKeywordItemModel } from '../models';
import { DiscoverKeywordItemSchema } from '../schemas';

/**
 * 디스커버 섹션 상세 조회 query
 */
export const useDiscoverKeywordDetailQuery = (
  keywordId: string,
  option: UseQueryOptions<DiscoverKeywordItemSchema, ErrorModel, DiscoverKeywordItemModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverKeywordQueryKeys['detail']>>) => {
      const [{ keywordId }] = queryKey;
      return getDiscoverKeyword(keywordId);
    },
    [],
  );

  return useQuery(DiscoverKeywordQueryKeys.detail(keywordId), queryFn, {
    select: (data) => {
      return toDiscoverKeywordItemModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
