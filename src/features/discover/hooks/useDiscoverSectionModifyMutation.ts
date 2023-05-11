import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { putDiscoverSection } from '../apis';
import { DiscoverSectionModifyParams } from '../types';

export interface UseDiscoverSectionModifyMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverSectionModifyParams> {
  displaySpinner?: boolean;
}

/**
 * 디스커버 섹션 수정 mutation
 */
export const useDiscoverSectionModifyMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverSectionModifyMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverSectionModifyParams>((params) => putDiscoverSection(params), {
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
