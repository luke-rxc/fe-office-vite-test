import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getShowroomCombo } from '../apis';
import { RaffleShowroomQueryKeys } from '../constants';
import { ShowroomComboItemModel, toShowroomComboModel } from '../models';
import { ShowroomComboSchema } from '../schemas';

/**
 * 쇼룸 콤보 리스트 조회 query
 */
export const useShowroomComboListQuery = (
  option: UseQueryOptions<ShowroomComboSchema, ErrorModel, Array<ShowroomComboItemModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getShowroomCombo();
  }, []);

  return useQuery(RaffleShowroomQueryKeys.list(), queryFn, {
    select: (data) => {
      return toShowroomComboModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
