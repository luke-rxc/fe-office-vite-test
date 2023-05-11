import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { getGoodsList } from '../apis';
import { GoodsSearchParams } from '../types';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { GoodsSchema } from '../schemas';

export interface UseDiscoverGoodsListMutationOptions
  extends UseMutationOptions<PaginationResponse<GoodsSchema>, ErrorModel, GoodsSearchParams> {
  displaySpinner?: boolean;
}

export const useDiscoverGoodsListMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverGoodsListMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<PaginationResponse<GoodsSchema>, ErrorModel, GoodsSearchParams>((params) => getGoodsList(params), {
    onMutate: (...rest) => {
      displaySpinner && showLoading();
      onMutate && onMutate(...rest);
    },
    onSettled: (...rest) => {
      displaySpinner && hideLoading();
      onSettled && onSettled(...rest);
    },
    onError: (error: ErrorModel, ...rest) => {
      onError && onError(error, ...rest);
    },
    onSuccess: (...rest) => {
      onSuccess && onSuccess(...rest);
    },
    ...options,
  });
};
