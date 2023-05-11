import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { deleteDiscoverFeedDisplayGroup } from '../apis';

export interface useDiscoverFeedDisplayGroupDeleteMutationOptions
  extends UseMutationOptions<string, ErrorModel, string> {
  displaySpinner?: boolean;
}

/**
 * 디스커버 피드 전시그룹 삭제 mutation
 */
export const useDiscoverFeedDisplayGroupDeleteMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: useDiscoverFeedDisplayGroupDeleteMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<string, ErrorModel, string>((params) => deleteDiscoverFeedDisplayGroup(params), {
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
