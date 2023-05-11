import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postMainShortcutPublish } from '../apis';

export interface UseMainShortcutPublishMutationOptions extends UseMutationOptions<object, ErrorModel, number> {
  displaySpinner?: boolean;
}

export const useMainShortcutPublishMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseMainShortcutPublishMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, number>((params) => postMainShortcutPublish(params), {
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
