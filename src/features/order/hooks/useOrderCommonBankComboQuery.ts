import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getBankCombo } from '../apis';
import { OrderCommonQueryKeys } from '../constants';
import { ComboBankModel, toComboBankListModel } from '../models';
import { ComboBankSchema } from '../schemas';

/**
 * 주문 공통 은행 콤보 조회 query hook
 */
export const useOrderCommonBankComboQuery = (
  option: UseQueryOptions<Array<ComboBankSchema>, ErrorModel, Array<ComboBankModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getBankCombo();
  }, []);

  return useQuery(OrderCommonQueryKeys.bankCombo(), queryFn, {
    select: (data) => {
      return toComboBankListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
