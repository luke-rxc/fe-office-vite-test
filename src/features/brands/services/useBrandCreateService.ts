import { MutateOptions, useQueryClient } from 'react-query';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import { createBrand } from '../apis';
import type { CreateBrandRequestParams } from '../types';

/**
 * 브랜드 생성 서비스
 */
export const useBrandCreateService = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  const { isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (params: CreateBrandRequestParams) => createBrand(params),
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

  const handleCreateBrand = (
    values: CreateBrandRequestParams,
    options: MutateOptions<unknown, ErrorModel, CreateBrandRequestParams, unknown>,
  ) => {
    showLoading();
    mutate(values, options);
  };

  return {
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    handleCreateBrand,
  };
};
