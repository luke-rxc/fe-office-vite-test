import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverKeyword } from '../apis';

export interface UseDiscoverKeywordCreateMutationOptions extends UseMutationOptions<object, ErrorModel, string> {
  displaySpinner?: boolean;
}

export const useDiscoverKeywordCreateMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverKeywordCreateMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, string>((keyword) => postDiscoverKeyword(keyword), {
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
