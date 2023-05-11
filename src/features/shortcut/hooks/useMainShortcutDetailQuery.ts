import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getMainShortcutDetail } from '../apis';
import { MainShortcutQueryKeys } from '../constants';
import { MainShortcutDetailModel, toMainShortcutDetailModel } from '../models';
import { MainShortcutDetailSchema } from '../schemas';

/**
 * 메인 상세 조회 query
 */
export const useMainShortcutDetailQuery = (
  shortcutId: string,
  option: UseQueryOptions<MainShortcutDetailSchema, ErrorModel, MainShortcutDetailModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof MainShortcutQueryKeys['detail']>>) => {
      const [{ shortcutId }] = queryKey;
      return getMainShortcutDetail(shortcutId);
    },
    [],
  );

  return useQuery(MainShortcutQueryKeys.detail(shortcutId), queryFn, {
    select: (data) => {
      return toMainShortcutDetailModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
