import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getBrandCombo } from '../apis';
import { BrandQueryKeys } from '../constants';
import { BrandComboModel, toBrandComboListModel } from '../models';
import { BrandComboListSchema } from '../schemas';

/**
 * 브랜드 콤보 조회 query hook
 */
export const useBrandComboQuery = (
  option: UseQueryOptions<BrandComboListSchema, ErrorModel, Array<BrandComboModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getBrandCombo();
  }, []);

  return useQuery(BrandQueryKeys.brandCombo(), queryFn, {
    select: (data) => {
      return toBrandComboListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
