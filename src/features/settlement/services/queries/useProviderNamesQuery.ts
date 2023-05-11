import { useQuery } from '@hooks/useQuery';
import { getProviderNamesForCombobox } from '../../apis';
import { toProviderNamesModel } from '../../models';

export interface UseProviderNamesQueryOptions {
  enabled?: boolean;
}

export const ProviderNamesQueryKeys = {
  all: [{ scope: 'combo-provider' }],
  list: () => [{ ...ProviderNamesQueryKeys.all[0], entity: 'list' }],
} as const;

/** 콤보박스를 위한 입점사명 리스트 Query */
export const useProviderNamesQuery = ({ enabled = true }: UseProviderNamesQueryOptions) => {
  return useQuery(ProviderNamesQueryKeys.list(), () => getProviderNamesForCombobox(), {
    select: toProviderNamesModel,
    enabled,
  });
};
