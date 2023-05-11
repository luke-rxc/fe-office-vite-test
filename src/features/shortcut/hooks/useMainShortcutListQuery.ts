import { useQuery } from '@hooks/useQuery';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getMainShortcutList } from '../apis';
import { MainShortcutQueryKeys } from '../constants';
import { MainShortcutModel, toMainShortcutListModel } from '../models';
import { MainShortcutSchema } from '../schemas';
import { MainShortcutListParams } from '../types';

/**
 * 미편성 배너 리스트 조회 query
 */
export const useMainShortcutListQuery = (
  params: MainShortcutListParams,
  option: UseQueryOptions<
    PaginationResponse<MainShortcutSchema>,
    ErrorModel,
    PaginationResponse<MainShortcutModel>
  > = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainShortcutQueryKeys['bannerList']>>) => {
      const [{ params }] = queryKey;
      return getMainShortcutList(params);
    },
    [],
  );

  return useQuery(MainShortcutQueryKeys.bannerList(params), queryFn, {
    select: (data) => {
      return {
        ...data,
        content: toMainShortcutListModel(data.content),
      };
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
