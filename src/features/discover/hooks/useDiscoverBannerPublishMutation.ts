import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverBannerPublish } from '../apis';

export interface UseDiscoverBannerPublishMutationOptions extends UseMutationOptions<object, ErrorModel, number> {
  displaySpinner?: boolean;
}

export const useDiscoverBannerPublishMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverBannerPublishMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, number>((params) => postDiscoverBannerPublish(params), {
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
