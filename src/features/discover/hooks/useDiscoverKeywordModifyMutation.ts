import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { putDiscoverKeyword } from '../apis';
import { DiscoverKeywordModifyParams } from '../types';

export interface UseDiscoverKeywordModifyMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverKeywordModifyParams> {
  displaySpinner?: boolean;
}

/**
 * 디스커버 키워드 수정 mutation
 */
export const useDiscoverKeywordModifyMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverKeywordModifyMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverKeywordModifyParams>((params) => putDiscoverKeyword(params), {
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
