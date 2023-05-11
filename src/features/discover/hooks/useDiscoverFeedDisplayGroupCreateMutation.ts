import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverFeedDisplayGroup } from '../apis';
import { DiscoverFeedDisplayGroupInfoParams } from '../types';

export interface useDiscoverFeedDisplayGroupCreateMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverFeedDisplayGroupInfoParams> {
  displaySpinner?: boolean;
}

/**
 * 디스커버 피드 전시그룹 생성 mutation
 */
export const useDiscoverFeedDisplayGroupCreateMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: useDiscoverFeedDisplayGroupCreateMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverFeedDisplayGroupInfoParams>(
    (params) => postDiscoverFeedDisplayGroup(params),
    {
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
    },
  );
};
