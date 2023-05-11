import { MutateOptions, useQueryClient } from 'react-query';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import { updateBrand } from '../apis';
import type { UpdateBrandRequestParams } from '../types';

/**
 * 브랜드 상세 업데이트 서비스
 */
export const useBrandUpdateService = (brandId) => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  const { isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (params: UpdateBrandRequestParams) => updateBrand(brandId, params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('brands');
        hideLoading();
      },
      onError: (error) => {
        hideLoading();
      },
    },
  );

  const handleUpdateBrand = (
    values: UpdateBrandRequestParams,
    options: MutateOptions<unknown, ErrorModel, UpdateBrandRequestParams, unknown>,
  ) => {
    showLoading();
    mutate(values, options);
  };

  return {
    isLoading,
    isSuccess,
    mutateAsync,
    handleUpdateBrand,
  };
};
