import { useCallback } from 'react';
import { UseQueryOptions, QueryFunctionContext } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { getBrandComboList, GetBrandComboListParams } from '../../apis';
import { Awaited } from '../../types';

type UseBrandComboListQueryParams = Omit<
  UseQueryOptions<
    Awaited<ReturnType<typeof getBrandComboList>>,
    ErrorModel,
    Awaited<ReturnType<typeof getBrandComboList>>['items']
  >,
  'select'
>;

export const BrandComboListQueryKeys = {
  all: [{ scope: 'showroom-combo-brand' }] as const,
  lists: () => [{ ...BrandComboListQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: GetBrandComboListParams) => [{ ...BrandComboListQueryKeys.lists(), params }] as const,
} as const;

/**
 * 브랜드 콤보 목록 조회 Query
 */
export const useBrandComboListQuery = (params?: GetBrandComboListParams, options?: UseBrandComboListQueryParams) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof BrandComboListQueryKeys['list']>>) => {
      const [{ params }] = queryKey;
      return getBrandComboList(params);
    },
    [],
  );

  return useQuery(BrandComboListQueryKeys.list(params), queryFn, {
    select: (data) => data.items,
    ...options,
  });
};
