import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getProviderCombo } from '../apis';
import { ProviderQueryKeys } from '../constants';
import { ProviderComboModel, toProviderComboListModel } from '../models';
import { ProviderComboListSchema } from '../schemas';

/**
 * 입점사 콤보 조회 query hook
 */
export const useProviderComboQuery = (
  option: UseQueryOptions<ProviderComboListSchema, ErrorModel, Array<ProviderComboModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getProviderCombo();
  }, []);

  return useQuery(ProviderQueryKeys.providerCombo(), queryFn, {
    select: (data) => {
      return toProviderComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
