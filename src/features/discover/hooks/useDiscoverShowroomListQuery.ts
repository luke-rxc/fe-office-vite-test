import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { postDiscoverSectionShowroomList } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { ShowroomModel, toShowroomListModel } from '../models';
import { ShowroomSchema } from '../schemas';
import { DiscoverSectionTypeListParams } from '../types';

/**
 * 디스커버 쇼룸 리스트 조회 query
 */
export const useDiscoverShowroomListQuery = (
  params: DiscoverSectionTypeListParams,
  option: UseQueryOptions<PaginationResponse<ShowroomSchema>, ErrorModel, PaginationResponse<ShowroomModel>> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverCommonQueryKeys['showroomList']>>) => {
      const [{ params }] = queryKey;
      return postDiscoverSectionShowroomList(params);
    },
    [],
  );

  return useQuery(DiscoverCommonQueryKeys.showroomList(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toShowroomListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
