import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getProviderCombo } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { ProviderComboModel, toProviderComboListModel } from '../models';
import { ProviderComboListSchema } from '../schemas';

/**
 * 디스커버 입점사 콤보 리스트 조회 query
 */
export const useDiscoverProviderComboListQuery = (
  option: UseQueryOptions<ProviderComboListSchema, ErrorModel, Array<ProviderComboModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getProviderCombo();
  }, []);

  return useQuery(DiscoverCommonQueryKeys.providerComboList(), queryFn, {
    select: (data) => {
      return toProviderComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
