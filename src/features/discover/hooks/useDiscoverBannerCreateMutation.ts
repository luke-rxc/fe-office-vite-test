import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverBannerCreate } from '../apis';
import { DiscoverBannerInfoParams } from '../types';
export interface UseDiscoverBannerCreateMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverBannerInfoParams> {
  displaySpinner?: boolean;
}

export const useDiscoverBannerCreateMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverBannerCreateMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverBannerInfoParams>((params) => postDiscoverBannerCreate(params), {
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
