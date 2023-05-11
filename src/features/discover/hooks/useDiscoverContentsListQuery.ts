import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { postDiscoverSectionContentsList } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { ContentsModel, toContentsListModel } from '../models';
import { ContentsSchema } from '../schemas';
import { DiscoverSectionTypeListParams } from '../types';

/**
 * 디스커버 콘텐츠 리스트 조회 query
 */
export const useDiscoverContentsListQuery = (
  params: DiscoverSectionTypeListParams,
  option: UseQueryOptions<PaginationResponse<ContentsSchema>, ErrorModel, PaginationResponse<ContentsModel>> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverCommonQueryKeys['contentsList']>>) => {
      const [{ params }] = queryKey;
      return postDiscoverSectionContentsList(params);
    },
    [],
  );

  return useQuery(DiscoverCommonQueryKeys.contentsList(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toContentsListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
