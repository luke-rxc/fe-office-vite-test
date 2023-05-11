import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getMDCombo } from '../apis';
import { OrderCommonQueryKeys } from '../constants';
import { ComboMDModel, toComboMDListModel } from '../models';
import { ComboMDListSchema } from '../schemas';

/**
 * 주문 공통 MD 콤보 조회 query hook
 */
export const useOrderCommonMDComboQuery = (
  option: UseQueryOptions<ComboMDListSchema, ErrorModel, Array<ComboMDModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getMDCombo();
  }, []);

  return useQuery(OrderCommonQueryKeys.mdCombo(), queryFn, {
    select: (data) => {
      return toComboMDListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
