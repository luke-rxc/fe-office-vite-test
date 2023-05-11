import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getLiveCombo } from '../apis';
import { RaffleLiveQueryKeys } from '../constants';
import { LiveComboItemModel, toLiveComboModel } from '../models';
import { LiveComboSchema } from '../schemas';

/**
 * 라이브 콤보 리스트 조회 query
 */
export const useLiveComboListQuery = (
  option: UseQueryOptions<LiveComboSchema, ErrorModel, Array<LiveComboItemModel>> = {},
) => {
  const queryFn = useCallback(({ queryKey }: QueryFunctionContext<ReturnType<typeof RaffleLiveQueryKeys['list']>>) => {
    return getLiveCombo();
  }, []);

  return useQuery(RaffleLiveQueryKeys.list(), queryFn, {
    select: (data) => {
      return toLiveComboModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
