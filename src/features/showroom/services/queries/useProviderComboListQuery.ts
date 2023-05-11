import { UseQueryOptions } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { Awaited } from '../../types';
import { getProviderComboList } from '../../apis';

type UseProviderComboListQuery = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getProviderComboList>>,
    ErrorModel,
    Awaited<ReturnType<typeof getProviderComboList>>['items']
  >,
  'select'
>;

/**
 * 쇼룸 입점사 목록 조회 QueryKey
 */
export const ProvidersComboListQueryKeys = {
  all: [{ scope: 'showroom-combo-provider' }] as const,
  list: () => [{ ...ProvidersComboListQueryKeys.all[0], entity: 'list' }] as const,
} as const;

/**
 * 쇼룸 입점사 목록 조회 Query
 */
export const useProviderComboListQuery = (options?: UseProviderComboListQuery) => {
  return useQuery(ProvidersComboListQueryKeys.list(), getProviderComboList, {
    select: (data) => data.items,
    ...options,
  });
};
