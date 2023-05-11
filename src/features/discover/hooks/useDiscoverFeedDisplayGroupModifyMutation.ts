import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { putDiscoverFeedDisplayGroup } from '../apis';
import { DiscoverFeedDisplayGroupInfoParams } from '../types';
import { DiscoverFeedDisplayGroupSchema } from '../schemas';

export interface useDiscoverFeedDisplayGroupModifyMutationOptions
  extends UseMutationOptions<DiscoverFeedDisplayGroupSchema, ErrorModel, DiscoverFeedDisplayGroupInfoParams> {
  displaySpinner?: boolean;
}

/**
 * 디스커버 피드 전시그룹 수정 mutation
 */
export const useDiscoverFeedDisplayGroupModifyMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: useDiscoverFeedDisplayGroupModifyMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<DiscoverFeedDisplayGroupSchema, ErrorModel, DiscoverFeedDisplayGroupInfoParams>(
    (params) => putDiscoverFeedDisplayGroup(params),
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
