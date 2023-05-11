import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getShowroomCombo } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { ShowroomComboModel, toShowroomComboListModel } from '../models';
import { ShowroomComboListSchema } from '../schemas';

/**
 * 디스커버 쇼룸 콤보 리스트 조회 query
 */
export const useDiscoverShowroomComboListQuery = (
  option: UseQueryOptions<ShowroomComboListSchema, ErrorModel, Array<ShowroomComboModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getShowroomCombo();
  }, []);

  return useQuery(DiscoverCommonQueryKeys.showroomComboList(), queryFn, {
    select: (data) => {
      return toShowroomComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
