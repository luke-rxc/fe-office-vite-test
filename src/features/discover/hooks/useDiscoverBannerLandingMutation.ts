import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { getDiscoverBannerLandingInfo } from '../apis';
import { DiscoverBannerLandingInfoQueryParams } from '../types';
import { DiscoverBannerLandingInfoSchema } from '../schemas';
export interface UseDiscoverBannerLandingMutationOptions
  extends UseMutationOptions<DiscoverBannerLandingInfoSchema, ErrorModel, DiscoverBannerLandingInfoQueryParams> {
  displaySpinner?: boolean;
}

export const useDiscoverBannerLandingMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverBannerLandingMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<DiscoverBannerLandingInfoSchema, ErrorModel, DiscoverBannerLandingInfoQueryParams>(
    (params) => getDiscoverBannerLandingInfo(params),
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
