import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getLiveDetail } from '../apis';
import { RaffleLiveQueryKeys } from '../constants';
import { LiveShowroomModel, toLiveShowroomModel } from '../models';
import { LiveShowroomSchema } from '../schemas';

/**
 * 라이브 상세 조회 query
 */
export const useLiveDetailQuery = (
  liveId: number,
  option: UseQueryOptions<LiveShowroomSchema, ErrorModel, LiveShowroomModel> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof RaffleLiveQueryKeys['detail']>>) => {
      const [{ liveId }] = queryKey;
      return getLiveDetail(liveId);
    },
    [],
  );

  return useQuery(RaffleLiveQueryKeys.detail(liveId), queryFn, {
    select: (data) => {
      return toLiveShowroomModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
