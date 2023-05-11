import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { getBrandCombo } from '../apis';
import { DiscoverCommonQueryKeys } from '../constants';
import { BrandComboModel, toBrandComboListModel } from '../models';
import { BrandComboListSchema } from '../schemas';

/**
 * 디스커버 브랜드 콤보 리스트 조회 query
 */
export const useDiscoverBrandComboListQuery = (
  providerId?: number,
  option: UseQueryOptions<BrandComboListSchema, ErrorModel, Array<BrandComboModel>> = {},
) => {
  const queryFn = useCallback(
    ({ queryKey }: QueryFunctionContext<ReturnType<typeof DiscoverCommonQueryKeys['brandComboList']>>) => {
      const [{ providerId }] = queryKey;
      return getBrandCombo(providerId);
    },
    [],
  );

  return useQuery(DiscoverCommonQueryKeys.brandComboList(providerId), queryFn, {
    select: (data) => {
      return toBrandComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
