import { useCallback } from 'react';
import { default as toast } from 'react-hot-toast';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited, ArrayElement } from '../../types';
import { toSectionListModel } from '../../models';
import { SearchBaseSchema } from '../../schemas';
import { getSectionList, GetSectionListParams } from '../../apis';

type UseSectionListQueryOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getSectionList>>,
    ErrorModel,
    SearchBaseSchema<ArrayElement<ReturnType<typeof toSectionListModel>>>
  >,
  'select'
>;

export const SectionListQueryKeys = {
  all: [{ scope: 'section-list' }] as const,
  lists: () => [{ ...SectionListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: GetSectionListParams) => [{ ...SectionListQueryKeys.lists()[0], params }] as const,
} as const;

/**
 * 섹션 리스트 조회 Query
 */
export const useSectionListQuery = (params: GetSectionListParams, options?: UseSectionListQueryOptions) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof SectionListQueryKeys['list']>>) => {
    const [{ params }] = queryKey;
    return getSectionList(params);
  }, []);

  return useQuery(SectionListQueryKeys.list(params), queryFn, {
    select: (data) => ({
      ...data,
      content: toSectionListModel(data),
    }),
    onError: (error) => toast.error(error?.data?.message),
    ...options,
  });
};
