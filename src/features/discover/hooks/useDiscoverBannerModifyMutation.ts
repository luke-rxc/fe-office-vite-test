import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { putDiscoverBannerCreate } from '../apis';
import { DiscoverBannerInfoParams } from '../types';
export interface UseDiscoverBannerModifyMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverBannerInfoParams> {
  displaySpinner?: boolean;
}

export const useDiscoverBannerModifyMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverBannerModifyMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverBannerInfoParams>((params) => putDiscoverBannerCreate(params), {
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
