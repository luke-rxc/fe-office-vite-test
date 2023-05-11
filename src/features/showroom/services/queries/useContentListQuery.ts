import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { getContentList, GetContentListParams } from '../../apis';
import { toContentListsModel } from '../../models';

type UseContentListQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof getContentList>>, ErrorModel, ReturnType<typeof toContentListsModel>>,
  'select'
>;

export const ContentListQueryKeys = {
  all: [{ scope: 'showroom-content' }] as const,
  lists: () => [{ ...ContentListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: GetContentListParams) => [{ ...ContentListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 콘텐츠 목록 조회 Query
 */
export const useContentListQuery = (params: GetContentListParams, options?: UseContentListQueryOptions) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof ContentListQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getContentList(params);
  }, []);

  return useQuery(ContentListQueryKeys.list(params), queryFn, {
    select: toContentListsModel,
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
